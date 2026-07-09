import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';

// Edge Runtime için hafif Auth Config (Prisma veya Bcrypt İÇERMEZ!)
const { auth } = NextAuth({
  providers: [], // Middleware sadece session okuyacağı için provider'a gerek yok
  secret: process.env.AUTH_SECRET,
});

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role as string | undefined;
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');
  const isAdminRoute = req.nextUrl.pathname.startsWith('/dashboard/admin') || req.nextUrl.pathname.startsWith('/api/admin');

  // Yetkisiz API Erişimi
  if (isApiRoute && !isLoggedIn && !req.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.json({ error: 'Yetkisiz Erişim' }, { status: 401 });
  }

  // Dashboard'a Giriş Yapmadan Erişenleri Logine Yönlendir
  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // Sadece ADMIN Yetkisi Olanlar Admin Rotasına Girebilir
  if (isAdminRoute && userRole !== 'ADMIN') {
    if (isApiRoute) {
       return NextResponse.json({ error: 'Yetersiz Yetki' }, { status: 403 });
    }
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
