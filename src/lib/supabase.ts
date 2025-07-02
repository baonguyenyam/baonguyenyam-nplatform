import supabaseClient from "@/supabase";

export default function initSupabase({
	channel = "nPlatform",
	schema = "public",
	table = "User",
	event = "*",
	onpostgres = "postgres_changes", // postgres_changes, system, broadcast, presence
	fetchData = () => {},
}: {
	channel?: string;
	schema?: string;
	table?: string;
	event?: string;
	onpostgres?: any;
	fetchData?: () => void;
}) {
	if (
		process.env.ENABLE_SUPABASE === "true" ||
		process.env.ENABLE_SUPABASE === "1"
	) {
		const channelSupabase = supabaseClient
			.channel(channel)
			.on(onpostgres, { event, schema, table }, () => {
				fetchData();
			})
			.subscribe();
		if (
			process.env.ENABLE_SUPABASE === "true" ||
			process.env.ENABLE_SUPABASE === "1"
		) {
			return () => {
				supabaseClient.removeChannel(channelSupabase);
			};
		}
	}
}
