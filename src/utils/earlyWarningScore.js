/**
 * MediTrack Enterprise — earlyWarningScore.js
 * Yapay Zekalı Erken Uyarı Sistemi (EWS)
 *
 * NEWS2 benzeri ağırlıklı skor + 48 saatlik regresyon analizi
 * + Eşiğe ulaşma süresi tahmini + Türkçe açıklama cümleleri
 */

// ─── Yardımcı: değerleri çek ─────────────────────────────────────────────────
const _vals = (history = []) =>
  history.map(h => Number(h.value)).filter(v => !isNaN(v));

// ─── Yardımcı: lineer regresyon eğimi ────────────────────────────────────────
const _slope = (vals) => {
  if (vals.length < 2) return 0;
  const n = vals.length;
  const xs = vals.map((_, i) => i);
  const sumX  = xs.reduce((a, v) => a + v, 0);
  const sumY  = vals.reduce((a, v) => a + v, 0);
  const sumXY = xs.reduce((a, x, i) => a + x * vals[i], 0);
  const sumX2 = xs.reduce((a, x) => a + x * x, 0);
  const denom = n * sumX2 - sumX * sumX;
  return denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
};

// ─── Yardımcı: ivme (eğim değişimi) ─────────────────────────────────────────
const _acceleration = (vals) => {
  if (vals.length < 4) return 0;
  const half = Math.floor(vals.length / 2);
  return _slope(vals.slice(half)) - _slope(vals.slice(0, half));
};

// ─── 1. Trend skoru (0–40) ───────────────────────────────────────────────────
const _trendScore40 = (vals, threshold) => {
  if (vals.length < 2) return 20;
  const recent = vals.slice(-6);
  const s = _slope(recent);
  const acc = _acceleration(recent);
  const slopeRatio = Math.abs(s) / (threshold || 100);
  const accelBonus = acc > 0 ? Math.min(acc / (threshold || 100) * 200, 10) : 0;
  const raw = Math.min(slopeRatio * 600, 30) + accelBonus;
  return s > 0 ? Math.min(raw, 40) : Math.min(raw * 0.4, 40);
};

// ─── 2. Eşiğe yakınlık skoru (0–30) ─────────────────────────────────────────
const _proximityScore30 = (current, threshold) => {
  if (!threshold) return 0;
  const ratio = current / threshold;
  if (ratio >= 1.0)  return 30;
  if (ratio >= 0.90) return 25;
  if (ratio >= 0.80) return 18;
  if (ratio >= 0.65) return 10;
  return Math.max(ratio * 15, 0);
};

// ─── 3. Volatilite skoru (0–15) ──────────────────────────────────────────────
const _volatility15 = (vals) => {
  if (vals.length < 3) return 0;
  const recent = vals.slice(-5);
  const mean = recent.reduce((a, v) => a + v, 0) / recent.length;
  const variance = recent.reduce((a, v) => a + (v - mean) ** 2, 0) / recent.length;
  const cv = mean !== 0 ? Math.sqrt(variance) / Math.abs(mean) : 0;
  return Math.min(cv * 75, 15);
};

// ─── 4. Uyum skoru (0–15) ────────────────────────────────────────────────────
const _complianceScore15 = (history) => {
  const measured = Math.min(history.length, 7);
  return (1 - measured / 7) * 15;
};

// ─── EWS seviye belirle ───────────────────────────────────────────────────────
const _ewsLevel = (score100) => {
  const ews = Math.min(Math.round(score100 / 10), 10);
  if (ews <= 2) return { ews, level: 'low',      color: '#22c55e', label: 'Düşük Risk'   };
  if (ews <= 4) return { ews, level: 'medium',   color: '#84cc16', label: 'Hafif Yüksek' };
  if (ews <= 6) return { ews, level: 'elevated', color: '#f59e0b', label: 'Orta Yüksek'  };
  if (ews <= 8) return { ews, level: 'high',     color: '#f97316', label: 'Yüksek Risk'  };
  return              { ews, level: 'critical',  color: '#ef4444', label: 'Kritik Risk'  };
};

// ─── Eşiğe ulaşma süresi tahmini (saat) ──────────────────────────────────────
const _hoursToThreshold = (vals, threshold) => {
  if (vals.length < 2) return null;
  const s = _slope(vals.slice(-6));
  if (s <= 0) return null;
  const current = vals[vals.length - 1];
  if (current >= threshold) return 0;
  return Math.round(((threshold - current) / s) * 6);
};

