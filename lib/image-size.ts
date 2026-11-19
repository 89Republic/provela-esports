import { promises as fs } from 'fs';
import path from 'path';

export interface ImageSize {
  width: number;
  height: number;
}

const PUBLIC_DIR = path.join(process.cwd(), 'public');
// Remote images come from the admin uploader; no other host is fetched from the server.
const REMOTE_HOSTS = new Set(['res.cloudinary.com']);
const HEADER_BYTES = 64 * 1024;
const cache = new Map<string, ImageSize>();

/**
 * Pixel size of an image under /public or on the upload host, read from its file header.
 * Returns null when the file can't be read or the format isn't recognised.
 */
export async function getImageSize(src: string): Promise<ImageSize | null> {
  const cached = cache.get(src);
  if (cached) return cached;

  try {
    const bytes = await readImageBytes(src);
    const size = bytes ? parseImageSize(bytes) : null;
    if (size) cache.set(src, size);
    return size;
  } catch {
    return null;
  }
}

async function readImageBytes(src: string): Promise<Buffer | null> {
  if (src.startsWith('/') && !src.startsWith('//')) {
    const pathname = decodeURIComponent(src.split(/[?#]/)[0]);
    const file = path.join(PUBLIC_DIR, pathname);
    if (!file.startsWith(PUBLIC_DIR + path.sep)) return null;
    return fs.readFile(file);
  }

  const url = new URL(src);
  if (url.protocol !== 'https:' || !REMOTE_HOSTS.has(url.hostname)) return null;

  const response = await fetch(url, {
    headers: { Range: `bytes=0-${HEADER_BYTES - 1}` },
    signal: AbortSignal.timeout(2000),
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!response.ok) return null;
  return Buffer.from(await response.arrayBuffer());
}

function toSize(width: number, height: number): ImageSize | null {
  return Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0 ? { width, height } : null;
}

/** Reads width and height from a PNG, GIF, WebP, JPEG or SVG header. */
export function parseImageSize(b: Buffer): ImageSize | null {
  // PNG: the IHDR chunk always comes first.
  if (b.length >= 24 && b.readUInt32BE(0) === 0x89504e47 && b.toString('ascii', 12, 16) === 'IHDR') {
    return toSize(b.readUInt32BE(16), b.readUInt32BE(20));
  }

  if (b.length >= 10 && b.toString('ascii', 0, 4) === 'GIF8') {
    return toSize(b.readUInt16LE(6), b.readUInt16LE(8));
  }

  if (b.length >= 30 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') return toSize(b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff);
    if (chunk === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return toSize((bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1);
    }
    if (chunk === 'VP8X') return toSize(b.readUIntLE(24, 3) + 1, b.readUIntLE(27, 3) + 1);
    return null;
  }

  // JPEG: walk the segments to the first start-of-frame marker.
  if (b.length >= 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 <= b.length) {
      if (b[i] !== 0xff) return null;
      const marker = b[i + 1];
      if (marker === 0xff) {
        i += 1;
        continue;
      }
      if ((marker >= 0xd0 && marker <= 0xd9) || marker === 0x01) {
        i += 2;
        continue;
      }
      const isStartOfFrame = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isStartOfFrame) return toSize(b.readUInt16BE(i + 7), b.readUInt16BE(i + 5));
      if (marker === 0xda) return null;
      i += 2 + b.readUInt16BE(i + 2);
    }
    return null;
  }

  // SVG: absolute width and height attributes, otherwise the viewBox.
  const svg = b.toString('utf8', 0, Math.min(b.length, 4096)).match(/<svg\b[^>]*>/i)?.[0];
  if (svg) {
    const attr = (name: string) => svg.match(new RegExp(`\\s${name}\\s*=\\s*["']([^"']+)["']`, 'i'))?.[1];
    const width = attr('width');
    const height = attr('height');
    if (width && height && !width.includes('%') && !height.includes('%')) {
      const size = toSize(parseFloat(width), parseFloat(height));
      if (size) return size;
    }
    const viewBox = attr('viewBox')?.trim().split(/[\s,]+/).map(Number);
    if (viewBox?.length === 4) return toSize(viewBox[2], viewBox[3]);
  }

  return null;
}
