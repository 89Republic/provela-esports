import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-session';

const PUBLIC_ADMIN_API = new Set([
  '/api/admin/auth/login',
  '/api/admin/auth/logout',
]);

async function getAdminSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getAdminSessionFromRequest(request);

  if (pathname.startsWith('/admin/login')) {
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/admin/')) {
    if (PUBLIC_ADMIN_API.has(pathname)) {
      return NextResponse.next();
    }

    if (pathname === '/api/admin/users' && request.method === 'POST') {
      return NextResponse.next();
    }

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
