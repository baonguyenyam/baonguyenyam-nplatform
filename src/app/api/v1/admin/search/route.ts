import { type NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import {
	ACTIONS,
	createPermissionChecker,
	PERMISSION_LEVELS,
	RESOURCES,
} from "@/lib/permissions";
import models from "@/models";

// Search across all entities
async function GET_Handler(req: NextRequest) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
	}

	// Search requires at least moderator access
	const permissionChecker = createPermissionChecker({
		userId: session.user.id as string,
		role: session.user.role as "ADMIN" | "MODERATOR" | "USER",
	});

	if (!permissionChecker.isModerator()) {
		return NextResponse.json(
			{ message: "Insufficient permissions" },
			{ status: 403 },
		);
	}

	// QUERY PARAMS
	const query = {
		s: req.nextUrl.searchParams.get("s") || "",
		skip: parseInt(req.nextUrl.searchParams.get("skip") ?? "0"),
		take: parseInt(req.nextUrl.searchParams.get("take") ?? "10"),
		orderBy: req.nextUrl.searchParams.get("orderBy") || "createdAt",
		filterBy: req.nextUrl.searchParams.get("filterBy") || "",
		byCat: req.nextUrl.searchParams.get("cat") || "all",
		type: req.nextUrl.searchParams.get("type") || null,
	};

	try {
		const db = await models.Search.searchAll(query);

		if (!db) {
			return NextResponse.json({ message: "No data found" }, { status: 404 });
		}

		return NextResponse.json({
			message: "Data fetched successfully",
			data: db.data,
			count: db.count,
			success: "success",
		});
	} catch (error) {
		return NextResponse.json(
			{ message: "Error performing search", success: "error" },
			{ status: 500 },
		);
	}
}

export const GET = GET_Handler;
