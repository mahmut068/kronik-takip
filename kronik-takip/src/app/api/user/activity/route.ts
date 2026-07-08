import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/user/activity — Son 50 giriş/işlem logu
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as any).role;

  // Inspector ve Admin tüm logları görebilir
  const where = (role === 'ADMIN' || role === 'INSPECTOR')
    ? {}
    : { userId: session.user!.id };

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true, action: true, resource: true, resourceId: true,
      result: true, ipAddress: true, createdAt: true,
      userEmail: true, userRole: true,
    },
  });

  return NextResponse.json(logs);
}
