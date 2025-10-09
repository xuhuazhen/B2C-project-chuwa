// Server/tools/s3Test.js
import 'dotenv/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_BUCKET_NAME;

const s3 = new S3Client({ region: REGION });

async function main() {
  console.log('Using bucket:', BUCKET, 'region:', REGION);

  // 0) 检查桶是否可访问
  try {
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
    console.log('✅ HeadBucket OK (bucket exists & you can access)');
  } catch (e) {
    console.error('❌ HeadBucket failed:', e.name, e.message);
    process.exit(1);
  }

  // 1) 写入一个小对象
  const key = `healthcheck/${Date.now()}-${Math.random().toString(16).slice(2)}.txt`;
  try {
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: 'hello-from-s3-test',
      ContentType: 'text/plain',
    }));
    console.log('✅ PutObject OK:', key);
  } catch (e) {
    console.error('❌ PutObject failed:', e.name, e.message);
    process.exit(1);
  }

  // 2) 读取刚上传的对象（验证读权限/网络）
  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
    const text = await res.Body.transformToString();
    console.log('✅ GetObject OK, content =', text);
  } catch (e) {
    console.error('❌ GetObject failed:', e.name, e.message);
    // 不立即退出，继续删除
  }

  // 3) 清理：删除测试对象
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
    console.log('🧹 Deleted test object:', key);
  } catch (e) {
    console.error('⚠️ DeleteObject failed:', e.name, e.message);
  }

  console.log('🎉 S3 smoke test finished.');
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
