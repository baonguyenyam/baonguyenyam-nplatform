import { S3Client } from "@aws-sdk/client-s3";
import memoizeOne from "memoize-one";

export const Bucket = {
	dev: process.env.R2_BUCKET_DEV,
	prod: process.env.R2_BUCKET_PROD,
	public: process.env.R2_BUCKET_PUBLIC,
};

const getClient = memoizeOne(() => {
	const endpoint = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

	return new S3Client({
		region: "auto",
		credentials: {
			accessKeyId: process.env.S3_COMPATIBLE_ACCESS_ID as string,
			secretAccessKey: process.env.S3_COMPATIBLE_SECRET_KEY as string,
		},
		endpoint,
		forcePathStyle: true,
		apiVersion: "v4",
	});
});

export const s3Client = getClient();
