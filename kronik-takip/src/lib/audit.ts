/**
 * Denetim İzi (Audit Log) Servisi
 * KVKK Madde 12 — Kişisel veri güvenliği zorunluluğu
 * SB Bilgi Güvenliği Politikası — Her erişim kayıt altına alınır
 * Log'lar SİLİNEMEZ, minimum 10 yıl saklanır.
 */

import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export type AuditAction =
  | 'LOGIN'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'EXPORT'
  | 'ALARM_RESOLVE'
  | 'PASSWORD_CHANGE'
  | 'ACCOUNT_LOCKED'
  | 'ENABIZ_SYNC';

export type AuditResource =
  | 'patient'
  | 'alert'
  | 'response'
  | 'user'
  | 'report'
  | 'system'
  | 'auth';

export interface AuditLogParams {
  userId:     string;
  userRole:   string;
  userEmail:  string;
  action:     AuditAction;
  resource:   AuditResource;
  resourceId?: string;
  beforeData?: object | null;
  afterData?:  object | null;
  result?:    'SUCCESS' | 'FAIL' | 'DENIED';
  ipAddress?: string;
  sessionId?: string;
}

/**
 * Denetim kaydı yazar — asla başarısız olmamalı
 * Hata olsa bile ana işlemi bloklamamalı
 */
export async function writeAuditLog(params: AuditLogParams): Promise<void> {
  try {
    let ipAddress = params.ipAddress;
    if (!ipAddress) {
      try {
        const hdrs = await headers();
        ipAddress =
          hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ||
          hdrs.get('x-real-ip') ||
          '127.0.0.1';
      } catch {
        ipAddress = '127.0.0.1';
      }
    }

    await prisma.auditLog.create({
      data: {
        userId:     params.userId,
        userRole:   params.userRole,
        userEmail:  params.userEmail,
        action:     params.action,
        resource:   params.resource,
        resourceId: params.resourceId,
        beforeData: params.beforeData ? JSON.stringify(params.beforeData) : null,
        afterData:  params.afterData  ? JSON.stringify(params.afterData)  : null,
        result:     params.result ?? 'SUCCESS',
        ipAddress:  ipAddress ?? '127.0.0.1',
        sessionId:  params.sessionId,
      },
    });
  } catch (err) {
    // Audit log hatası ana işlemi ASLA durdurmamalı
    // Prodüksiyonda bu hata ayrı bir log dosyasına yazılır
    console.error('[AUDIT-LOG-ERROR]', err);
  }
}

/**
 * Hasta verisi için hassas alanları maskele (KVKK)
 */
export function maskPatientData(patient: any): any {
  if (!patient) return patient;
  return {
    ...patient,
    tcKimlik: patient.tcKimlik ? `***${patient.tcKimlik.slice(-4)}` : null,
    phone:    patient.phone    ? `****${patient.phone.slice(-4)}`    : null,
    sgkNo:    patient.sgkNo   ? `***${patient.sgkNo.slice(-4)}`     : null,
  };
}
