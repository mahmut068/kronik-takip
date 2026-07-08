import React, { useState, useEffect, useRef } from 'react';
import { Activity, Heart, Thermometer, Wind, TrendingUp, TrendingDown, Minus, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

/* ─── EKG SVG animasyonu ─── */
const EKGWave = ({ isDanger }) => {
  const color = isDanger ? '#ef4444' : '#10b981';
  const speed = isDanger ? '1.2s' : '2.2s';

  return (
    <div style={{ width: '100%', height: '40px', overflow: 'hidden', position: 'relative', borderRadius: '0 0 10px 10px' }}>
      <style>{`
        @keyframes ekgScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse-card {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
        }
        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes trend-bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-3px); }
        }
      `}</style>
      <svg
        viewBox="0 0 400 40"
        width="800"
        height="40"
        style={{
          display: 'block',
          animation: `ekgScroll ${speed} linear infinite`,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Wave 1 */}
        <polyline
          points="0,20 30,20 40,20 50,5 55,35 60,5 65,20 80,20 95,20 100,18 105,22 110,20 130,20 140,20 150,5 155,35 160,5 165,20 180,20 195,20 200,18 205,22 210,20 230,20 240,20 250,5 255,35 260,5 265,20 280,20 295,20 300,18 305,22 310,20 330,20 340,20 350,5 355,35 360,5 365,20 380,20 395,20 400,20"
          fill="none"
          stroke={color}
          strokeWidth={isDanger ? 2 : 1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        {/* Wave 2 (offset) */}
        <polyline
          points="200,20 230,20 240,20 250,5 255,35 260,5 265,20 280,20 295,20 300,18 305,22 310,20 330,20 340,20 350,5 355,35 360,5 365,20 380,20 395,20 400,20 430,20 440,20 450,5 455,35 460,5 465,20 480,20 495,20 500,18 505,22 510,20 530,20 540,20 550,5 555,35 560,5 565,20 580,20 595,20 600,20"
          fill="none"
          stroke={color}
          strokeWidth={isDanger ? 2 : 1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        {/* Glow overlay */}
        <defs>
          <filter id={`glow-${isDanger ? 'danger' : 'safe'}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      {/* Gradient fade edges */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '30px', height: '100%',
        background: 'linear-gradient(to right, rgba(10,15,28,0.95), transparent)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '30px', height: '100%',
        background: 'linear-gradient(to left, rgba(10,15,28,0.95), transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  );
};

/* ─── Vital kutusu ─── */
const VitalBox = ({ icon, label, value, unit, color, trend }) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  return (
    <div style={{
      background: `${color}12`,
      border: `1px solid ${color}40`,
      borderRadius: '10px',
      padding: '10px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      flex: 1,
      minWidth: '90px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color, fontSize: '0.72rem', fontWeight: 600, opacity: 0.85 }}>
        {icon}
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color, letterSpacing: '-0.5px' }}>{value}</span>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>{unit}</span>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '3px',
        color: trend === 'up' ? '#f59e0b' : trend === 'down' ? '#3b82f6' : 'var(--text-muted)',
        fontSize: '0.68rem',
        animation: 'trend-bounce 1.8s ease-in-out infinite',
      }}>
        <TrendIcon size={11} />
        <span>{trend === 'up' ? 'Yükseliyor' : trend === 'down' ? 'Düşüyor' : 'Stabil'}</span>
      </div>
    </div>
  );
};

/* ─── Vital başlangıç değerleri ─── */
const initVitals = (isDanger) => ({
  hr:   isDanger ? 115 + Math.floor(Math.random() * 10) : 68  + Math.floor(Math.random() * 12),
  spo2: isDanger ? 93  + Math.floor(Math.random() * 3)  : 96  + Math.floor(Math.random() * 3),
  temp: isDanger ? 37.8 + Math.random() * 0.5           : 36.4 + Math.random() * 0.6,
  bpS:  isDanger ? 145 + Math.floor(Math.random() * 20) : 112 + Math.floor(Math.random() * 15),
  bpD:  isDanger ? 95  + Math.floor(Math.random() * 10) : 72  + Math.floor(Math.random() * 10),
});

/* ─── Küçük varyasyon ─── */
const vary = (val, min, max, delta) => {
  const next = val + (Math.random() * delta * 2 - delta);
  return Math.min(max, Math.max(min, Math.round(next * 10) / 10));
};

/* ─── Ana bileşen ─── */
export default function LiveMonitor({ patients }) {
  /* Sadece ilk 9 hastayı göster (veya hepsini grid ile) */
  const displayPatients = (patients || []).slice(0, 9);

  /* Her hasta için vital state */
  const [vitalMap, setVitalMap] = useState(() => {
    const map = {};
    displayPatients.forEach(p => {
      map[p.id] = {
        ...initVitals(p.status === 'danger'),
        hrTrend: 'stable', spo2Trend: 'stable', tempTrend: 'stable', bpTrend: 'stable',
      };
    });
    return map;
  });

  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [tick, setTick] = useState(0);

  /* ─── 2 saniyelik interval ─── */
  useEffect(() => {
    const id = setInterval(() => {
      setVitalMap(prev => {
        const next = { ...prev };
        displayPatients.forEach(p => {
          const isDanger = p.status === 'danger';
          const old = prev[p.id] || initVitals(isDanger);
          const newHr   = vary(old.hr,   isDanger ? 95  : 55,  isDanger ? 140 : 105, isDanger ? 5 : 3);
          const newSpo2 = vary(old.spo2, isDanger ? 90  : 94,  99,                    2);
          const newTemp = vary(old.temp, isDanger ? 37.5: 36.1, isDanger ? 39.5: 38.0, 0.2);
          const newBpS  = vary(old.bpS,  isDanger ? 135 : 105, isDanger ? 175 : 140,  4);
          const newBpD  = vary(old.bpD,  isDanger ? 88  : 65,  isDanger ? 115 : 90,   3);

          next[p.id] = {
            hr: newHr,    hrTrend:   newHr   > old.hr   ? 'up' : newHr   < old.hr   ? 'down' : 'stable',
            spo2: newSpo2, spo2Trend: newSpo2 > old.spo2 ? 'up' : newSpo2 < old.spo2 ? 'down' : 'stable',
            temp: newTemp, tempTrend: newTemp > old.temp ? 'up' : newTemp < old.temp ? 'down' : 'stable',
            bpS: newBpS, bpD: newBpD,
            bpTrend: newBpS > old.bpS ? 'up' : newBpS < old.bpS ? 'down' : 'stable',
          };
        });
        return next;
      });
      setLastUpdate(new Date());
      setTick(t => t + 1);
    }, 2000);
    return () => clearInterval(id);
  }, [displayPatients.length]);

  const totalCount    = displayPatients.length;
  const criticalCount = displayPatients.filter(p => p.status === 'danger').length;
  const normalCount   = totalCount - criticalCount;

  return (
    <div style={{ padding: '28px', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>

      {/* ─── Başlık ─── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            padding: '10px', borderRadius: '14px',
            boxShadow: '0 0 22px rgba(239,68,68,0.45)',
          }}>
            <Activity size={26} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px', margin: 0 }}>
              Canlı Vital İzleme
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Gerçek zamanlı hasta vital parametreleri
            </p>
          </div>
          {/* LIVE Badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.5)',
            borderRadius: '20px', padding: '4px 12px',
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444',
              animation: 'live-pulse 1.2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ef4444', letterSpacing: '1.5px' }}>LIVE</span>
          </div>
        </div>
        {/* Son güncelleme */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <Clock size={14} />
          Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
        </div>
      </div>

      {/* ─── Özet Bar ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {[
          { label: 'Toplam İzlenen', value: totalCount,    color: 'var(--primary)',   bg: 'rgba(0,229,255,0.08)',   icon: <Activity size={20} /> },
          { label: 'Kritik Hasta',   value: criticalCount, color: '#ef4444',           bg: 'rgba(239,68,68,0.08)',   icon: <AlertTriangle size={20} /> },
          { label: 'Normal Hasta',   value: normalCount,   color: '#10b981',           bg: 'rgba(16,185,129,0.08)', icon: <CheckCircle size={20} /> },
          { label: 'Son Güncelleme', value: `${tick * 2}s`, color: '#f59e0b',          bg: 'rgba(245,158,11,0.08)', icon: <Clock size={20} /> },
        ].map((s, i) => (
          <div key={i} className="glass-panel" style={{ padding: '16px 20px', background: s.bg, borderColor: `${s.color}30`, animation: 'fade-in-up 0.4s ease both', animationDelay: `${i * 0.07}s` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, letterSpacing: '-1px', lineHeight: 1 }}>{s.value}</div>
              </div>
              <div style={{ color: s.color, opacity: 0.7 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Hasta Vital Kartları ─── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '18px',
      }}>
        {displayPatients.map((patient, idx) => {
          const vitals  = vitalMap[patient.id] || initVitals(patient.status === 'danger');
          const isDanger = patient.status === 'danger';
          const statusColor = isDanger ? '#ef4444' : '#10b981';

          return (
            <div
              key={patient.id}
              className="glass-panel"
              style={{
                padding: 0,
                overflow: 'hidden',
                border: isDanger ? '1px solid rgba(239,68,68,0.6)' : '1px solid var(--glass-border)',
                animation: `fade-in-up 0.5s ease both`,
                animationDelay: `${idx * 0.05}s`,
                boxShadow: isDanger
                  ? '0 0 0 0 rgba(239,68,68,0.4), 0 8px 32px rgba(0,0,0,0.37)'
                  : '0 8px 32px rgba(0,0,0,0.37)',
                ...(isDanger && { animation: `fade-in-up 0.5s ease both, pulse-card 2s ease-in-out infinite`, animationDelay: `${idx * 0.05}s` }),
              }}
            >
              {/* Hasta Header */}
              <div style={{
                padding: '14px 16px',
                borderBottom: `1px solid ${isDanger ? 'rgba(239,68,68,0.2)' : 'var(--glass-border)'}`,
                background: isDanger ? 'rgba(239,68,68,0.06)' : 'rgba(0,229,255,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{patient.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{patient.disease}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={{
                    padding: '3px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700,
                    background: isDanger ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
                    color: statusColor, border: `1px solid ${statusColor}50`,
                    letterSpacing: '0.5px',
                  }}>
                    {isDanger ? '⚠ KRİTİK' : '✓ NORMAL'}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={10} />
                    {lastUpdate.toLocaleTimeString('tr-TR')}
                  </div>
                </div>
              </div>

              {/* Vital değerler */}
              <div style={{ padding: '14px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <VitalBox
                  icon={<Heart size={11} />}
                  label="Nabız"
                  value={Math.round(vitals.hr)}
                  unit="bpm"
                  color={vitals.hr > 100 ? '#ef4444' : vitals.hr < 60 ? '#f59e0b' : '#10b981'}
                  trend={vitals.hrTrend}
                />
                <VitalBox
                  icon={<Activity size={11} />}
                  label="Tansiyon"
                  value={`${Math.round(vitals.bpS)}/${Math.round(vitals.bpD)}`}
                  unit="mmHg"
                  color={vitals.bpS > 140 ? '#ef4444' : vitals.bpS < 100 ? '#f59e0b' : '#3b82f6'}
                  trend={vitals.bpTrend}
                />
                <VitalBox
                  icon={<Wind size={11} />}
                  label="SpO₂"
                  value={`${Math.round(vitals.spo2)}%`}
                  unit=""
                  color={vitals.spo2 < 93 ? '#ef4444' : vitals.spo2 < 95 ? '#f59e0b' : '#10b981'}
                  trend={vitals.spo2Trend}
                />
                <VitalBox
                  icon={<Thermometer size={11} />}
                  label="Sıcaklık"
                  value={vitals.temp.toFixed(1)}
                  unit="°C"
                  color={vitals.temp > 38.0 ? '#ef4444' : vitals.temp > 37.5 ? '#f59e0b' : '#10b981'}
                  trend={vitals.tempTrend}
                />
              </div>

              {/* EKG Dalgası */}
              <EKGWave isDanger={isDanger} />
            </div>
          );
        })}
      </div>

      {/* Boş state */}
      {displayPatients.length === 0 && (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Activity size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
          <p style={{ fontSize: '1.1rem' }}>İzlenecek hasta bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
