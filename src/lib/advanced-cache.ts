import { Redis } from "ioredis";

// Redis Cache Implementation for Production
class AdvancedCacheManager {
	private redis: Redis | null = null;
	private memoryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

	constructor() {
		if (process.env.REDIS_URL && process.env.NODE_ENV === "production") {
			this.redis = new Redis(process.env.REDIS_URL, {
				retryDelayOnFailover: 100,
				enableReadyCheck: false,
				maxRetriesPerRequest: 3,
			});
		}
	}

	async get<T>(key: string): Promise<T | null> {
		try {
			// Try Redis first in production
			if (this.redis) {
				const cached = await this.redis.get(key);
				if (cached) {
					return JSON.parse(cached);
				}
			}

			// Fallback to memory cache
			const memoryCached = this.memoryCache.get(key);
			if (memoryCached && this.isCacheValid(memoryCached)) {
				return memoryCached.data;
			}

			return null;
		} catch (error) {
			console.error("Cache get error:", error);
			return null;
		}
	}

	async set<T>(key: string, data: T, ttlSeconds: number = 300): Promise<void> {
		try {
			const serialized = JSON.stringify(data);

			// Set in Redis if available
			if (this.redis) {
				await this.redis.setex(key, ttlSeconds, serialized);
			}

			// Always set in memory cache as fallback
			this.memoryCache.set(key, {
				data,
				timestamp: Date.now(),
				ttl: ttlSeconds * 1000,
			});
		} catch (error) {
			console.error("Cache set error:", error);
		}
	}

	async invalidate(pattern: string): Promise<void> {
		try {
			// Redis pattern deletion
			if (this.redis) {
				const keys = await this.redis.keys(`*${pattern}*`);
				if (keys.length > 0) {
					await this.redis.del(...keys);
				}
			}

			// Memory cache pattern deletion
			for (const [key] of this.memoryCache) {
				if (key.includes(pattern)) {
					this.memoryCache.delete(key);
				}
			}
		} catch (error) {
			console.error("Cache invalidation error:", error);
		}
	}

	private isCacheValid(item: { timestamp: number; ttl: number }): boolean {
		return Date.now() - item.timestamp < item.ttl;
	}

	// Background cleanup for memory cache
	startCleanup(): void {
		setInterval(() => {
			const now = Date.now();
			for (const [key, item] of this.memoryCache) {
				if (now - item.timestamp > item.ttl) {
					this.memoryCache.delete(key);
				}
			}
		}, 60000); // Cleanup every minute
	}
}

export const advancedCache = new AdvancedCacheManager();

// Enhanced cached functions with Redis support
export const getCachedOrFetch = async <T>(key: string, fetcher: () => Promise<T>, ttlSeconds: number = 300): Promise<T> => {
	const cached = await advancedCache.get<T>(key);
	if (cached !== null) {
		return cached;
	}

	const data = await fetcher();
	await advancedCache.set(key, data, ttlSeconds);
	return data;
};

// Cached database operations with Redis
export const cachedGetUserByIdRedis = async (id: string) => {
	return getCachedOrFetch(
		`user:${id}`,
		async () => {
			const { db } = await import("./db");
			return db.user.findUnique({
				where: { id },
				select: {
					id: true,
					email: true,
					name: true,
					image: true,
					avatar: true,
					role: true,
					published: true,
					permissions: true,
					createdAt: true,
				},
			});
		},
		900, // 15 minutes
	);
};
