/**
 * MediTrack Enterprise v11.0
 * Anomaly Detector - Z-Skoru Tabanlı Anomali Tespit Motoru
 *
 * Algoritma:
 *  - Ortalama (μ) ve standart sapma (σ) hesapla
 *  - |z| > 2 → warning anomaly
 *  - |z| > 3 → critical anomaly
 */

// ─── Yardımcı: ortalama ──────────────────────────────────────────────────────
const _mean = (arr) => {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
};

// ─── Yardımcı: standart sapma ────────────────────────────────────────────────
const _std = (arr, mu) => {
  if (!arr || arr.length < 2) return 0;
  const m = mu !== undefined ? mu : _mean(arr);
  const variance = arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
};

// ─── Z-skoru hesapla ─────────────────────────────────────────────────────────
const _zScore = (value, mu, sigma) => {
  if (sigma === 0) return 0;
  return (value - mu) / sigma;
};

// ─── Severity belirle ────────────────────────────────────────────────────────
const _severity = (absZ) => {
  if (absZ > 3) return 'critical';
  if (absZ > 2) return 'warning';
  return 'normal';
};

// ─── Ana Fonksiyon: detectAnomalies ─────────────────────────────────────────
/**
 * Geçmiş ölçüm dizisindeki anomalileri tespit eder.
 *
 * @param {Array<{date: string, value: number|string}>} history
 * @returns {Array<{date: string, value: number, isAnomaly: boolean, zScore: number, severity: 'normal'|'warning'|'critical'}>}
 */
export const detectAnomalies = (history = []) => {
  if (!Array.isArray(history) || history.length === 0) return [];

  const values = history.map((h) => Number(h.value)).filter((v) => !isNaN(v));

  const mu = _mean(values);
  const sigma = _std(values, mu);

  return history.map((entry) => {
    const val = Number(entry.value);
    const z = isNaN(val) ? 0 : _zScore(val, mu, sigma);
    const absZ = Math.abs(z);
    const isAnomaly = absZ > 2;

    return {
      date: entry.date,
      value: isNaN(val) ? null : val,
      isAnomaly,
      zScore: Math.round(z * 100) / 100,
      severity: _severity(absZ),
    };
  });
};

// ─── İstatistik Özeti: getAnomalyStats ───────────────────────────────────────
/**
 * Hasta için anomali istatistiklerini döndürür.
 *
 * @param {Object} patient  — { history: [{date, value}], ...  }
 * @returns {{ anomalyCount: number, lastAnomaly: Object|null, trend: 'improving'|'worsening'|'stable' }}
 */
export const getAnomalyStats = (patient) => {
  const history = patient?.history ?? [];
  if (history.length === 0) {
    return { anomalyCount: 0, lastAnomaly: null, trend: 'stable' };
  }

  const analyzed = detectAnomalies(history);

  // Toplam anomali sayısı
  const anomalies = analyzed.filter((e) => e.isAnomaly);
  const anomalyCount = anomalies.length;

  // Son anomali
  const lastAnomaly = anomalyCount > 0 ? anomalies[anomalies.length - 1] : null;

  // Trend: son yarıyı vs ilk yarıyı karşılaştır
  const mid = Math.floor(analyzed.length / 2);
  const firstHalf = analyzed.slice(0, mid);
  const secondHalf = analyzed.slice(mid);

  const firstAnomalyRate = firstHalf.length > 0
    ? firstHalf.filter((e) => e.isAnomaly).length / firstHalf.length
    : 0;
  const secondAnomalyRate = secondHalf.length > 0
    ? secondHalf.filter((e) => e.isAnomaly).length / secondHalf.length
    : 0;

  let trend;
  const delta = secondAnomalyRate - firstAnomalyRate;
  if (delta > 0.05) trend = 'worsening';
  else if (delta < -0.05) trend = 'improving';
  else trend = 'stable';

  // Kritik anomali tespiti trendi ağırlaştırır
  const recentCriticals = secondHalf.filter((e) => e.severity === 'critical').length;
  if (recentCriticals >= 2 && trend !== 'worsening') trend = 'worsening';

  return { anomalyCount, lastAnomaly, trend };
};