// ─── Türkçe açıklama cümlesi ─────────────────────────────────────────────────
const _buildNarrative = ({ vals, threshold, hoursToThreshold, score100, acc }) => {
  const n = vals.length;
  if (n < 2) return 'Yeterli ölçüm verisi bulunmuyor.';
  const recent3 = vals.slice(-3);
  const isRising = recent3.length >= 2 && recent3[recent3.length - 1] > recent3[0];
  const isAccelerating = acc > 0.5;
  const current = vals[vals.length - 1];
  const ratio = current / threshold;
  const parts = [];

  if (isRising && isAccelerating)
    parts.push(`Son ${Math.min(n, 6)} ölçümde ivmelenen artış trendi`);
  else if (isRising)
    parts.push(`Son ${Math.min(n, 6)} ölçümde stabil yükseliş`);
  else
    parts.push('Son ölçümlerde düşüş veya stabil seyir');

  if (ratio >= 0.95) parts.push(`Değer eşiğin %${Math.round(ratio * 100)}'inde`);
  else if (ratio >= 0.80) parts.push(`Eşiğe yaklaşıyor (%${Math.round(ratio * 100)})`);

  if (hoursToThreshold !== null && hoursToThreshold <= 48) {
    if (hoursToThreshold <= 6)
      parts.push(`⚠️ Eşik ~${hoursToThreshold} saat içinde aşılabilir`);
    else if (hoursToThreshold <= 24)
      parts.push(`${hoursToThreshold} saat içinde kriz riski %${Math.min(score100, 95)}`);
    else
      parts.push(`~${hoursToThreshold} saat içinde eşik aşılması bekleniyor`);
  } else if (hoursToThreshold === null) {
    parts.push('Mevcut trendde eşik aşılması öngörülmüyor');
  }

  return parts.join(' · ');
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANA FONKSİYON
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * @param {Object} patient
 * @returns {{ ews, score100, level, label, color, narrative, hoursToThreshold, factors }}
 */
export const calculateEWS = (patient) => {
  if (!patient) return {
    ews: 0, score100: 0, level: 'low', label: 'Veri Yok',
    color: '#6b7280', narrative: 'Hasta verisi yok.', hoursToThreshold: null, factors: []
  };

  const history   = patient.history ?? [];
  const threshold = Number(patient.threshold ?? 100);
  const vals      = _vals(history);
  const current   = Number(patient.currentValue ?? 0);

  const tScore = _trendScore40(vals, threshold);
  const pScore = _proximityScore30(current, threshold);
  const vScore = _volatility15(vals);
  const cScore = _complianceScore15(history);

  const score100 = Math.min(Math.max(Math.round(tScore + pScore + vScore + cScore), 0), 100);
  const ewsInfo  = _ewsLevel(score100);
  const acc      = _acceleration(vals.slice(-6));
  const hrs      = _hoursToThreshold(vals, threshold);

  const narrative = _buildNarrative({ vals, threshold, hoursToThreshold: hrs, score100, acc });

  const factors = [];
  if (tScore >= 25)     factors.push('Hızlı yükseliş trendi');
  else if (tScore >= 15) factors.push('Orta seviye yükseliş');
  if (pScore >= 22)     factors.push('Eşiğe çok yakın');
  else if (pScore >= 15) factors.push('Eşiğe yaklaşıyor');
  if (vScore >= 10)     factors.push('Yüksek biyometrik volatilite');
  if (cScore >= 10)     factors.push('Düşük ölçüm uyumu');
  if (acc > 0.5)        factors.push('Artış ivmeleniyor');
  if (factors.length === 0) factors.push('Tüm parametreler normal');

  return { ...ewsInfo, score100, narrative, hoursToThreshold: hrs, factors };
};

export const calculateBulkEWS = (patients = []) =>
  patients.map(p => ({ patientId: p.id, patientName: p.name, ...calculateEWS(p) }));

export const getCriticalByEWS = (patients = [], minEws = 7) =>
  calculateBulkEWS(patients).filter(r => r.ews >= minEws).sort((a, b) => b.ews - a.ews);
