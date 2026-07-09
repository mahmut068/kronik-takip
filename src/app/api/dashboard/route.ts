import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const isAdmin = (session.user as any).role === 'ADMIN';
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Admin tüm verileri görür, doktor sadece kendi hastalarını
  const patientFilter = isAdmin ? {} : { doctorId: session.user!.id };
  const alertFilter   = isAdmin ? {} : { doctorId: session.user!.id };

  const patientIds = isAdmin
    ? undefined
    : (await prisma.patient.findMany({ where: patientFilter, select: { id: true } })).map(p => p.id);

  const responseFilter = isAdmin
    ? {}
    : { patient: { doctorId: session.user!.id } };

  const [
    totalPatients,
    activePatients,
    openAlerts,
    todayResponses,
    totalResponses,
    criticalAlerts,
    recentAlerts,
    smsLogs,
    diseaseStats,
  ] = await Promise.all([
    prisma.patient.count({ where: patientFilter }),
    prisma.patient.count({ where: { ...patientFilter, isActive: true } }),
    prisma.alert.count({ where: { ...alertFilter, resolvedAt: null } }),
    prisma.patientResponse.count({
      where: { ...responseFilter, respondedAt: { gte: today } },
    }),
    prisma.patientResponse.count({ where: responseFilter }),
    prisma.alert.count({ where: { ...alertFilter, resolvedAt: null, severity: 'CRITICAL' } }),
    prisma.alert.findMany({
      where: { ...alertFilter, resolvedAt: null },
      include: { patient: { select: { name: true, disease: true } } },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.smsLog.findMany({
      where: patientIds ? { patientId: { in: patientIds } } : {},
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.patient.groupBy({
      by: ['disease'],
      where: patientFilter,
      _count: { id: true },
    }),
  ]);

  return NextResponse.json({
    totalPatients,
    activePatients,
    openAlerts,
    todayResponses,
    totalResponses,
    criticalAlerts,
    recentAlerts,
    smsLogs,
    diseaseStats: diseaseStats.map(d => ({ disease: d.disease, count: d._count.id })),
  });
}
