import { randomBytes } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_BYTES = 5 * 1024 * 1024;

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

function sanitizeFolder(folder: string) {
  const parts = folder
    .split('/')
    .map((part) => part.replace(/[^a-z0-9-]/gi, '').toLowerCase())
    .filter(Boolean);

  return parts.join('/') || 'general';
}

export async function saveUploadedImage(file: File, folder: string): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed.');
  }

  if (file.size > MAX_BYTES) {
    throw new Error('Image must be 5 MB or smaller.');
  }

  const safeFolder = sanitizeFolder(folder);
  const ext = EXT_BY_MIME[file.type] ?? '.jpg';
  const filename = `${Date.now()}-${randomBytes(4).toString('hex')}${ext}`;
  const dir = path.join(process.cwd(), 'public', 'uploads', safeFolder);

  await fs.mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buffer);

  return `/uploads/${safeFolder}/${filename}`;
}
