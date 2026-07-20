import path from 'path'
import { fileURLToPath } from 'url'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/tournaments', destination: '/fcx', permanent: true },
      { source: '/tournaments/:id', destination: '/fcx/:id', permanent: true },
      { source: '/admin/tournaments', destination: '/admin/fcx', permanent: true },
    ];
  },
  // Prevent Turbopack from picking up a stray lockfile in a parent directory.
  turbopack: {
    root: projectRoot,
  },
}

export default nextConfig
