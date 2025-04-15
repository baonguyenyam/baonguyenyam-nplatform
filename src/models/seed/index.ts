import { PrismaClient } from "@prisma/client";

import { AttributeSeed } from "./seed_attribute";
import { CustomerSeed } from "./seed_customers";
import { PostSeed } from "./seed_post";
import { SettingSeed } from "./seed_setting";
import { UserSeed } from "./seed_user";

const prisma = new PrismaClient();

async function main() {
	UserSeed().then(() => {
		PostSeed();
	});

	SettingSeed();
	CustomerSeed();
	AttributeSeed();

	if (process.env.CONFIG_DB_SERVER !== "localhost") {
		// VERY IMPORTANT
		// Realtime
		const getallTable = async () => {
			await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`.then((res: any) => {
				res.forEach(async (table: any) => {
					await prisma.$queryRaw`SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = ${table.table_name}`.then(async (checkRealtime: any) => {
						if (checkRealtime.length < 1 && table.table_name !== "_prisma_migrations") {
							const table_name = table.table_name;
							await prisma.$executeRawUnsafe(`ALTER PUBLICATION supabase_realtime ADD TABLE "${table_name}"`);
						}
					});
				});
			});
		};
		getallTable();
	}
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
