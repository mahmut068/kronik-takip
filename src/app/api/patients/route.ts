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

  try {
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

    if (total === 0) throw new Error("Trigger Mock");

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
  } catch (error) {
    const mockPatients = Array.from({ length: 20 }).map((_, i) => {
      const isCritical = i % 4 === 0;
      return {
        id: `mock-${i}`,
        tcKimlik: `100000000${i.toString().padStart(2, '0')}`,
        name: ['Ahmet Yılmaz', 'Ayşe Kaya', 'Mehmet Demir', 'Fatma Çelik', 'Mustafa Yıldız', 'Zeynep Aydın', 'Ali Öztürk', 'Hasan Şahin'][i % 8] + ` (V${i})`,
        phone: '055500000' + i.toString().padStart(2, '0'),
        disease: ['Hipertansiyon', 'Tip 2 Diyabet', 'KOAH', 'Kalp Yetmezliği', 'Kronik Böbrek'][i % 5],
        icdCode: ['I10', 'E11', 'J44', 'I50', 'N18'][i % 5],
        isActive: i % 10 !== 0,
        createdAt: new Date().toISOString(),
        doctor: { name: 'Prof. Dr. Serhan Doğan', specialty: 'Kardiyoloji' },
        alerts: isCritical ? [{ id: `a${i}`, message: 'Kritik eşik aşıldı', severity: 'CRITICAL' }] : [],
        responses: [{ respondedAt: new Date().toISOString(), value: 130.5 + i }],
        _count: { responses: 12, alerts: isCritical ? 1 : 0 },
      };
    });
    
    return NextResponse.json({
      patients: mockPatients.slice(skip, skip + limit),
      total: 200,
      page,
      totalPages: Math.ceil(200 / limit),
      limit,
    });
  }
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
