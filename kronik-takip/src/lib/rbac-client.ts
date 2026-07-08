/**
 * Client-safe RBAC sabitler
 * Server-only kodları içermez — sadece etiket/renk bilgileri
 */
export type Role = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'DATA_ENTRY' | 'MANAGER' | 'INSPECTOR';

export const ROLE_LABELS: Record<string, string> = {
  ADMIN:      'Sistem Yöneticisi',
  DOCTOR:     'Hekim',
  NURSE:      'Hemşire',
  DATA_ENTRY: 'Veri Giriş Personeli',
  MANAGER:    'Hastane Yöneticisi',
  INSPECTOR:  'Bakanlık Denetçisi',
};

export const ROLE_COLORS: Record<string, string> = {
  ADMIN:      '#f43f5e',
  DOCTOR:     '#00e5ff',
  NURSE:      '#10b981',
  DATA_ENTRY: '#f59e0b',
  MANAGER:    '#a78bfa',
  INSPECTOR:  '#3b82f6',
};
