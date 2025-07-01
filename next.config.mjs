const nextConfig = {
	env: {
		public_APIUrl: process.env.PUBLIC_API_URL,
	},
	eslint: {
		ignoreDuringBuilds: true,
		dirs: ["src/components/editor", "src/components/pagebuilder"],
	},
	compress: true,
	crossOrigin: "anonymous",
	poweredByHeader: false,
	sassOptions: {
		silenceDeprecations: ["legacy-js-api"],
	},
	experimental: {
		serverActions: {
			// Limit file upload size
			bodySizeLimit: process.env.MAX_FILE_SIZE || "10mb",
		},
		webpackMemoryOptimizations: true,
		cssChunking: true,
		nextScriptWorkers: false,
		inlineCss: true,
		staleTimes: {
			dynamic: 30,
			static: 180,
		},
		// Enable partial prerendering for better performance
		ppr: "incremental",
		// Enable optimized package imports
		optimizePackageImports: [
			"@radix-ui/react-icons",
			"@radix-ui/react-dropdown-menu",
			"@radix-ui/react-dialog",
			"lucide-react",
		],
	},
	// Add webpack optimization
	webpack: (config, { dev, isServer }) => {
		// Production optimizations
		if (!dev) {
			config.optimization = {
				...config.optimization,
				splitChunks: {
					...config.optimization.splitChunks,
					cacheGroups: {
						...config.optimization.splitChunks.cacheGroups,
						vendor: {
							test: /[\\/]node_modules[\\/]/,
							name: 'vendors',
							chunks: 'all',
							priority: 10,
						},
						common: {
							name: 'common',
							minChunks: 2,
							priority: 5,
							reuseExistingChunk: true,
							chunks: 'all',
						},
					},
				},
			};
		}

		return config;
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	images: {
		formats: ['image/webp', 'image/avif'],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
		dangerouslyAllowSVG: true,
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*",
			},
			{
				protocol: "http",
				hostname: "*",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
		],
	},
};

export default nextConfig;
