// Server/controllers/uploadController.js
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client } from '@aws-sdk/client-s3';
import 'dotenv/config';

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.AWS_BUCKET_NAME;
const REGION = process.env.AWS_REGION;

const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']);
const EXPIRES_SECONDS = 60;

export async function getUploadSign(req, res) {
  try {
    const { filename, contentType } = req.query;
    if (!filename || !contentType) {
      return res.status(400).json({ error: 'filename & contentType required' });
    }
    if (!ALLOWED_MIME.has(String(contentType).toLowerCase())) {
      return res.status(400).json({ error: 'unsupported contentType' });
    }

    const ext = String(filename).split('.').pop();
    const key = `products/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;

    const cmd = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,        // 桶禁用 ACL，别加 ACL
    });

    const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: EXPIRES_SECONDS });
    const publicUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

    return res.json({ uploadUrl, publicUrl, key, expiresIn: EXPIRES_SECONDS });
  } catch (e) {
    console.error('sign error:', e);
    return res.status(500).json({ error: 'sign failed' });
  }
}
