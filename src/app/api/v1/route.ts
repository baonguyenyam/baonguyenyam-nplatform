import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { currentRole } from "@/lib/auth";

// Consolidated API router to reduce Vercel function count
export async function GET(request: NextRequest) {
	const role = await currentRole();
	const url = new URL(request.url);
	const pathname = url.pathname;

	// Authorization check for admin routes
	if (pathname.includes("/admin/") && role !== UserRole.ADMIN) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
	}

	// For now, return a maintenance message for consolidated routes
	if (pathname.includes("/admin/") || pathname.includes("/public/")) {
		return NextResponse.json(
			{
				message: "API routes temporarily consolidated for Vercel deployment",
				status: "under_maintenance",
				suggestion:
					"Individual routes will be restored after resolving function limit",
			},
			{ status: 503 },
		);
	}

	// Default response for authorized admin access
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

export async function POST(request: NextRequest) {
	const role = await currentRole();
	const url = new URL(request.url);
	const pathname = url.pathname;

	// Authorization check for admin routes
	if (pathname.includes("/admin/") && role !== UserRole.ADMIN) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
	}

	// Return maintenance message for now
	return NextResponse.json(
		{
			message: "API routes temporarily consolidated for Vercel deployment",
			status: "under_maintenance",
		},
		{ status: 503 },
	);
}

export async function PUT(request: NextRequest) {
	const role = await currentRole();
	const url = new URL(request.url);
	const pathname = url.pathname;

	if (pathname.includes("/admin/") && role !== UserRole.ADMIN) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
	}

	return NextResponse.json(
		{
			message: "API routes temporarily consolidated for Vercel deployment",
			status: "under_maintenance",
		},
		{ status: 503 },
	);
}

export async function DELETE(request: NextRequest) {
	const role = await currentRole();
	const url = new URL(request.url);
	const pathname = url.pathname;

	if (pathname.includes("/admin/") && role !== UserRole.ADMIN) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
	}

	return NextResponse.json(
		{
			message: "API routes temporarily consolidated for Vercel deployment",
			status: "under_maintenance",
		},
		{ status: 503 },
	);
}
