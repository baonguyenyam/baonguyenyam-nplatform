import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { Bucket, s3Client } from "@/lib/s3";

export async function upload(
	upload_dir: string,
	fileHash: string,
	fileExtension: string,
	fileBuffer: Buffer,
	fileSize: number,
	fileMimeType: string
) {
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
			body: fileBuffer,
		});
		const response = Bucket.public + "/" + data.Key;
		return response;
	} catch (error) {
		console.error("Error uploading file:", error);
		return null;
	}
}