// Server/testS3.js (ESM)
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { S3Client, ListBucketsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("ENV check:", {
  REGION: process.env.AWS_REGION,
  BUCKET: process.env.AWS_BUCKET_NAME,
});

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

(async () => {
  try {
    // 先测连通性（不需要 Bucket）
    const lb = await s3.send(new ListBucketsCommand({}));
    console.log("✅ Connected. Total buckets:", lb.Buckets?.length ?? 0);

    // 再测你当前 bucket 是否可访问
    const bucket = process.env.AWS_BUCKET_NAME;
    if (!bucket) throw new Error("AWS_BUCKET_NAME is empty!");

    const lo = await s3.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 5 }));
    console.log(`✅ Bucket "${bucket}" ok. Objects:`, lo.Contents?.length ?? 0);
  } catch (err) {
    console.error("❌ Failed to connect to S3:");
    console.error(err);
  }
})();
