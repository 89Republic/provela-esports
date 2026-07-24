import { randomBytes } from 'crypto';
import { v2 as cloudinary } from 'cloudinary';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_BYTES = 5 * 1024 * 1024;

function sanitizeFolder(folder: string) {
  const parts = folder
    .split('/')
    .map((part) => part.replace(/[^a-z0-9-]/gi, '').toLowerCase())
    .filter(Boolean);

  return parts.join('/') || 'general';
}

function ensureCloudinaryConfigured() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary is not configured. Add CLOUDINARY_* env vars.');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export async function saveUploadedImage(file: File, folder: string): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed.');
  }

  if (file.size > MAX_BYTES) {
    throw new Error('Image must be 5 MB or smaller.');
  }

  ensureCloudinaryConfigured();

  const safeFolder = sanitizeFolder(folder);
  const publicId = `${Date.now()}-${randomBytes(4).toString('hex')}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `provela/${safeFolder}`,
        public_id: publicId,
        resource_type: 'image',
      },
      (error, uploadResult) => {
        if (error || !uploadResult?.secure_url) {
          reject(error ?? new Error('Cloudinary upload failed.'));
          return;
        }
        resolve({ secure_url: uploadResult.secure_url });
      },
    );

    stream.end(buffer);
  });

  return result.secure_url;
}
