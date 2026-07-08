/**
 * RBAC — Rol Tabanlı Erişim Kontrolü
 * SB Kamu Güvenlik Politikası / ISO 27001 A.9
 *
 * Roller:
 *  ADMIN       — Sistem yöneticisi (tam yetki)
 *  DOCTOR      — Uzman/pratisyen hekim (kendi hastaları)
 *  NURSE       — Hemşire (okuma + yanıt girişi)
 *  DATA_ENTRY  — Veri giriş personeli (kayıt aç/güncelle)
 *  MANAGER     — Hastane yöneticisi (salt okunur + rapor)
 *  INSPECTOR   — Bakanlık denetçisi (salt okunur + audit)
 */

export type Role = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'DATA_ENTRY' | 'MANAGER' | 'INSPECTOR';

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN:      'Sistem Yöneticisi',
  DOCTOR:     'Hekim',
  NURSE:      'Hemşire',
  DATA_ENTRY: 'Veri Giriş Personeli',
  MANAGER:    'Hastane Yöneticisi',
  INSPECTOR:  'Bakanlık Denetçisi',
};

export const ROLE_COLORS: Record<Role, string> = {
  ADMIN:      '#f43f5e',
  DOCTOR:     '#00e5ff',
  NURSE:      '#10b981',
  DATA_ENTRY: '#f59e0b',
  MANAGER:    '#a78bfa',
  INSPECTOR:  '#3b82f6',
};

export type Permission =
  // Hasta
  | 'patient:create'
  | 'patient:read'
  | 'patient:read_all'    // Tüm hastaları görmek (sadece kendi değil)
  | 'patient:update'
  | 'patient:delete'
  // Yanıt
  | 'response:create'
  | 'response:read'
  // Alarm
  | 'alert:read'
  | 'alert:resolve'
  // Rapor
  | 'report:read'
  | 'report:export'
  // Kullanıcı yönetimi
  | 'user:create'
  | 'user:read'
  | 'user:update'
  | 'user:delete'
  // Audit
  | 'audit:read'
  // Sistem
  | 'system:settings'
  | 'system:backup';

const PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    'patient:create', 'patient:read', 'patient:read_all', 'patient:update', 'patient:delete',
    'response:create', 'response:read',
    'alert:read', 'alert:resolve',
    'report:read', 'report:export',
    'user:create', 'user:read', 'user:update', 'user:delete',
    'audit:read',
    'system:settings', 'system:backup',
  ],
  DOCTOR: [
    'patient:create', 'patient:read', 'patient:update',
    'response:create', 'response:read',
    'alert:read', 'alert:resolve',
    'report:read', 'report:export',
  ],
  NURSE: [
    'patient:read',
    'response:create', 'response:read',
    'alert:read',
    'report:read',
  ],
  DATA_ENTRY: [
    'patient:create', 'patient:read', 'patient:update',
    'response:read',
    'alert:read',
  ],
  MANAGER: [
    'patient:read', 'patient:read_all',
    'response:read',
    'alert:read',
    'report:read', 'report:export',
    'user:read',
    'audit:read',
  ],
  INSPECTOR: [
    'patient:read', 'patient:read_all',
    'response:read',
    'alert:read',
    'report:read', 'report:export',
    'user:read',
    'audit:read',
  ],
};

export function hasPermission(role: string, permission: Permission): boolean {
  const perms = PERMISSIONS[role as Role];
  if (!perms) return false;
  return perms.includes(permission);
}

export function getPermissions(role: string): Permission[] {
  return PERMISSIONS[role as Role] ?? [];
}

/** API route'larında kullanım: yetkisiz ise 403 fırlat */
export function requirePermission(role: string, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`PERMISSION_DENIED:${permission}`);
  }
}
