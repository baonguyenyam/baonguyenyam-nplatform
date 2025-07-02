import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

import "server-only";

const prismaClientSingleton = () => {
	return new PrismaClient({
		datasources: {
			db: {
				url: process.env.DATABASE_URL
			}
		},
		log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
	}).$extends(withAccelerate());
};

declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const db = globalThis.prismaGlobal || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;
