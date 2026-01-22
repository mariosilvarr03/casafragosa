import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // protege tudo dentro de /admin
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const user = process.env.ADMIN_USER || 'admin';
  const pass = process.env.ADMIN_PASS || '';

  // se não tiver pass definida, bloqueia (para não ficar aberto por acidente)
  if (!pass) {
    return new NextResponse('ADMIN_PASS não definido no .env.local', { status: 500 });
  }

  const auth = req.headers.get('authorization');

  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = Buffer.from(encoded, 'base64').toString('utf8');
      const [u, p] = decoded.split(':');
      if (u === user && p === pass) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin"',
    },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};
