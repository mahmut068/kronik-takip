import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { writeAuditLog } from '@/lib/audit';

// GET /api/user/profile
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user!.id },
    select: {
      id: true, name: true, email: true, role: true,
      specialty: true, department: true, phone: true,
      passwordChangedAt: true, mustChangePassword: true,
      lastLoginAt: true, lastLoginIp: true, isActive: true,
      createdAt: true,
    },
  });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(user);
}

// PATCH /api/user/profile
export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, specialty, department, phone } = body;

  const before = await prisma.user.findUnique({
    where: { id: session.user!.id },
    select: { name: true, specialty: true, department: true, phone: true },
  });

  const updated = await prisma.user.update({
    where: { id: session.user!.id },
    data:  { name, specialty, department, phone },
    select: { id: true, name: true, email: true, role: true, specialty: true, department: true, phone: true },
  });

  await writeAuditLog({
    userId:    session.user!.id as string,
    userRole:  (session.user as any).role,
    userEmail: session.user!.email!,
    action:    'UPDATE',
    resource:  'user',
    resourceId: session.user!.id,
    beforeData: before,
    afterData:  { name, specialty, department, phone },
    result:    'SUCCESS',
  });

  return NextResponse.json(updated);
}
