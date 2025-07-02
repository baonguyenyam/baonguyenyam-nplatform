import { NextRequest, NextResponse } from "next/server";

import { withCategoriesPermission } from "@/lib/auth-middleware";
import { ACTIONS, PERMISSION_LEVELS } from "@/lib/permissions";
import models from "@/models";

// get all Category
export const GET = withCategoriesPermission(ACTIONS.READ)(async (req: NextRequest) => {
	try {
		// QUERY PARAMS
		const query = {
			s: new URL(req.url).searchParams.get("s") || "",
			skip: parseInt(new URL(req.url).searchParams.get("skip") ?? "0"),
			take: parseInt(new URL(req.url).searchParams.get("take") ?? "10"),
			orderBy: new URL(req.url).searchParams.get("orderBy") || "createdAt",
			filterBy: new URL(req.url).searchParams.get("filterBy") || "",
			byCat: new URL(req.url).searchParams.get("cat") || "all",
			type: new URL(req.url).searchParams.get("type") || null,
			min: Boolean(new URL(req.url).searchParams.get("min")),
		};

		const [count, db] = await Promise.all([models.Category.getCategoriesCount(query), models.Category.getAllCategories(query)]);

		return NextResponse.json({
			message: "Data fetched successfully",
			data: db,
			count: count,
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{
				message: "Error fetching categories",
				error: error instanceof Error ? error.message : "Unknown error",
				success: false,
			},
			{ status: 500 },
		);
	}
});

// Create Category
export const POST = withCategoriesPermission(
	ACTIONS.CREATE,
	PERMISSION_LEVELS.WRITE,
)(async (req: NextRequest) => {
	try {
		const body = await req.json();
		const db = await models.Category.createCategory(body);

		if (db) {
			return NextResponse.json({
				message: "Category created successfully",
				data: db,
				success: true,
			});
		}

		return NextResponse.json(
			{
				message: "Can not create the data",
				success: false,
			},
			{ status: 400 },
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: "Error creating category",
				error: error instanceof Error ? error.message : "Unknown error",
				success: false,
			},
			{ status: 500 },
		);
	}
});

// DELETE Multiple
export const DELETE = withCategoriesPermission(
	ACTIONS.DELETE,
	PERMISSION_LEVELS.WRITE,
)(async (req: NextRequest) => {
	try {
		const body = await req.json();
		const db = await models.Category.deleteMulti(body);

		if (db) {
			return NextResponse.json({
				message: "Categories deleted successfully",
				data: db,
				success: true,
			});
		}

		return NextResponse.json(
			{
				message: "Can not delete the data",
				success: false,
			},
			{ status: 400 },
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: "Error deleting categories",
				error: error instanceof Error ? error.message : "Unknown error",
				success: false,
			},
			{ status: 500 },
		);
	}
});

// UPDATE Multiple
export const PATCH = withCategoriesPermission(
	ACTIONS.UPDATE,
	PERMISSION_LEVELS.WRITE,
)(async (req: NextRequest) => {
	try {
		const body = await req.json();
		const { ids, ...rest } = body;
		const db = await models.Category.updateMulti(ids, rest);

		if (db) {
			return NextResponse.json({
				message: "Category updated successfully",
				data: db,
				success: true,
			});
		}

		return NextResponse.json(
			{
				message: "Can not update the data",
				success: false,
			},
			{ status: 400 },
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: "Error updating categories",
				error: error instanceof Error ? error.message : "Unknown error",
				success: false,
			},
			{ status: 500 },
		);
	}
});
