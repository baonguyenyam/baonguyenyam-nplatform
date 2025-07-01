import { ComponentType } from 'react';
import React from 'react';
import dynamic from 'next/dynamic';

// Loading components
const TableLoading = () => (
	<div className="animate-pulse bg-gray-200 h-32 rounded"></div>
);

const DrawerLoading = () => (
	<div className="animate-pulse bg-gray-100 h-screen w-96"></div>
);

const EditorLoading = () => (
	<div className="animate-pulse bg-gray-200 h-screen w-full"></div>
);

// Lazy load heavy components to reduce initial bundle size
export const LazyComponents = {
	// Admin components
	AppTable: dynamic(() => import('@/components/AppTable'), {
		loading: TableLoading
	}),

	// Drawer components with lazy loading
	Drawer: dynamic(() => import('antd').then(mod => ({ default: mod.Drawer })), {
		loading: DrawerLoading
	}),

	// Editor components (heavy)
	Puck: dynamic(() => import('@measured/puck').then(mod => ({ default: mod.Puck })), {
		loading: EditorLoading
	}),

	Render: dynamic(() => import('@measured/puck').then(mod => ({ default: mod.Render })), {
		loading: EditorLoading
	}),
};

// HOC for lazy loading with error boundary
export function withLazyLoading<P extends object>(
	Component: ComponentType<P>,
	fallback?: ComponentType
) {
	const LazyComponent = dynamic(() => Promise.resolve(Component), {
		loading: () => fallback ? React.createElement(fallback) : <TableLoading />
	});

	return LazyComponent;
}

// Preload critical components
export const preloadComponents = {
	preloadAppTable: () => import('@/components/AppTable'),
	preloadDrawer: () => import('antd').then(mod => mod.Drawer),
	preloadPuck: () => import('@measured/puck'),
};

// Component registry for dynamic component loading
export const ComponentRegistry = new Map<string, () => Promise<any>>([
	['AppTable', () => import('@/components/AppTable')],
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
