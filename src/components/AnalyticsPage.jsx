import React, { useState } from 'react';
import { BarChart2, TrendingUp, Award, TrendingDown, Minus, Brain } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, ReferenceLine
} from 'recharts';

const COLORS = ['#00e5ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

// Lineer regresyon ile tahmin
const linearForecast = (history, days = 3) => {
  if (history.length < 2) return [];
  const n = history.length;
  const xs = history.map((_, i) => i);
  const ys = history.map(h => h.value);
  const xMean = xs.reduce((a, b) => a + b, 0) / n;
  const yMean = ys.reduce((a, b) => a + b, 0) / n;
  const slope = xs.reduce((acc, x, i) => acc + (x - xMean) * (ys[i] - yMean), 0) /
                xs.reduce((acc, x) => acc + (x - xMean) ** 2, 0);
  const intercept = yMean - slope * xMean;
  return Array.from({ length: days }, (_, i) => ({
    date: `+${i + 1}g`,
    forecast: Math.round(intercept + slope * (n + i)),
    isForecast: true,
  }));
};

const getTrend = (history) => {
  if (history.length < 2) return 'stable';
  const last = history[history.length - 1].value;
  const prev = history[history.length - 2].value;
  const diff = last - prev;
  if (diff > 5) return 'up';
  if (diff < -5) return 'down';
  return 'stable';
};

const AnalyticsPage = ({ patients }) => {
  const datesSet = new Set();
  patients.forEach(p => p.history.forEach(h => datesSet.add(h.date)));
  const dates = Array.from(datesSet).sort();

  const trendData = dates.map(date => {
    const entry = { date };
    patients.forEach(p => {
      const match = p.history.find(h => h.date === date);
      entry[p.name.split(' ')[0]] = match ? match.value : null;
    });
    return entry;
  });

  const pieData = [
    { name: 'İyi (80-100)', value: patients.filter(p => p.healthScore >= 80).length },
    { name: 'Orta (50-79)', value: patients.filter(p => p.healthScore >= 50 && p.healthScore < 80).length },
    { name: 'Kötü (<50)',   value: patients.filter(p => p.healthScore < 50).length },
  ].filter(d => d.value > 0);

  const radarData = [
    { subject: 'Uyum',    ...Object.fromEntries(patients.map(p => [p.name.split(' ')[0], Math.round(p.healthScore * 0.9)])) },
    { subject: 'Risk',    ...Object.fromEntries(patients.map(p => [p.name.split(' ')[0], p.status === 'danger' ? 30 : 85])) },
    { subject: 'Stabil',  ...Object.fromEntries(patients.map(p => [p.name.split(' ')[0], Math.round(p.healthScore * 0.8 + 10)])) },
    { subject: 'Aktiflik',...Object.fromEntries(patients.map(p => [p.name.split(' ')[0], p.history.length * 15 + 40])) },
    { subject: 'Yanıt',   ...Object.fromEntries(patients.map(p => [p.name.split(' ')[0], Math.round(p.healthScore * 0.7 + 20)])) },
  ];

  const avgScore = patients.length > 0
    ? Math.round(patients.reduce((a, p) => a + p.healthScore, 0) / patients.length) : 0;

  // Tahminsel analitik için ilk hasta seçimi
  const [forecastPatientId, setForecastPatientId] = useState(patients[0]?.id || '');
  const fPatient = patients.find(p => p.id === parseInt(forecastPatientId)) || patients[0];
  const forecastPoints = fPatient ? linearForecast(fPatient.history) : [];
  const combinedForecast = fPatient
    ? [...fPatient.history.map(h => ({ date: h.date, actual: h.value })), ...forecastPoints.map(f => ({ date: f.date, forecast: f.forecast }))]
    : [];
  const trend = fPatient ? getTrend(fPatient.history) : 'stable';

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'var(--danger)' : trend === 'down' ? 'var(--success)' : 'var(--warning)';
  const trendLabel = trend === 'up' ? 'Kötüleşiyor' : trend === 'down' ? 'İyileşiyor' : 'Stabil';

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div className="mb-4">
        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <BarChart2 size={36} color="var(--primary)" /> Gelişmiş Analitik
        </h1>
        <p className="text-muted">Haftalık trendler, sağlık skoru dağılımı, karşılaştırmalı performans ve tahminsel model.</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <Award size={32} color="var(--primary)" style={{ marginBottom: '8px' }} />
          <p className="text-muted">Ortalama Sağlık Skoru</p>
          <h2 style={{ fontSize: '3rem', color: avgScore >= 70 ? 'var(--success)' : avgScore >= 50 ? 'var(--warning)' : 'var(--danger)' }}>{avgScore}</h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ 100</span>
        </div>
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <TrendingUp size={32} color="var(--success)" style={{ marginBottom: '8px' }} />
          <p className="text-muted">Aktif Hasta</p>
          <h2 style={{ fontSize: '3rem', color: 'var(--text-main)' }}>{patients.length}</h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>izleniyor</span>
        </div>
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <BarChart2 size={32} color="var(--warning)" style={{ marginBottom: '8px' }} />
          <p className="text-muted">Toplam Ölçüm</p>
          <h2 style={{ fontSize: '3rem', color: 'var(--text-main)' }}>
            {patients.reduce((acc, p) => acc + p.history.length, 0)}
          </h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>kayıt</span>
        </div>
      </div>

      {/* Area Chart */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px', height: '380px' }}>
        <h3 style={{ marginBottom: '20px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} color="var(--primary)" /> Haftalık Ölçüm Trendleri
        </h3>
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <defs>
                {patients.map((p, i) => (
                  <linearGradient key={p.id} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={COLORS[i % COLORS.length]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px' }} itemStyle={{ color: 'var(--text-main)' }} />
              <Legend />
              {patients.map((p, i) => (
                <Area key={p.id} type="monotone" dataKey={p.name.split(' ')[0]} stroke={COLORS[i % COLORS.length]} strokeWidth={2} fill={`url(#grad${i})`} connectNulls />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        ) : <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)' }}>Yeterli veri yok.</div>}
      </div>

      {/* ===== TAHMİNSEL ANALİTİK ===== */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px', borderColor: 'rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Brain size={22} color="#8b5cf6" />
            <span>AI Tahminsel Model</span>
            <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', background: 'rgba(139,92,246,0.2)', color: '#a78bfa', border: '1px solid #8b5cf666' }}>
              Lineer Regresyon
            </span>
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.5)', maxWidth: '240px' }}
              value={forecastPatientId} onChange={e => setForecastPatientId(e.target.value)}>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px',
              background: `${trendColor}22`, border: `1px solid ${trendColor}66`, color: trendColor }}>
              <TrendIcon size={18} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{trendLabel}</span>
            </div>
          </div>
        </div>
        {combinedForecast.length > 1 ? (
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combinedForecast} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px' }} itemStyle={{ color: 'var(--text-main)' }} />
                <Legend />
                {fPatient && <ReferenceLine y={fPatient.threshold} label="Risk Eşiği" stroke="var(--danger)" strokeDasharray="5 5" />}
                <Line type="monotone" dataKey="actual" name="Gerçek Ölçüm" stroke="#00e5ff" strokeWidth={2.5} dot={{ r: 5, fill: '#00e5ff' }} connectNulls />
                <Line type="monotone" dataKey="forecast" name="Tahmin (3 Gün)" stroke="#8b5cf6" strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 5, fill: '#8b5cf6', strokeDasharray: '' }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex-center" style={{ height: '200px', color: 'var(--text-muted)' }}>
            Tahmin için en az 2 ölçüm gereklidir.
          </div>
        )}
        <p style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          ⚠️ Bu tahmin simülasyon amaçlıdır. Klinik karar için doktor değerlendirmesi gerekir.
        </p>
      </div>

      {/* Pie + Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '28px', height: '380px' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>🩺 Sağlık Skoru Dağılımı</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={5} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={i === 0 ? 'var(--success)' : i === 1 ? 'var(--warning)' : 'var(--danger)'} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)' }}>Veri yok.</div>}
        </div>

        <div className="glass-panel" style={{ padding: '28px', height: '380px' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>🕸 Hasta Karşılaştırma Radarı</h3>
          <ResponsiveContainer width="100%" height="85%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--glass-border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              {patients.map((p, i) => (
                <Radar key={p.id} name={p.name.split(' ')[0]} dataKey={p.name.split(' ')[0]}
                  stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.15} strokeWidth={2} />
              ))}
              <Legend />
              <Tooltip contentStyle={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
