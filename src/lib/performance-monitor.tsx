import { useEffect, useRef, useState } from 'react';

// Performance monitoring utility
interface PerformanceMetrics {
  renderTime: number;
  componentSize: number;
  rerenderCount: number;
  memoryUsage?: number;
}

// Hook to monitor component performance
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    componentSize: 0,
    rerenderCount: 0,
  });

  useEffect(() => {
    startTime.current = performance.now();
    renderCount.current += 1;

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime.current;

      // Get memory usage if available
      const memoryInfo = (performance as any).memory;
      const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize : undefined;

      setMetrics({
        renderTime,
        componentSize: document.querySelector(`[data-component="${componentName}"]`)?.children.length || 0,
        rerenderCount: renderCount.current,
        memoryUsage,
      });

      // Log performance in development
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(`🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    };
  });

  return metrics;
}

// HOC for performance monitoring
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function PerformanceMonitoredComponent(props: P) {
    const metrics = usePerformanceMonitor(componentName);

    return (
      <div data-component={componentName}>
        <Component {...props} />
        {process.env.NODE_ENV === 'development' && (
          <div style={{ display: 'none' }} data-metrics={JSON.stringify(metrics)} />
        )}
      </div>
    );
  };
}

// Bundle size analyzer utility
export function analyzeBundleSize() {
  if (typeof window === 'undefined') return null;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

  return {
    scriptCount: scripts.length,
    stylesheetCount: stylesheets.length,
    totalResources: scripts.length + stylesheets.length,
    largestScript: scripts.reduce((largest, script) => {
      const src = script.getAttribute('src') || '';
      return src.length > largest.length ? src : largest;
    }, ''),
  };
}

// Memory usage tracker
export function trackMemoryUsage() {
  if (typeof window === 'undefined' || !(performance as any).memory) {
    return null;
  }

  const memory = (performance as any).memory;
  return {
    used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
    total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
    limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
  };
}

// Performance tips based on component analysis
export function getPerformanceTips(metrics: PerformanceMetrics): string[] {
  const tips: string[] = [];

  if (metrics.renderTime > 16) {
    tips.push('Consider using React.memo() to prevent unnecessary re-renders');
  }

  if (metrics.rerenderCount > 10) {
    tips.push('High re-render count detected. Check your dependencies and use useMemo/useCallback');
  }

  if (metrics.componentSize > 100) {
    tips.push('Large component detected. Consider splitting into smaller components');
  }

  if (metrics.memoryUsage && metrics.memoryUsage > 50 * 1024 * 1024) {
    tips.push('High memory usage. Check for memory leaks and large objects');
  }

  return tips;
}

// Performance dashboard component for development
export function PerformanceDashboard() {
  const [bundleInfo, setBundleInfo] = useState<any>(null);
  const [memoryInfo, setMemoryInfo] = useState<any>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setBundleInfo(analyzeBundleSize());
      setMemoryInfo(trackMemoryUsage());

      const interval = setInterval(() => {
        setMemoryInfo(trackMemoryUsage());
      }, 5000);

      return () => clearInterval(interval);
    }
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        zIndex: 9999,
        fontFamily: 'monospace',
        maxWidth: '300px',
      }}
    >
      <h4>Performance Dashboard</h4>
      {bundleInfo && (
        <div>
          <strong>Bundle:</strong> {bundleInfo.scriptCount} scripts, {bundleInfo.stylesheetCount} styles
        </div>
      )}
      {memoryInfo && (
        <div>
          <strong>Memory:</strong> {memoryInfo.used}MB / {memoryInfo.total}MB
        </div>
      )}
      <div style={{ fontSize: '10px', marginTop: '5px', opacity: 0.7 }}>
        Only visible in development
      </div>
    </div>
  );
}
