import { UserRole } from "@prisma/client";

import { currentRole } from "@/lib/auth";

export async function GET() {
	const role = await currentRole();

	if (role === UserRole.ADMIN) {
		return Response.json(
			{ message: "Authorized" },
			{
				status: 200,
				headers: {
					"content-type": "application/json",
				},
			},
		);
	}

	return Response.json(
		{ message: "Unauthorized" },
		{
			status: 403,
			headers: {
				"content-type": "application/json",
			},
		},
	);
}
