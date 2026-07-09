import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz Erişim' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { name, email, specialty, department, phone, isActive } = body;

    const updatedDoctor = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        specialty,
        department,
        phone,
        isActive,
      },
    });

    return NextResponse.json(updatedDoctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    return NextResponse.json({ error: 'Güncelleme başarısız' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz Erişim' }, { status: 403 });
  }

  const { id } = await params;

  try {
    // KVKK gereği hard delete yerine soft delete (isActive = false) yapıyoruz.
    const deletedDoctor = await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: 'Doktor başarıyla pasife alındı', doctor: deletedDoctor });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return NextResponse.json({ error: 'Silme (Pasife Alma) işlemi başarısız' }, { status: 500 });
  }
}
