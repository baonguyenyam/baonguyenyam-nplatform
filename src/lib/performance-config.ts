// Performance optimization configuration for nPlatform

export const PERFORMANCE_CONFIG = {
	// Database configuration
	DATABASE: {
		CONNECTION_POOL_SIZE: 20,
		CONNECTION_TIMEOUT: 30000,
		IDLE_TIMEOUT: 10000,
		MAX_LIFETIME: 1800000, // 30 minutes
	},

	// Cache configuration
	CACHE: {
		DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
		USER_TTL: 15 * 60 * 1000, // 15 minutes
		STATIC_TTL: 60 * 60 * 1000, // 1 hour
		MAX_SIZE: 1000, // Maximum number of cached items
	},

	// API configuration
	API: {
		DEFAULT_PAGE_SIZE: 20,
		MAX_PAGE_SIZE: 100,
		RATE_LIMIT: {
			PUBLIC: {
				REQUESTS: 100,
				WINDOW: 15 * 60 * 1000, // 15 minutes
			},
			AUTHENTICATED: {
				REQUESTS: 500,
				WINDOW: 15 * 60 * 1000, // 15 minutes
			},
			ADMIN: {
				REQUESTS: 1000,
				WINDOW: 15 * 60 * 1000, // 15 minutes
			},
		},
	},

	// Image optimization
	IMAGES: {
		FORMATS: ["webp", "avif", "jpeg"],
		SIZES: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		QUALITY: 80,
		CACHE_MAX_AGE: 31536000, // 1 year
	},

	// File upload limits
	UPLOAD: {
		MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
		ALLOWED_TYPES: {
			IMAGES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
			DOCUMENTS: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
			VIDEOS: ["video/mp4", "video/webm"],
		},
	},

	// Search configuration
	SEARCH: {
		MIN_QUERY_LENGTH: 2,
		MAX_RESULTS: 50,
		FUZZY_THRESHOLD: 0.6,
	},
};

// Environment-specific overrides
export const getPerformanceConfig = () => {
	const config = { ...PERFORMANCE_CONFIG };

	if (process.env.NODE_ENV === "production") {
		// Production optimizations
		config.CACHE.DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes
		config.CACHE.USER_TTL = 30 * 60 * 1000; // 30 minutes
		config.CACHE.STATIC_TTL = 2 * 60 * 60 * 1000; // 2 hours
		config.API.DEFAULT_PAGE_SIZE = 25;
	}

	if (process.env.NODE_ENV === "development") {
		// Development optimizations
		config.CACHE.DEFAULT_TTL = 30 * 1000; // 30 seconds
		config.CACHE.USER_TTL = 60 * 1000; // 1 minute
		config.API.DEFAULT_PAGE_SIZE = 10;
	}

	return config;
};

export default getPerformanceConfig();
