import { db } from "./db";

// Simple in-memory cache for database operations
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const USER_CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

function getCacheKey(prefix: string, ...args: any[]): string {
	return `${prefix}:${args.join(":")}`;
}

function isCacheValid(item: { timestamp: number; ttl: number }): boolean {
	return Date.now() - item.timestamp < item.ttl;
}

async function getCachedOrFetch<T>(key: string, fetcher: () => Promise<T>, ttl: number = CACHE_TTL): Promise<T> {
	const cached = cache.get(key);

	if (cached && isCacheValid(cached)) {
		return cached.data;
	}

	const data = await fetcher();
	cache.set(key, {
		data,
		timestamp: Date.now(),
		ttl,
	});

	return data;
}

// Cached database operations
export const cachedGetUserById = async (id: string) => {
	const key = getCacheKey("user-by-id", id);
	return getCachedOrFetch(
		key,
		() =>
			db.user.findUnique({
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
			}),
		USER_CACHE_TTL,
	);
};

export const cachedGetUserByEmail = async (email: string) => {
	const key = getCacheKey("user-by-email", email);
	return getCachedOrFetch(
		key,
		() =>
			db.user.findUnique({
				where: { email },
				select: {
					id: true,
					email: true,
					name: true,
					image: true,
					avatar: true,
					role: true,
					published: true,
					permissions: true,
					hash: true,
					salt: true,
					password: true,
				},
			}),
		USER_CACHE_TTL,
	);
};

export const cachedGetPostBySlug = async (slug: string) => {
	const key = getCacheKey("post-by-slug", slug);
	return getCachedOrFetch(key, () =>
		db.post.findFirst({
			where: {
				slug,
				published: true,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						avatar: true,
					},
				},
				categories: true,
				meta: true,
			},
		}),
	);
};

export const cachedGetSettings = async () => {
	const key = getCacheKey("settings");
	return getCachedOrFetch(
		key,
		() =>
			db.setting.findMany({
				select: {
					key: true,
					value: true,
				},
			}),
		USER_CACHE_TTL,
	);
};

export const cachedGetCategories = async (type?: string) => {
	const key = getCacheKey("categories", type || "space");
	return getCachedOrFetch(key, () =>
		db.category.findMany({
			where: {
				published: true,
				type: type || "space",
			},
			select: {
				id: true,
				title: true,
				slug: true,
				parent: true,
				setorder: true,
			},
			orderBy: {
				setorder: "asc",
			},
		}),
	);
};

// Clear cache for specific patterns
export const clearCache = (pattern?: string) => {
	if (!pattern) {
		cache.clear();
		return;
	}

	const keysToDelete = Array.from(cache.keys()).filter((key) => key.includes(pattern));

	keysToDelete.forEach((key) => cache.delete(key));
};
