import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz Erişim' }, { status: 403 });
  }

  try {
    const doctors = await prisma.user.findMany({
      where: { role: 'DOCTOR' },
      select: {
        id: true,
        name: true,
        email: true,
        specialty: true,
        department: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Veritabanı hatası' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz Erişim' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, email, password, specialty, department, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanımda' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'DOCTOR',
        specialty,
        department,
        phone,
      },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json(newDoctor, { status: 201 });
  } catch (error) {
    console.error('Error creating doctor:', error);
    return NextResponse.json({ error: 'Kayıt oluşturulamadı' }, { status: 500 });
  }
}
