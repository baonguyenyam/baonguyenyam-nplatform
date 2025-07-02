import { NextRequest, NextResponse } from 'next/server';

// API Response Optimization Middleware
export class APIOptimizationMiddleware {

	// Compress response if client supports it
	static addCompressionHeaders(response: NextResponse, contentLength?: number): NextResponse {
		// Add compression hints
		response.headers.set('Vary', 'Accept-Encoding');

		// Only compress if content is large enough
		if (contentLength && contentLength > 1024) {
			response.headers.set('Content-Encoding', 'gzip');
		}

		return response;
	}

	// Add performance headers
	static addPerformanceHeaders(response: NextResponse): NextResponse {
		response.headers.set('X-Content-Type-Options', 'nosniff');
		response.headers.set('X-Frame-Options', 'DENY');
		response.headers.set('X-XSS-Protection', '1; mode=block');
		response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

		// Add timing headers for monitoring
		response.headers.set('X-Response-Time', Date.now().toString());

		return response;
	}

	// Add caching headers based on content type
	static addCachingHeaders(
		response: NextResponse,
		path: string,
		isAuthenticated: boolean = false
	): NextResponse {

		// Different caching strategies based on path
		if (path.startsWith('/api/v1/public/')) {
			// Public endpoints - aggressive caching
			response.headers.set('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
		} else if (path.startsWith('/api/v1/admin/') && !isAuthenticated) {
			// Admin endpoints for unauthenticated - no cache
			response.headers.set('Cache-Control', 'no-store');
		} else if (path.includes('/users') || path.includes('/auth')) {
			// User-specific data - short cache
			response.headers.set('Cache-Control', 'private, max-age=300');
		} else {
			// Default caching
			response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
		}

		return response;
	}

	// Handle conditional requests (ETag)
	static handleConditionalRequest(request: NextRequest, response: NextResponse): NextResponse | null {
		const ifNoneMatch = request.headers.get('if-none-match');
		const etag = response.headers.get('etag');

		if (ifNoneMatch && etag && ifNoneMatch === etag) {
			return new NextResponse(null, {
				status: 304,
				headers: {
					'etag': etag,
					'cache-control': response.headers.get('cache-control') || '',
				},
			});
		}

		return response;
	}

	// Rate limiting with adaptive limits
	static async checkRateLimit(
		request: NextRequest,
		identifier: string,
		userRole?: string
	): Promise<{ allowed: boolean; headers: Record<string, string> }> {

		// Adaptive rate limits based on user role
		const limits = {
			'ADMIN': { requests: 1000, window: 15 * 60 * 1000 },
			'USER': { requests: 300, window: 15 * 60 * 1000 },
			'PUBLIC': { requests: 100, window: 15 * 60 * 1000 },
		};

		const limit = limits[userRole as keyof typeof limits] || limits.PUBLIC;

		// This would typically use Redis or a proper rate limiting service
		// For now, returning a simplified implementation
		const headers = {
			'X-RateLimit-Limit': limit.requests.toString(),
			'X-RateLimit-Remaining': (limit.requests - 1).toString(),
			'X-RateLimit-Reset': (Date.now() + limit.window).toString(),
		};

		return { allowed: true, headers };
	}

	// Monitor API performance
	static monitorPerformance(
		request: NextRequest,
		response: NextResponse,
		startTime: number
	): void {
		const duration = Date.now() - startTime;
		const method = request.method;
		const path = new URL(request.url).pathname;

		// Log slow requests
		if (duration > 1000) {
			console.warn(`Slow API request: ${method} ${path} took ${duration}ms`);
		}

		// Add performance timing header
		response.headers.set('X-Response-Time', `${duration}ms`);

		// In production, you might want to send this to a monitoring service
		if (process.env.NODE_ENV === 'production') {
			// Example: send to monitoring service
			// await sendToMonitoring({ method, path, duration, status: response.status });
		}
	}

	// Complete middleware function
	static async optimize(
		request: NextRequest,
		response: NextResponse,
		options: {
			isAuthenticated?: boolean;
			userRole?: string;
			identifier?: string;
			startTime?: number;
		} = {}
	): Promise<NextResponse> {
		const {
			isAuthenticated = false,
			userRole,
			identifier = 'anonymous',
			startTime = Date.now()
		} = options;

		const path = new URL(request.url).pathname;

		// Check rate limiting
		const rateLimit = await this.checkRateLimit(request, identifier, userRole);
		if (!rateLimit.allowed) {
			return new NextResponse('Rate limit exceeded', {
				status: 429,
				headers: rateLimit.headers,
			});
		}

		// Add rate limit headers
		Object.entries(rateLimit.headers).forEach(([key, value]) => {
			response.headers.set(key, value);
		});

		// Add performance headers
		this.addPerformanceHeaders(response);

		// Add caching headers
		this.addCachingHeaders(response, path, isAuthenticated);

		// Handle conditional requests
		const conditionalResponse = this.handleConditionalRequest(request, response);
		if (conditionalResponse) {
			return conditionalResponse;
		}

		// Add compression headers
		const contentLength = response.headers.get('content-length');
		this.addCompressionHeaders(response, contentLength ? parseInt(contentLength) : undefined);

		// Monitor performance
		this.monitorPerformance(request, response, startTime);

		return response;
	}
}

// Usage in API routes
export function withOptimization(handler: Function) {
	return async (request: NextRequest) => {
		const startTime = Date.now();

		try {
			const response = await handler(request);

			// Apply optimizations
			return await APIOptimizationMiddleware.optimize(request, response, {
				startTime,
				// Add user context here if available
			});

		} catch (error) {
			console.error('API Error:', error);

			const errorResponse = new NextResponse(
				JSON.stringify({ error: 'Internal Server Error' }),
				{
					status: 500,
					headers: { 'Content-Type': 'application/json' },
				}
			);

			return await APIOptimizationMiddleware.optimize(request, errorResponse, {
				startTime,
			});
		}
	};
}
