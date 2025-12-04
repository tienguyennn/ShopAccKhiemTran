import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const csp = `
    default-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    object-src 'none';
    style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
    img-src 'self' data: blob: https://*.amcharts.com;
    connect-src 'self' https://api-dvcbqp.ebizoffice.vn;
    font-src 'self' https://fonts.gstatic.com;
    worker-src 'self' blob:;
    manifest-src 'self';
  `.replace(/\n/g, ' ').trim();

  res.headers.set('Content-Security-Policy', csp);
  return res;
}
