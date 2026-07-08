import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, Users, Clock, CheckSquare, Calendar, AlertTriangle, BarChart2, Award } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend,
  RadialBarChart, RadialBar,
} from 'recharts';

// ── Sparkline için küçük alan grafiği ──
const Sparkline = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={50}>
    <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.4} />
          <stop offset="95%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2}
        fill={`url(#sg-${color.replace('#', '')})`} dot={false} />
    </AreaChart>
  </ResponsiveContainer>
);

// ── KPI Kartı ──
const KPICard = ({ icon, label, value, unit, trend, trendVal, color, sparkData, sparkColor, sublabel }) => {
  const TIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'var(--danger)' : trend === 'down' ? 'var(--success)' : 'var(--warning)';
  return (
    <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '10px', background: `${color}22`, borderRadius: '10px', color }}>{icon}</div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
            {sublabel && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', opacity: 0.7 }}>{sublabel}</div>}
          </div>
        </div>
        {trendVal != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: trendColor, fontSize: '0.8rem', fontWeight: 600 }}>
            <TIcon size={14} /> {trendVal > 0 ? '+' : ''}{trendVal}%
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{ fontSize: '2.4rem', fontWeight: 700, color }}>{value}</span>
        {unit && <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{unit}</span>}
      </div>
      {sparkData && <Sparkline data={sparkData} color={sparkColor || color} />}
    </div>
  );
};

const COLORS = ['var(--primary)', 'var(--success)', 'var(--warning)', 'var(--danger)', '#a78bfa'];

// ── Gerçekçi sözde-veri üretimi ──
const generateWeekData = (base, variance) =>
  ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => ({
    day,
    v: Math.max(0, Math.round(base + (Math.random() - 0.5) * variance * 2)),
  }));

