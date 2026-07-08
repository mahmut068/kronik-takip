/**
 * MediTrack Enterprise v11.0
 * Risk Engine - 7 Günlük Risk Tahmin Motoru
 *
 * Faktörler:
 *  1. Değer/Eşik Oranı   → max 40 puan
 *  2. Trend Skoru         → max 30 puan
 *  3. Uyum Skoru          → max 20 puan  (eksik ölçüm = yüksek risk)
 *  4. Biyometrik Vola.    → max 10 puan
 */

// ─── Yardımcı: standart sapma ───────────────────────────────────────────────
const _std = (arr) => {
  if (!arr || arr.length < 2) return 0;
  const mean = arr.reduce((s, v) => s + v, 0) / arr.length;
  const variance = arr.reduce((s, v) => s + (v - mean) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
};

// ─── Yardımcı: değerleri history'den çek ────────────────────────────────────
const _vals = (history = []) => history.map((h) => Number(h.value)).filter((v) => !isNaN(v));

// ─── 1. Değer/Eşik Oranı Skoru (0–40) ───────────────────────────────────────
const _valueThresholdScore = (patient) => {
  const current = Number(patient.currentValue ?? patient.value ?? 0);
  const threshold = Number(patient.threshold ?? patient.normalMax ?? 100);
  if (threshold === 0) return 0;
  const ratio = current / threshold;
  // ratio >= 1 → tam puan, ratio < 1 → orantılı
  const raw = Math.min(ratio, 1.5) * 40; // 1.5x eşiği → skor doyumu
  return Math.min(Math.max(raw, 0), 40);
};

// ─── 2. Trend Skoru (0–30) ──────────────────────────────────────────────────
// Son 3 ölçümün yönü: sürekli artış → yüksek risk
const _trendScore = (history = []) => {
  const vals = _vals(history);
  if (vals.length < 2) return 15; // yetersiz veri → orta risk varsayımı
  const recent = vals.slice(-3);
  let risingCount = 0;
  for (let i = 1; i < recent.length; i++) {
    if (recent[i] > recent[i - 1]) risingCount++;
  }
  // 0 artış → 0 puan | 1 artış → 15 | 2 artış → 30
  return (risingCount / Math.max(recent.length - 1, 1)) * 30;
};

// ─── 3. Uyum Skoru (0–20) ───────────────────────────────────────────────────
// Eksik ölçüm = yüksek risk; history.length/7 → tersine çevir
const _complianceScore = (history = []) => {
  const measured = Math.min(history.length, 7);
  const compliance = measured / 7; // 0..1
  // compliance yüksek → risk düşük → skor düşük
  return (1 - compliance) * 20;
};

// ─── 4. Biyometrik Volatilite Skoru (0–10) ──────────────────────────────────
const _volatilityScore = (history = []) => {
  const vals = _vals(history);
  if (vals.length < 2) return 0;
  const sd = _std(vals.slice(-5)); // son 5 ölçüm
  const mean = vals.slice(-5).reduce((s, v) => s + v, 0) / vals.slice(-5).length;
  const cv = mean !== 0 ? sd / Math.abs(mean) : 0; // coefficient of variation
  return Math.min(cv * 50, 10); // CV > 0.20 → tam puan
};

// ─── Risk seviyesi belirle ───────────────────────────────────────────────────
const _getLevel = (score) => {
  if (score <= 25) return { level: 'low', label: 'Düşük Risk' };
  if (score <= 50) return { level: 'medium', label: 'Orta Risk' };
  if (score <= 75) return { level: 'high', label: 'Yüksek Risk' };
  return { level: 'critical', label: 'Kritik Risk' };
};

// ─── Faktör açıklamaları ─────────────────────────────────────────────────────
const _buildFactors = ({ vtScore, trendScore, compScore, volScore, patient }) => {
  const factors = [];
  const threshold = Number(patient.threshold ?? patient.normalMax ?? 100);
  const current = Number(patient.currentValue ?? patient.value ?? 0);

  if (vtScore >= 30)
    factors.push(
      `Mevcut değer (${current}) eşik değerinin (${threshold}) %${Math.round((current / threshold) * 100)}'ine ulaştı`
    );
  else if (vtScore >= 20)
    factors.push(`Mevcut değer eşik değerine yaklaşıyor (${Math.round((current / threshold) * 100)}%)`);

  if (trendScore >= 20)
    factors.push('Son ölçümlerde sürekli yükseliş trendi tespit edildi');
  else if (trendScore >= 10)
    factors.push('Ölçüm değerleri karışık trend gösteriyor');

  if (compScore >= 14)
    factors.push('Haftalık ölçüm uyumu düşük: düzenli takip yapılmıyor');
  else if (compScore >= 8)
    factors.push('Haftalık ölçüm uyumu orta seviyede');

  if (volScore >= 7)
    factors.push('Ölçümler arasındaki volatilite kritik seviyede yüksek');
  else if (volScore >= 4)
    factors.push('Biyometrik değerlerde belirgin dalgalanma gözlemlendi');

  if (factors.length === 0)
    factors.push('Tüm parametreler normal sınırlar içinde seyrediyor');

  return factors;
};

// ─── 7 Günlük Tahmin ─────────────────────────────────────────────────────────
/**
 * @param {Object} patient
 * @returns {Array<{date: string, predictedValue: number, riskLevel: string}>}
 */
export const get7DayForecast = (patient) => {
  const history = patient.history ?? [];
  const vals = _vals(history);
  const base = vals.length > 0 ? vals[vals.length - 1] : Number(patient.currentValue ?? 50);
  const threshold = Number(patient.threshold ?? patient.normalMax ?? 100);

  // Trend: son ölçümlerden basit lineer eğim
  let slope = 0;
  if (vals.length >= 2) {
    const n = Math.min(vals.length, 5);
    const recent = vals.slice(-n);
    slope = (recent[recent.length - 1] - recent[0]) / (n - 1);
  }

  const forecast = [];
  for (let i = 1; i <= 7; i++) {
    // Gaussian benzeri gürültü (Box-Muller'dan basitleştirilmiş)
    const noise = (Math.random() - 0.5) * _std(vals) * 1.2 || (Math.random() - 0.5) * base * 0.05;
    const predicted = Math.max(0, base + slope * i + noise);
    const ratio = predicted / threshold;
    let riskLevel;
    if (ratio < 0.6) riskLevel = 'low';
    else if (ratio < 0.8) riskLevel = 'medium';
    else if (ratio < 1.0) riskLevel = 'high';
    else riskLevel = 'critical';

    forecast.push({
      date: `D+${i}`,
      predictedValue: Math.round(predicted * 10) / 10,
      riskLevel,
    });
  }
  return forecast;
};

// ─── Ana Fonksiyon ───────────────────────────────────────────────────────────
/**
 * @param {Object} patient
 * @returns {{ score: number, level: string, label: string, factors: string[], forecast: Array }}
 */
export const calculateRiskScore = (patient) => {
  if (!patient) return { score: 0, level: 'low', label: 'Düşük Risk', factors: [], forecast: [] };

  const history = patient.history ?? [];

  const vtScore = _valueThresholdScore(patient);
  const trendScore = _trendScore(history);
  const compScore = _complianceScore(history);
  const volScore = _volatilityScore(history);

  const rawScore = vtScore + trendScore + compScore + volScore;
  const score = Math.min(Math.max(Math.round(rawScore), 0), 100);

  const { level, label } = _getLevel(score);

  const factors = _buildFactors({ vtScore, trendScore, compScore, volScore, patient });

  const forecast = get7DayForecast(patient);

  return { score, level, label, factors, forecast };
};

// ─── Renk Yardımcısı ─────────────────────────────────────────────────────────
/**
 * @param {'low'|'medium'|'high'|'critical'} level
 * @returns {string} CSS renk değeri
 */
export const getRiskColor = (level) => {
  const colors = {
    low: '#22c55e',       // yeşil
    medium: '#f59e0b',    // amber
    high: '#f97316',      // turuncu
    critical: '#ef4444',  // kırmızı
  };
  return colors[level] ?? '#6b7280';
};
