import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Veritabanına mikro-ping (Heartbeat) gönder. Bu sayede soğuk başlangıç (cold-start) engellenir.
    const dbCheck = await prisma.$queryRaw`SELECT 1`;
    
    // 2. Her şey yolundaysa dış dünyaya 200 OK ve HEALTHY döneriz.
    return NextResponse.json({ 
      status: 'HEALTHY', 
      database: 'CONNECTED', 
      timestamp: new Date().toISOString() 
    }, { status: 200 });

  } catch (error) {
    // 3. Veritabanı ulaşılamazsa veya sistem çökmek üzereyse anında 503 Service Unavailable döneriz.
    console.error('CRITICAL HEALTH CHECK FAILED:', error);
    return NextResponse.json({ 
      status: 'UNHEALTHY', 
      database: 'DISCONNECTED', 
      error: String(error) 
    }, { status: 503 });
  }
}
