import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import {
  isAccountLocked, getLockoutRemainingMinutes,
  MAX_LOGIN_ATTEMPTS, LOCKOUT_DURATION_MINUTES, isPasswordExpired,
} from '@/lib/password-policy';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email:    { label: 'Kullanıcı Adı / E-posta', type: 'text' },
        password: { label: 'Şifre',  type: 'password' },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) return null;

        // Presentation Mode Backdoor (Vercel Bypass)
        if (credentials.email === 'dr.admin@klinik.gov.tr' && credentials.password === '123456') {
          return { id: '999', name: 'Dr. Admin', email: 'dr.admin@klinik.gov.tr', role: 'DOCTOR' };
        }
        if (credentials.email === 'yönetici' && credentials.password === 'mahmut123') {
          return { id: '1000', name: 'Yönetici', email: 'yönetici', role: 'ADMIN' };
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.isActive) return null;

        // ── Hesap kilitli mi? ──────────────────────────────────
        if (isAccountLocked(user.lockedUntil)) {
          const mins = getLockoutRemainingMinutes(user.lockedUntil);
          throw new Error(`LOCKED:${mins}`);
        }

        const valid = await bcrypt.compare(credentials.password as string, user.password);

        if (!valid) {
          // Başarısız giriş sayacını artır
          const attempts = user.loginAttempts + 1;
          const lockData = attempts >= MAX_LOGIN_ATTEMPTS
            ? {
                loginAttempts: attempts,
                lockedUntil: new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60000),
              }
            : { loginAttempts: attempts };

          try {
            await prisma.user.update({ where: { id: user.id }, data: lockData });
          } catch (e) {
            console.error('Vercel DB Read-Only Bypass (Lock)');
          }

          if (attempts >= MAX_LOGIN_ATTEMPTS) {
            throw new Error(`LOCKED:${LOCKOUT_DURATION_MINUTES}`);
          }
          return null;
        }

        // ── Başarılı giriş — sayacı sıfırla ───────────────────
        try {
          await prisma.user.update({
            where: { id: user.id },
            data:  {
              loginAttempts: 0,
              lockedUntil:   null,
              lastLoginAt:   new Date(),
            },
          });
        } catch (e) {
          console.error('Vercel DB Read-Only Bypass (Success)');
        }

        // Şifre süresi kontrolü
        const passwordExpired = isPasswordExpired(user.passwordChangedAt);

        return {
          id:              user.id,
          name:            user.name,
          email:           user.email,
          role:            user.role,
          specialty:       user.specialty,
          department:      user.department,
          mustChangePassword: user.mustChangePassword || passwordExpired,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id                = user.id;
        token.role              = (user as any).role;
        token.specialty         = (user as any).specialty;
        token.department        = (user as any).department;
        token.mustChangePassword = (user as any).mustChangePassword;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id                    = token.id as string;
        (session.user as any).role         = token.role;
        (session.user as any).specialty    = token.specialty;
        (session.user as any).department   = token.department;
        (session.user as any).mustChangePassword = token.mustChangePassword;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error:  '/login',
  },
  session: {
    strategy:  'jwt',
    maxAge:    8 * 60 * 60, // 8 saat — kamu güvenlik politikası
  },
});
