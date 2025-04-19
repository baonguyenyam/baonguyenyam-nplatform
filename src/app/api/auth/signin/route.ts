import bcrypt from 'bcrypt';

import models from "@/models";

// Sign in with credentials
export async function POST(req: Request) {

	const { email, password } = await req.json();
	if (!email || !password) {
		return Response.json({ message: "Email and password are required" }, { status: 401 });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const db = await models.User.signIn(email, hashedPassword);
	if (db) {
		const isMatch = db.password && await bcrypt.compare(password, db.password);
		if (isMatch) {
			const { password, ...user } = db;
			return Response.json({ user }, { status: 200 });
		}
		return Response.json({ message: "Invalid email or password" }, { status: 401 });
	}

	return Response.json({ message: "Can not create the data" }, { status: 401 });
}
