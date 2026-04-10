import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const start = Date.now();
  const pathname = req.nextUrl.pathname;
  const method = req.method;

  const response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  console.log(`[HTTP] ${method} ${pathname} -> ${response.status} (${Date.now() - start}ms)`);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
