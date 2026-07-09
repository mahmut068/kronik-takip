/**
 * Kamu Güvenlik Politikası — Şifre Doğrulama
 * ISO 27001 / SB BGYS gereklilikleri
 * - Min 12 karakter
 * - Büyük + küçük harf + rakam + özel karakter
 * - 90 günde bir zorunlu değişim
 * - Son 5 şifre tekrar kullanılamaz (TODO: şifre geçmişi tablosu)
 */

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very_strong';
  score: number;
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  if (password.length < 12) {
    errors.push('Şifre en az 12 karakter olmalıdır.');
  } else {
    score += password.length >= 16 ? 2 : 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('En az bir büyük harf içermelidir (A-Z).');
  } else score++;

  if (!/[a-z]/.test(password)) {
    errors.push('En az bir küçük harf içermelidir (a-z).');
  } else score++;

  if (!/[0-9]/.test(password)) {
    errors.push('En az bir rakam içermelidir (0-9).');
  } else score++;

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('En az bir özel karakter içermelidir (!@#$%^&* vb.).');
  } else score++;

  // Yaygın zayıf şifreler
  const commonPasswords = ['Admin123!', 'Password1!', 'Sifre123!', 'Hastane1!'];
  if (commonPasswords.some(p => password.toLowerCase() === p.toLowerCase())) {
    errors.push('Bu şifre çok yaygın. Daha özgün bir şifre seçin.');
    score = 0;
  }

  // Ardışık karakter kontrolü
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Ardışık aynı karakterler kullanılamaz (örn: aaa, 111).');
    score = Math.max(0, score - 1);
  }

  const strength =
    score >= 5 ? 'very_strong' :
    score >= 4 ? 'strong' :
    score >= 2 ? 'medium' : 'weak';

  return { valid: errors.length === 0, errors, strength, score };
}

/**
 * 90 günlük şifre süresi kontrolü
 */
export function isPasswordExpired(passwordChangedAt: Date): boolean {
  const EXPIRY_DAYS = 90;
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - passwordChangedAt.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= EXPIRY_DAYS;
}

/**
 * Şifre değişiminin kaç gün sonra dolduğunu döner
 */
export function daysUntilExpiry(passwordChangedAt: Date): number {
  const EXPIRY_DAYS = 90;
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - passwordChangedAt.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, EXPIRY_DAYS - diffDays);
}

/**
 * Hesap kilitleme kontrolü
 */
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MINUTES = 30;

export function isAccountLocked(lockedUntil: Date | null): boolean {
  if (!lockedUntil) return false;
  return new Date() < lockedUntil;
}

export function getLockoutRemainingMinutes(lockedUntil: Date | null): number {
  if (!lockedUntil) return 0;
  const remaining = lockedUntil.getTime() - Date.now();
  return Math.max(0, Math.ceil(remaining / 60000));
}
