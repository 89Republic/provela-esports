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

let isCloudinaryConfigured = false;

function ensureCloudinaryConfigured() {
  if (isCloudinaryConfigured) return;

  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  // Try CLOUDINARY_URL first (most reliable)
  if (cloudinaryUrl) {
    cloudinary.config({ secure: true });
    isCloudinaryConfigured = true;
    return;
  }

  // Fall back to individual env vars
  if (cloudName && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_secret: apiSecret,
      secure: true,
    });
    isCloudinaryConfigured = true;
    return;
  }

  // Provide detailed error message with available env vars
  const available = [];
  if (cloudinaryUrl) available.push('CLOUDINARY_URL');
  if (cloudName) available.push('CLOUDINARY_CLOUD_NAME');
  if (apiSecret) available.push('CLOUDINARY_API_SECRET');

  const missing = [];
  if (!cloudinaryUrl && !cloudName) missing.push('CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME');
  if (!cloudinaryUrl && !apiSecret) missing.push('CLOUDINARY_API_SECRET');

  throw new Error(
    `Cloudinary is not configured. Missing: ${missing.join(', ')}. ` +
    (available.length > 0 ? `Available: ${available.join(', ')}.` : 'Add CLOUDINARY_* env vars.'),
  );
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
    const uploadOptions: Record<string, unknown> = {
      folder: `provela/${safeFolder}`,
      public_id: publicId,
      resource_type: 'image',
      unsigned: false,
    };

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, uploadResult) => {
      if (error || !uploadResult?.secure_url) {
        reject(error ?? new Error('Cloudinary upload failed.'));
        return;
      }
      resolve({ secure_url: uploadResult.secure_url });
    });

    stream.end(buffer);
  });

  return result.secure_url;
}
