import Fetch from "./fetch";

export default async function Dashboard() {
	const breadcrumb = [
		{
			title: "Dashboard",
			href: "/admin",
		},
	];

	return (
		<Fetch
			title="Dashboard"
			breadcrumb={breadcrumb}
		/>
	);
}
