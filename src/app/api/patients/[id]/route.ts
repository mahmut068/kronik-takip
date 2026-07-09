import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { writeAuditLog } from '@/lib/audit';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role    = (session.user as any).role;
  const isAdmin = role === 'ADMIN' || role === 'MANAGER' || role === 'INSPECTOR';

  const patient = await prisma.patient.findFirst({
    where: isAdmin
      ? { id }
      : { id, doctorId: session.user!.id },
    include: {
      doctor:    { select: { name: true, specialty: true, department: true } },
      questionSets: { include: { questions: { orderBy: { orderIndex: 'asc' } } } },
      responses: { include: { question: true }, orderBy: { respondedAt: 'desc' }, take: 50 },
      alerts:    { orderBy: { createdAt: 'desc' }, take: 30 },
    },
  });

  if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Audit log — hasta detayı okundu
  await writeAuditLog({
    userId:     session.user!.id as string,
    userRole:   role,
    userEmail:  session.user!.email!,
    action:     'READ',
    resource:   'patient',
    resourceId: id,
    result:     'SUCCESS',
  });

  // TC Kimlik maskele (sadece DOCTOR/NURSE görmeli, ADMIN tam görebilir)
  const result = {
    ...patient,
    tcKimlik: patient.tcKimlik
      ? (isAdmin ? patient.tcKimlik : `***${patient.tcKimlik.slice(-4)}`)
      : null,
  };

  return NextResponse.json(result);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as any).role;
  if (role === 'NURSE' || role === 'INSPECTOR') {
    return NextResponse.json({ error: 'Bu işlem için yetkiniz yok.' }, { status: 403 });
  }

  const body = await req.json();

  const { id } = await params;

  const before = await prisma.patient.findUnique({
    where:  { id },
    select: { name: true, disease: true, thresholdValue: true, isActive: true },
  });

  const patient = await prisma.patient.update({
    where: { id },
    data:  body,
  });

  await writeAuditLog({
    userId:     session.user!.id as string,
    userRole:   role,
    userEmail:  session.user!.email!,
    action:     'UPDATE',
    resource:   'patient',
    resourceId: id,
    beforeData: before,
    afterData:  { name: body.name, disease: body.disease, thresholdValue: body.thresholdValue },
    result:     'SUCCESS',
  });

  return NextResponse.json(patient);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== 'ADMIN' && role !== 'DOCTOR') {
    return NextResponse.json({ error: 'Hasta silme yetkisi yok.' }, { status: 403 });
  }

  const { id } = await params;

  const patient = await prisma.patient.findUnique({
    where:  { id },
    select: { name: true, disease: true, tcKimlik: true },
  });

  await prisma.patient.delete({ where: { id } });

  await writeAuditLog({
    userId:     session.user!.id as string,
    userRole:   role,
    userEmail:  session.user!.email!,
    action:     'DELETE',
    resource:   'patient',
    resourceId: id,
    beforeData: { name: patient?.name, disease: patient?.disease },
    result:     'SUCCESS',
  });

  return NextResponse.json({ ok: true });
}
