import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createHash } from "crypto";
import { writeFile } from "fs/promises";
import path from "path";

import { Bucket, s3Client } from "@/lib/s3";
import models from "@/models";

export async function upload(upload_dir: string, fileHash: string, fileExtension: string, fileBuffer: Buffer, fileSize: number, fileMimeType: string, fileName: string, id: string) {
	try {
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
			body: new Uint8Array(fileBuffer as Buffer),
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

		return item ? item : null;
	} catch (error) {
		console.error("Error uploading file:", error);
		return null;
	}
}

export async function uploadSave(upload_path: string, fileHash: string, fileExtension: string, fileBuffer: Buffer | string, fileName: string, id: string, fileMimeType: string, fileSize: number, upload_dir: string) {
	await writeFile(path.join(process.cwd(), upload_path || "", "/" + fileHash + "." + fileExtension), fileBuffer);


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

	console.log("File saved to:", fileDataToSave);

	const item = await models.File.createFile(fileDataToSave);
	return item ? item : null;
}

export function generateHash(fileBuffer: any) {
	const hash = createHash("sha256");
	hash.update(fileBuffer);
	const fileHash = hash.digest("hex");
	return fileHash;
}