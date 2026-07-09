import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';
import { validatePassword, isPasswordExpired } from '@/lib/password-policy';
import { writeAuditLog } from '@/lib/audit';

// POST /api/user/change-password
export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();

  // 1. Mevcut şifreyi doğrula
  const user = await prisma.user.findUnique({ where: { id: session.user!.id } });
  if (!user) return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    await writeAuditLog({
      userId: user.id, userRole: user.role, userEmail: user.email,
      action: 'PASSWORD_CHANGE', resource: 'user', resourceId: user.id,
      result: 'FAIL', afterData: { reason: 'Mevcut şifre hatalı' },
    });
    return NextResponse.json({ error: 'Mevcut şifre hatalı.' }, { status: 400 });
  }

  // 2. Yeni şifre politikası kontrolü
  const validation = validatePassword(newPassword);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.errors[0], errors: validation.errors }, { status: 400 });
  }

  // 3. Yeni şifre eskiyle aynı olmamalı
  const sameAsOld = await bcrypt.compare(newPassword, user.password);
  if (sameAsOld) {
    return NextResponse.json({ error: 'Yeni şifre mevcut şifrenizle aynı olamaz.' }, { status: 400 });
  }

  // 4. Güncelle
  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data:  { password: hashed, passwordChangedAt: new Date(), mustChangePassword: false },
  });

  await writeAuditLog({
    userId: user.id, userRole: user.role, userEmail: user.email,
    action: 'PASSWORD_CHANGE', resource: 'user', resourceId: user.id,
    result: 'SUCCESS',
  });

  return NextResponse.json({ ok: true, message: 'Şifreniz başarıyla güncellendi.' });
}
