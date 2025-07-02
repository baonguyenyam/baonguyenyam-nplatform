"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createHash } from "crypto";
import { writeFile } from "fs/promises";
import path from "path";

import { auth } from "@/auth";
import { Bucket, s3Client } from "@/lib/s3";
import models from "@/models";

// Upload File
export async function uploadFile(files: any) {
	const session = await auth();
	const { id, role } = session?.user || {};
	// UPLOAD
	const upload_path = process.env.UPLOAD_PATH;
	const upload_dir = process.env.UPLOAD_DIR;
	if (!upload_path) {
		return {
			success: "error",
			message: "Upload path not found",
		};
	}

	try {
		if (files.length === 0) return;
		const db = [];
		for (const file of files) {
			if (!(file instanceof File)) {
				return {
					success: "error",
					message: "Invalid file",
				};
			}
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
			const fileURL = "";
			if (fileSizeInMB > Number(process.env.MAX_FILE_SIZE)) {
				return {
					success: "error",
					message: `File size exceeds ${Number(process.env.MAX_FILE_SIZE) / (1024 * 1024)}MB`,
				};
			}
			if (!file) {
				return {
					success: "error",
					message: "File not found",
				};
			}
			if (!fileName) {
				return {
					success: "error",
					message: "Invalid file",
				};
			}
			if (!fileBuffer) {
				return {
					success: "error",
					message: "Invalid file data",
				};
			}

			try {
				if (process.env.ENABLE_R2 === "true" || process.env.ENABLE_R2 === "1") {
					const data = {
						Bucket:
							process.env.NODE_ENV === "production" ? Bucket.prod : Bucket.dev,
						Key: `${upload_dir}/${fileHash}.${fileExtension}`,
					};

					const signedUrl = await getSignedUrl(
						s3Client,
						new PutObjectCommand(data),
						{
							expiresIn: 3600,
						},
					);

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
					await writeFile(
						path.join(
							process.cwd(),
							upload_path || "",
							"/" + fileHash + "." + fileExtension,
						),
						fileBuffer,
					);
					const fileDataToSave = {
						name: fileName,
						hash: fileHash,
						userId: id,
						type: fileMimeType,
						size: fileSize,
						ext: fileExtension,
						published: true,
						url: "/" + upload_dir + "/" + fileHash + "." + fileExtension,
					};
					const item = await models.File.createFile(fileDataToSave);
					if (item) {
						db.push(item);
					} else {
						return {
							success: "error",
							message: "Can not upload the file",
						};
					}
				}
			} catch (error) {
				console.error("Error writing file:", error);
				return {
					success: "error",
					message: "Error writing file",
				};
			}
		}

		if (files.length === 0) {
			return {
				success: "error",
				message: "Can not upload the file",
			};
		}

		return {
			success: "success",
			message: "File uploaded successfully",
			data: db,
		};
	} catch (error) {
		return {
			success: "error",
			message: "Error uploading file",
		};
	}
}
