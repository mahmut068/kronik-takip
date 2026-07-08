import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// POST /api/question-sets  { patientId, name, schedule, days, questions: [{text,responseType,unit,isThreshold,orderIndex}] }
export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { patientId, name, schedule, days, questions } = await req.json();
  const qs = await prisma.questionSet.create({
    data: {
      patientId, name, schedule, days,
      questions: { create: questions },
    },
    include: { questions: true },
  });
  return NextResponse.json(qs, { status: 201 });
}

// DELETE /api/question-sets?id=xxx
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await prisma.questionSet.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
