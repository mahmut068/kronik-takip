import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/patients?page=1&limit=20&search=&filter=
export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page   = Math.max(1, parseInt(searchParams.get('page')   || '1'));
  const limit  = Math.min(50, parseInt(searchParams.get('limit') || '24'));
  const search = searchParams.get('search') || '';
  const filter = searchParams.get('filter') || 'Tümü'; // Tümü | Kritik | Aktif | Pasif
  const skip   = (page - 1) * limit;

  const isAdmin = (session.user as any).role === 'ADMIN';
  const baseWhere: any = isAdmin ? {} : { doctorId: session.user!.id };

  // Arama filtresi
  if (search) {
    baseWhere.OR = [
      { name:    { contains: search } },
      { disease: { contains: search } },
      { phone:   { contains: search } },
    ];
  }

  // Durum filtresi (Kritik/Aktif/Pasif) — alert durumu subquery ile
  let whereWithFilter: any = { ...baseWhere };
  if (filter === 'Aktif')  whereWithFilter = { ...baseWhere, isActive: true };
  if (filter === 'Pasif')  whereWithFilter = { ...baseWhere, isActive: false };

  const [total, patients] = await Promise.all([
    prisma.patient.count({ where: whereWithFilter }),
    prisma.patient.findMany({
      where:   whereWithFilter,
      include: {
        doctor:    { select: { name: true, specialty: true } },
        _count:    { select: { responses: true, alerts: true } },
        alerts:    { where: { resolvedAt: null }, take: 1, orderBy: { createdAt: 'desc' }, select: { id: true, message: true, severity: true } },
        responses: { take: 1, orderBy: { respondedAt: 'desc' }, select: { respondedAt: true, value: true } },
      },
      orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: limit,
    }),
  ]);

  // Kritik filtresi client-side'dan çıkarıldı — server'da alert varlığına göre sırala
  let result = patients;
  if (filter === 'Kritik') {
    result = patients.filter(p => p.alerts.length > 0);
  }

  return NextResponse.json({
    patients: result,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    limit,
  });
}

// POST /api/patients — Yeni hasta ekle
export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body    = await req.json();
  const patient = await prisma.patient.create({
    data: { ...body, doctorId: session.user!.id },
  });
  return NextResponse.json(patient, { status: 201 });
}
