import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/sms-logs?page=1&limit=50
export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role    = (session.user as any).role;
  const isAdmin = role === 'ADMIN' || role === 'MANAGER' || role === 'INSPECTOR';

  const { searchParams } = new URL(req.url);
  const page  = Math.max(1, parseInt(searchParams.get('page')  || '1'));
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '50'));
  const skip  = (page - 1) * limit;

  // Doktor kendi hastalarının loglarını görür
  const where: any = isAdmin ? {} : {
    patient: { doctorId: session.user!.id as string },
  };

  const [total, logs] = await Promise.all([
    prisma.smsLog.count({ where }),
    prisma.smsLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  return NextResponse.json({ logs, total, page, totalPages: Math.ceil(total / limit) });
}
