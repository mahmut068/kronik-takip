import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Edge runtime'da NextAuth çökmesini önlemek için çerezleri manuel kontrol ediyoruz
  const hasSession = 
    req.cookies.has('authjs.session-token') || 
    req.cookies.has('__Secure-authjs.session-token') ||
    req.cookies.has('next-auth.session-token') ||
    req.cookies.has('__Secure-next-auth.session-token');
    
  const isLoggedIn = hasSession;
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

  // Admin kontrolünü sayfa bazlı yüklemeye (Client/Server Component) bırakıyoruz, 
  // Middleware'de sadece genel oturum kontrolü yapıyoruz ki çökme olmasın.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
