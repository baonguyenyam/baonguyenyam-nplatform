import { ComponentType } from 'react';
import dynamic from 'next/dynamic';

// Loading components
const TableLoading = () => <div className="animate-pulse bg-gray-200 h-32 rounded"></div>;
const DrawerLoading = () => <div className="animate-pulse bg-gray-100 h-screen w-96"></div>;
const EditorLoading = () => <div className="animate-pulse bg-gray-200 h-screen w-full"></div>;
const RenderLoading = () => <div className="animate-pulse bg-gray-200 h-96 w-full"></div>;
const GalleryLoading = () => <div className="animate-pulse bg-gray-200 h-64 w-full"></div>;
const CodeLoading = () => <div className="animate-pulse bg-gray-900 h-64 w-full rounded"></div>;
const ChartLoading = () => <div className="animate-pulse bg-gray-200 h-64 w-full"></div>;

// Lazy load heavy components to reduce initial bundle size
export const LazyComponents = {
	// Drawer components with lazy loading
	Drawer: dynamic(() => import('antd').then(mod => ({ default: mod.Drawer })), {
		loading: DrawerLoading
	}),

	// Editor components (heavy)
	Puck: dynamic(() => import('@measured/puck').then(mod => ({ default: mod.Puck })), {
		loading: EditorLoading
	}),

	Render: dynamic(() => import('@measured/puck').then(mod => ({ default: mod.Render })), {
		loading: RenderLoading
	}),

	// Image gallery (heavy)
	LightGallery: dynamic(() => import('lightgallery/react'), {
		loading: GalleryLoading
	}),

	// Code editor (very heavy)
	CodeMirror: dynamic(() => import('@uiw/react-codemirror'), {
		loading: CodeLoading
	}),
};

// HOC for lazy loading with error boundary
export function withLazyLoading<P extends object>(
	Component: ComponentType<P>,
	fallback?: ComponentType
) {
	const FallbackComponent = fallback || (() => <div className="animate-pulse bg-gray-200 h-32 rounded"></div>);
	
	const LazyComponent = dynamic(() => Promise.resolve(Component), {
		loading: () => <FallbackComponent />
	});

	return LazyComponent;
}

// Preload critical components
export const preloadComponents = {
	preloadDrawer: () => import('antd').then(mod => mod.Drawer),
	preloadPuck: () => import('@measured/puck'),
};

// Component registry for dynamic component loading
export const ComponentRegistry = new Map<string, () => Promise<any>>([
	['Drawer', () => import('antd').then(mod => ({ default: mod.Drawer }))],
	['Puck', () => import('@measured/puck').then(mod => ({ default: mod.Puck }))],
	['Render', () => import('@measured/puck').then(mod => ({ default: mod.Render }))],
]);

// Dynamic component loader
export async function loadComponent(name: string) {
	const loader = ComponentRegistry.get(name);
	if (loader) {
		return await loader();
	}
	throw new Error(`Component ${name} not found in registry`);
}
