import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { writeAuditLog } from '@/lib/audit';

// GET /api/alerts
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role    = (session.user as any).role;
  const isAdmin = role === 'ADMIN' || role === 'MANAGER' || role === 'INSPECTOR';

  const alerts = await prisma.alert.findMany({
    where: isAdmin ? {} : { doctorId: session.user!.id },
    include: { patient: { select: { name: true, disease: true, phone: true, tcKimlik: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  // TC Kimlik maskele
  const masked = alerts.map(a => ({
    ...a,
    patient: a.patient ? {
      ...a.patient,
      tcKimlik: a.patient.tcKimlik ? `***${a.patient.tcKimlik.slice(-4)}` : null,
    } : null,
  }));

  return NextResponse.json(masked);
}

// PATCH /api/alerts  { id, resolvedNote }
export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, resolvedNote } = await req.json();

  const before = await prisma.alert.findUnique({ where: { id }, select: { resolvedAt: true } });

  const alert = await prisma.alert.update({
    where: { id },
    data:  { resolvedAt: new Date(), resolvedNote },
  });

  await writeAuditLog({
    userId:     session.user!.id as string,
    userRole:   (session.user as any).role,
    userEmail:  session.user!.email!,
    action:     'ALARM_RESOLVE',
    resource:   'alert',
    resourceId: id,
    beforeData: { resolvedAt: before?.resolvedAt },
    afterData:  { resolvedAt: new Date(), resolvedNote },
    result:     'SUCCESS',
  });

  return NextResponse.json(alert);
}
