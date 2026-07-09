import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { addHours } from 'date-fns';

// POST /api/send-questions  { patientId }  — manual trigger (in prod: cron runs this)
export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { patientId } = await req.json();

  const patient = await prisma.patient.findFirst({
    where: { id: patientId, doctorId: session.user!.id },
    include: { questionSets: { where: { isActive: true }, include: { questions: true } } },
  });
  if (!patient) return NextResponse.json({ error: 'Hasta bulunamadı' }, { status: 404 });

  const activeQS = patient.questionSets[0];
  if (!activeQS) return NextResponse.json({ error: 'Aktif soru seti yok' }, { status: 400 });

  // Generate response token (24h expiry)
  const token = await prisma.responseToken.create({
    data: {
      patientId: patient.id,
      questionSetId: activeQS.id,
      expiresAt: addHours(new Date(), 24),
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
  const link = `${baseUrl}/respond/${token.token}`;

  // Build SMS message
  const msg = `Sayın ${patient.name}, sağlık takip sorularınız için: ${link}\n(24 saat geçerlidir)`;

  // Log to SmsLog — in production: call Netgsm API here
  await prisma.smsLog.create({
    data: {
      patientId: patient.id,
      phone: patient.phone,
      message: msg,
      status: 'SENT', // mock — production: actual API call
    },
  });

  // --- Netgsm entegrasyon şablonu (gerçek API key ile aktif edilecek) ---
  // if (process.env.NETGSM_USER && process.env.NETGSM_PASS) {
  //   await fetch('https://api.netgsm.com.tr/sms/send/get', {
  //     method: 'POST',
  //     body: new URLSearchParams({
  //       usercode: process.env.NETGSM_USER!,
  //       password: process.env.NETGSM_PASS!,
  //       gsmno: patient.phone,
  //       message: msg,
  //       msgheader: process.env.NETGSM_FROM || 'KRONIK',
  //       dil: patient.language === 'tr' ? '0' : '1',
  //     })
  //   });
  // }

  return NextResponse.json({ ok: true, link, message: msg });
}
