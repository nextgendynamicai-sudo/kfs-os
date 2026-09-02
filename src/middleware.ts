import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RESERVED_SUBDOMAINS = new Set([
  'rewards',
  'promotora',
  'arquitecto',
  'core',
  'comercio',
  'client',
  'vendedor',
  'rider',
  'pos',
  'hub',
  'apk',
  'download',
  'www',
  'api',
  'app',
  'admin'
]);

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Handle subdomain mapping for axisnitro.store
  if (hostname.includes('axisnitro.store')) {
    const parts = hostname.split('.');
    
    // If there is a subdomain (e.g. promotora.axisnitro.store or mitienda.axisnitro.store)
    if (parts.length > 2) {
      const subdomain = parts[0].toLowerCase();

      if (subdomain === 'rewards') {
        if (!url.pathname.startsWith('/rewards')) {
          url.pathname = `/rewards${url.pathname === '/' ? '' : url.pathname}`;
          return NextResponse.rewrite(url);
        }
      }

      if (subdomain === 'promotora') {
        if (!url.pathname.startsWith('/promotora')) {
          url.pathname = `/promotora${url.pathname === '/' ? '' : url.pathname}`;
          return NextResponse.rewrite(url);
        }
      }

      if (subdomain === 'arquitecto' || subdomain === 'core') {
        if (!url.pathname.startsWith('/arquitecto') && !url.pathname.startsWith('/core')) {
          url.pathname = `/arquitecto${url.pathname === '/' ? '' : url.pathname}`;
          return NextResponse.rewrite(url);
        }
      }

      if (subdomain === 'comercio' || subdomain === 'client') {
        if (!url.pathname.startsWith('/comercio') && !url.pathname.startsWith('/client')) {
          url.pathname = `/comercio${url.pathname === '/' ? '' : url.pathname}`;
          return NextResponse.rewrite(url);
        }
      }

      if (subdomain === 'vendedor') {
        if (!url.pathname.startsWith('/vendedor')) {
          url.pathname = `/vendedor${url.pathname === '/' ? '' : url.pathname}`;
          return NextResponse.rewrite(url);
        }
      }

      if (subdomain === 'rider') {
        if (!url.pathname.startsWith('/rider')) {
          url.pathname = `/rider${url.pathname === '/' ? '' : url.pathname}`;
          return NextResponse.rewrite(url);
        }
      }

      if (subdomain === 'pos' || subdomain === 'hub') {
        if (!url.pathname.startsWith('/pos')) {
          url.pathname = `/pos${url.pathname === '/' ? '' : url.pathname}`;
          return NextResponse.rewrite(url);
        }
      }

      if (subdomain === 'apk' || subdomain === 'download') {
        if (!url.pathname.startsWith('/download-apk')) {
          url.pathname = `/download-apk${url.pathname === '/' ? '' : url.pathname}`;
          return NextResponse.rewrite(url);
        }
      }

      // Enrutamiento Multi-Tenant para Subdominios de Comercios Independientes
      // Ej: mitienda.axisnitro.store -> /nitro/mitienda
      if (!RESERVED_SUBDOMAINS.has(subdomain)) {
        if (url.pathname === '/' || url.pathname === '') {
          url.pathname = `/nitro/${subdomain}`;
          const response = NextResponse.rewrite(url);
          response.headers.set('x-tenant-slug', subdomain);
          return response;
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};

