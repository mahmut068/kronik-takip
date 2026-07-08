import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public route — no auth needed. Called by patient via SMS link token.
// POST /api/respond  { token, answers: [{ questionId, value, rawAnswer }] }
export async function POST(req: Request) {
  const { token, answers } = await req.json();

  // Validate token
  const rt = await prisma.responseToken.findUnique({ where: { token } });
  if (!rt || rt.usedAt || new Date() > rt.expiresAt) {
    return NextResponse.json({ error: 'Link geçersiz veya süresi dolmuş.' }, { status: 400 });
  }

  const patient = await prisma.patient.findUnique({
    where: { id: rt.patientId },
    include: { doctor: { select: { id: true } } },
  });
  if (!patient) return NextResponse.json({ error: 'Hasta bulunamadı.' }, { status: 404 });

  let triggeredAlert = false;

  // Save responses & check threshold
  for (const ans of answers) {
    const numVal = parseFloat(ans.rawAnswer);
    const threshold = !isNaN(numVal) && numVal > patient.thresholdValue;

    await prisma.patientResponse.create({
      data: {
        patientId: patient.id,
        questionId: ans.questionId,
        value: isNaN(numVal) ? null : numVal,
        rawAnswer: ans.rawAnswer,
        channel: 'SMS',
        triggeredAlert: threshold,
      },
    });

    if (threshold && !triggeredAlert) {
      triggeredAlert = true;
      await prisma.alert.create({
        data: {
          patientId: patient.id,
          doctorId: patient.doctor.id,
          triggerValue: numVal,
          thresholdValue: patient.thresholdValue,
          message: `${patient.name} eşik değerini aştı! Ölçüm: ${numVal} (Sınır: ${patient.thresholdValue} ${patient.thresholdLabel})`,
          severity: numVal > patient.thresholdValue * 1.2 ? 'CRITICAL' : 'HIGH',
          notifiedDoctor: false,
          notifiedPatient: false,
        },
      });
    }
  }

  // Mark token as used
  await prisma.responseToken.update({ where: { token }, data: { usedAt: new Date() } });

  return NextResponse.json({ ok: true, alert: triggeredAlert });
}
