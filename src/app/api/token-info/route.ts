import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) return NextResponse.json({ error: 'Token eksik' }, { status: 400 });

  const rt = await prisma.responseToken.findUnique({
    where: { token }
  });

  if (!rt || rt.usedAt || new Date() > rt.expiresAt) {
    return NextResponse.json({ error: 'Link geçersiz veya süresi dolmuş.' }, { status: 400 });
  }

  const patient = await prisma.patient.findUnique({
    where: { id: rt.patientId },
    select: { name: true, literacyLevel: true }
  });

  const qs = await prisma.questionSet.findUnique({
    where: { id: rt.questionSetId },
    include: { questions: { orderBy: { orderIndex: 'asc' }, select: { id: true, text: true, responseType: true } } }
  });

  return NextResponse.json({
    patientName: patient?.name,
    literacyLevel: patient?.literacyLevel,
    questions: qs?.questions || [],
  });
}