const KPIDashboard = ({ patients }) => {
  const [period, setPeriod] = useState('week');
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => { setAnimKey(k => k + 1); }, [period]);

  const totalPatients = patients.length;
  const riskCount = patients.filter(p => p.status === 'danger').length;
  const safeCount = totalPatients - riskCount;
  const avgHealth = totalPatients > 0
    ? Math.round(patients.reduce((a, p) => a + p.healthScore, 0) / totalPatients) : 0;

  const avgCompliance = totalPatients > 0
    ? Math.round(patients.reduce((a, p) => {
        const c = Math.min(100, Math.round((p.history?.length || 0) / 7 * 100));
        return a + c;
      }, 0) / totalPatients) : 0;

  // KPI values
  const responseTime = 4.2; // dakika
  const protocolCompletion = 73;
  const appointmentFill = 68;
  const doctorRatio = totalPatients > 0 ? (totalPatients / 1).toFixed(1) : '0';

  // Sparkline verileri
  const complianceSpark = generateWeekData(avgCompliance, 12);
  const healthSpark = generateWeekData(avgHealth, 8);
  const responseSpark = generateWeekData(responseTime, 1.5).map(d => ({ ...d, v: parseFloat(d.v.toFixed(1)) }));
  const appointmentSpark = generateWeekData(appointmentFill, 15);

  // Risk dağılımı (pie)
  const riskPieData = [
    { name: 'Stabil', value: safeCount || 1 },
    { name: 'Riskli', value: riskCount || 0 },
  ];

  // Hastalık dağılımı
  const diseaseMap = {};
  patients.forEach(p => { diseaseMap[p.disease] = (diseaseMap[p.disease] || 0) + 1; });
  const diseasePieData = Object.entries(diseaseMap).map(([name, value]) => ({ name, value }));

  // Haftalık trend (area chart)
  const weeklyTrend = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, i) => ({
    day,
    'Uyum Oranı': Math.round(avgCompliance + (Math.sin(i) * 10)),
    'Sağlık Skoru': Math.round(avgHealth + (Math.cos(i) * 6)),
  }));

  // Radial (gauge) verisi
  const radialData = [
    { name: 'Uyum',     value: avgCompliance, fill: 'var(--primary)' },
    { name: 'Sağlık',   value: avgHealth,     fill: 'var(--success)' },
    { name: 'Protokol', value: protocolCompletion, fill: 'var(--warning)' },
    { name: 'Doluluk',  value: appointmentFill,    fill: '#a78bfa' },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) return (
      <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '10px 14px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></div>
        ))}
      </div>
    );
    return null;
  };

  return (
    <div className="animate-fade-in" key={animKey} style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <BarChart2 size={32} color="var(--primary)" /> Klinik KPI Panosu
          </h1>
          <p className="text-muted">Hastane geneli performans göstergeleri ve trend analizleri.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[['week', 'Bu Hafta'], ['month', 'Bu Ay'], ['quarter', '3 Ay']].map(([k, l]) => (
            <button key={k} className={`glass-button ${period === k ? 'primary' : ''}`}
              onClick={() => setPeriod(k)} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Kartları ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '28px' }}>
        <KPICard
          icon={<Users size={22} />} label="Toplam Hasta" value={totalPatients} unit="kişi"
          trend="up" trendVal={12} color="var(--primary)"
          sparkData={generateWeekData(totalPatients, 0.5)} sparkColor="var(--primary)"
        />
        <KPICard
          icon={<Activity size={22} />} label="Uyum Oranı" value={`${avgCompliance}`} unit="%"
          trend={avgCompliance >= 70 ? 'down' : 'up'} trendVal={-3}
          color={avgCompliance >= 70 ? 'var(--success)' : 'var(--warning)'}
          sparkData={complianceSpark} sublabel="Son 7 günlük ortalama"
        />
        <KPICard
          icon={<Clock size={22} />} label="Alarm Yanıt Süresi" value={responseTime} unit="dk"
          trend="down" trendVal={-8} color="var(--success)"
          sparkData={responseSpark} sparkColor="var(--success)"
          sublabel="Ortalama yanıt"
        />
        <KPICard
          icon={<AlertTriangle size={22} />} label="Riskli Hasta" value={riskCount} unit="kişi"
          trend={riskCount > 0 ? 'up' : null} trendVal={riskCount > 0 ? 25 : null}
          color={riskCount > 0 ? 'var(--danger)' : 'var(--success)'}
          sparkData={generateWeekData(riskCount, 1)}
          sparkColor={riskCount > 0 ? 'var(--danger)' : 'var(--success)'}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '36px' }}>
        <KPICard
          icon={<Award size={22} />} label="Ort. Sağlık Skoru" value={avgHealth} unit="/100"
          trend={avgHealth >= 70 ? 'down' : 'up'} trendVal={5}
          color={avgHealth >= 80 ? 'var(--success)' : avgHealth >= 50 ? 'var(--warning)' : 'var(--danger)'}
          sparkData={healthSpark}
        />
        <KPICard
          icon={<CheckSquare size={22} />} label="Protokol Tamamlama" value={`${protocolCompletion}`} unit="%"
          trend="up" trendVal={7} color="var(--primary)"
          sparkData={generateWeekData(protocolCompletion, 8)}
        />
        <KPICard
          icon={<Calendar size={22} />} label="Randevu Doluluk" value={`${appointmentFill}`} unit="%"
          trend="up" trendVal={3} color="#a78bfa"
          sparkData={appointmentSpark} sparkColor="#a78bfa"
        />
        <KPICard
          icon={<Users size={22} />} label="Hasta / Doktor" value={doctorRatio} unit="oran"
          trend="up" trendVal={2} color="var(--warning)"
          sparkData={generateWeekData(parseFloat(doctorRatio), 0.3)} sparkColor="var(--warning)"
          sublabel="Bu departman"
        />
      </div>

      {/* ── Grafikler ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Haftalık Trend */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--primary)" /> Haftalık Trend
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyTrend}>
              <defs>
                <linearGradient id="ga1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ga2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
              <XAxis dataKey="day" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="Uyum Oranı" stroke="var(--primary)" fill="url(#ga1)" strokeWidth={2} />
              <Area type="monotone" dataKey="Sağlık Skoru" stroke="var(--success)" fill="url(#ga2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Dağılımı */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="var(--warning)" /> Risk Dağılımı
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={riskPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  <Cell fill="var(--success)" />
                  <Cell fill="var(--danger)" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>✅ Stabil</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>{safeCount}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>%{totalPatients > 0 ? Math.round(safeCount / totalPatients * 100) : 0}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>🔴 Riskli</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>{riskCount}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>%{totalPatients > 0 ? Math.round(riskCount / totalPatients * 100) : 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Radial Gauge + Hastalık Dağılımı */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Radial Gauge */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="var(--primary)" /> Performans Göstergesi
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadialBarChart cx="50%" cy="50%" innerRadius={30} outerRadius={100} data={radialData} startAngle={180} endAngle={0}>
              <RadialBar minAngle={15} background clockWise dataKey="value" />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconSize={12} layout="vertical" align="right" wrapperStyle={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Hastalık Dağılımı */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--primary)" /> Hastalık Dağılımı
          </h3>
          {diseasePieData.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '60px' }}>Henüz hasta verisi yok.</div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={diseasePieData} cx="50%" cy="50%" outerRadius={75} paddingAngle={3} dataKey="value">
                    {diseasePieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {diseasePieData.map((d, i) => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', flex: 1 }}>{d.name}</span>
                    <strong style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>{d.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;
