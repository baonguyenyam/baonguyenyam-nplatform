import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Enhanced database connection with better configuration
const prismaClientSingleton = () => {
	return new PrismaClient({
		log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
			},
		},
	}).$extends(withAccelerate()).$extends({
		query: {
			$allModels: {
				async $allOperations({ model, operation, args, query }) {
					// Add query performance monitoring
					const start = Date.now();
					const result = await query(args);
					const duration = Date.now() - start;
					
					// Log slow queries in development
					if (process.env.NODE_ENV === 'development' && duration > 1000) {
						console.warn(`Slow query detected: ${model}.${operation} took ${duration}ms`);
					}
					
					return result;
				},
			},
		},
	});
};

declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const db = globalThis.prismaGlobal || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
	globalThis.prismaGlobal = db;
}

// Connection pool optimization for production
export const configureConnection = () => {
	if (process.env.NODE_ENV === 'production') {
		// These would be set in environment variables
		process.env.DATABASE_CONNECTION_LIMIT = process.env.DATABASE_CONNECTION_LIMIT || '20';
		process.env.DATABASE_TIMEOUT = process.env.DATABASE_TIMEOUT || '30000';
	}
};
