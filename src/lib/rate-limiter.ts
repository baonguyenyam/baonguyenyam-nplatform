import { PERFORMANCE_CONFIG } from "@/lib/performance-config";

// Simple in-memory rate limiter
class RateLimiter {
	private requests: Map<string, { count: number; resetTime: number }> =
		new Map();

	isAllowed(identifier: string, limit: number, windowMs: number): boolean {
		const now = Date.now();
		const userRequests = this.requests.get(identifier);

		if (!userRequests || now > userRequests.resetTime) {
			// First request or window has expired
			this.requests.set(identifier, {
				count: 1,
				resetTime: now + windowMs,
			});
			return true;
		}

		if (userRequests.count >= limit) {
			return false;
		}

		userRequests.count++;
		return true;
	}

	getRemainingRequests(identifier: string, limit: number): number {
		const userRequests = this.requests.get(identifier);
		if (!userRequests) return limit;
		return Math.max(0, limit - userRequests.count);
	}

	getResetTime(identifier: string): number {
		const userRequests = this.requests.get(identifier);
		return userRequests?.resetTime || 0;
	}

	// Clean up expired entries periodically
	cleanup(): void {
		const now = Date.now();
		for (const [key, value] of this.requests.entries()) {
			if (now > value.resetTime) {
				this.requests.delete(key);
			}
		}
	}
}

const rateLimiter = new RateLimiter();

// Clean up expired entries every 5 minutes
setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);

export function checkRateLimit(
	identifier: string,
	userRole: "PUBLIC" | "AUTHENTICATED" | "ADMIN" = "PUBLIC",
): {
	success: boolean;
	limit: number;
	remaining: number;
	resetTime: number;
} {
	const config = PERFORMANCE_CONFIG.API.RATE_LIMIT[userRole];

	const allowed = rateLimiter.isAllowed(
		identifier,
		config.REQUESTS,
		config.WINDOW,
	);

	return {
		success: allowed,
		limit: config.REQUESTS,
		remaining: rateLimiter.getRemainingRequests(identifier, config.REQUESTS),
		resetTime: rateLimiter.getResetTime(identifier),
	};
}

export function getRateLimitHeaders(
	rateLimitResult: ReturnType<typeof checkRateLimit>,
) {
	return {
		"X-RateLimit-Limit": rateLimitResult.limit.toString(),
		"X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
		"X-RateLimit-Reset": Math.ceil(rateLimitResult.resetTime / 1000).toString(),
	};
}
