import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as any).role;
  // Sadece ADMIN, MANAGER veya INSPECTOR (Denetçi) audit loglarını görebilir.
  if (role !== 'ADMIN' && role !== 'MANAGER' && role !== 'INSPECTOR') {
    return NextResponse.json({ error: 'Bu veriyi görüntüleme yetkiniz yok.' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page   = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit  = Math.min(100, parseInt(searchParams.get('limit') || '50'));
  const skip   = (page - 1) * limit;

  // Arama / Filtreleme Opsiyonları
  const actionFilter = searchParams.get('action');
  const roleFilter   = searchParams.get('role');
  const search       = searchParams.get('search');

  const where: any = {};
  if (actionFilter && actionFilter !== 'ALL') where.action = actionFilter;
  if (roleFilter && roleFilter !== 'ALL')     where.userRole = roleFilter;
  if (search) {
    where.OR = [
      { userEmail: { contains: search } },
      { ipAddress: { contains: search } },
      { resource:  { contains: search } },
    ];
  }

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    logs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
