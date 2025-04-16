import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createHash } from "crypto";
import { writeFile } from "fs/promises";
import path from "path";

import { auth } from "@/auth";
import { appState } from "@/lib/appConst";
import { Bucket, s3Client } from "@/lib/s3";
import models from "@/models";

// Create File
export async function POST(req: Request) {
	const session = await auth();
	if (!session) {
		return Response.json({ message: "Not authenticated" }, { status: 401 });
	}
	const { id, role } = session?.user || {};
	const upload_path = appState.UPLOAD_PATH;
	const upload_dir = appState.UPLOAD_DIR;
	const formData = await req.formData();
	const files = formData.getAll("file").filter((item): item is File => item instanceof File);
	const db = [];
	for (const file of files) {
		if (file instanceof File) {
			const fileName = file.name.replaceAll(" ", "_");
			const randomString = Math.random().toString(36).substring(2, 15);
			const fileHash = createHash("sha256")
				.update(fileName + randomString)
				.digest("hex");
			const fileBuffer = Buffer.from(await file.arrayBuffer());
			const fileSize = file.size;
			const fileSizeInMB = fileSize / (1024 * 1024);
			const fileExtension = fileName.split(".").pop();
			const fileType = file.type;
			const fileMimeType = fileType || "application/octet-stream";

			const maxFileSize = Number(process.env.MAX_FILE_SIZE || 0);
			if (fileSizeInMB > maxFileSize) {
				return Response.json({ message: `File size exceeds ${maxFileSize / (1024 * 1024)}MB` }, { status: 400 });
			}
			if (!file) {
				return Response.json({ message: "File not found" }, { status: 401 });
			}
			if (!fileName) {
				return Response.json({ message: "Invalid file" }, { status: 400 });
			}
			if (!fileBuffer) {
				return Response.json({ message: "Invalid file data" }, { status: 400 });
			}

			try {
				if (process.env.ENABLE_R2 === "true") {
					const data = {
						Bucket: process.env.NODE_ENV === "production" ? Bucket.prod : Bucket.dev,
						Key: `${upload_dir}/${fileHash}.${fileExtension}`,
					};

					const signedUrl = await getSignedUrl(s3Client, new PutObjectCommand(data), {
						expiresIn: 3600,
					});

					await fetch(signedUrl, {
						method: "PUT",
						headers: {
							"Content-Type": fileMimeType,
							"Content-Length": fileSize.toString(),
						},
						body: fileBuffer,
					});
					const response = Bucket.public + "/" + data.Key;
					const fileDataToSave = {
						name: fileName,
						hash: fileHash,
						userId: id,
						type: fileMimeType,
						size: fileSize,
						ext: fileExtension,
						published: true,
						url: response,
					};
					const item = await models.File.createFile(fileDataToSave);
					if (item) {
						db.push(item);
					}
					if (!item) {
						return {
							success: "error",
							message: "Can not upload the file",
						};
					}
				} else {
					await writeFile(path.join(process.cwd(), upload_path, fileHash + "." + fileExtension), fileBuffer);
					const fileDataToSave = {
						name: fileName,
						hash: fileHash,
						userId: id,
						type: fileMimeType,
						size: fileSize,
						ext: fileExtension,
						published: true,
						url: "/" + upload_dir + fileHash + "." + fileExtension,
					};

					const item = await models.File.createFile(fileDataToSave);
					if (item) {
						db.push(item);
					} else {
						return Response.json({ message: "Can not upload the file" }, { status: 401 });
					}
				}
			} catch (error) {
				return Response.json({ message: "Error writing file" }, { status: 500 });
			}
		}
	}

	if (db.length === 0) {
		return Response.json({ message: "Can not upload the file" }, { status: 401 });
	}

	return new Response(
		JSON.stringify({
			message: "File uploaded successfully",
			data: db,
			success: "success",
		}),
		{
			status: 200,
			headers: {
				"content-type": "application/json",
			},
		},
	);
}
