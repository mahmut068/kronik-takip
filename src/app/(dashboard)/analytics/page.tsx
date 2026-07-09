'use client';

import { useState } from 'react';
import {
  BarChart2, TrendingUp, Users, Activity, Filter,
  CheckCircle, AlertTriangle, ArrowUpRight, Download,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadarChart,
  Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

/* ── Demo data ── */
const MONTHLY = [
  { ay: 'Oca', yanıt: 312, alarm: 18, sms: 298, sesli: 14 },
  { ay: 'Şub', yanıt: 289, alarm: 14, sms: 276, sesli: 13 },
  { ay: 'Mar', yanıt: 401, alarm: 22, sms: 385, sesli: 16 },
  { ay: 'Nis', yanıt: 378, alarm: 19, sms: 362, sesli: 16 },
  { ay: 'May', yanıt: 445, alarm: 11, sms: 430, sesli: 15 },
  { ay: 'Haz', yanıt: 512, alarm: 8,  sms: 498, sesli: 14 },
  { ay: 'Tem', yanıt: 247, alarm: 3,  sms: 241, sesli: 6  },
];

const DISEASE = [
  { name: 'Hipertansiyon', value: 42, color: '#00e5ff', alarm: 12 },
  { name: 'Diyabet',       value: 31, color: '#10b981', alarm: 7  },
  { name: 'Kalp Yet.',     value: 16, color: '#f59e0b', alarm: 11 },
  { name: 'KOAH',          value: 7,  color: '#a78bfa', alarm: 4  },
  { name: 'Diğer',         value: 4,  color: '#4d6b82', alarm: 1  },
];

const RADAR_DATA = [
  { subject: 'Yanıt Oranı',    A: 94 },
  { subject: 'Alarm Çözüm',    A: 87 },
  { subject: 'SMS Başarısı',   A: 98 },
  { subject: 'Hasta Uyumu',    A: 79 },
  { subject: 'Erken Uyarı',    A: 83 },
  { subject: 'Veri Kalitesi',  A: 91 },
];

const WEEKLY = [
  { gun: 'Pzt', yanıt: 48, alarm: 3 },
  { gun: 'Sal', yanıt: 52, alarm: 1 },
  { gun: 'Çar', yanıt: 61, alarm: 2 },
  { gun: 'Per', yanıt: 55, alarm: 4 },
  { gun: 'Cum', yanıt: 70, alarm: 0 },
  { gun: 'Cmt', yanıt: 32, alarm: 1 },
  { gun: 'Paz', yanıt: 27, alarm: 0 },
];

const CUSTOM_TOOLTIP = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(8,14,26,0.97)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px' }}>
      <div style={{ color: '#8aafc7', fontSize: '11px', marginBottom: '6px' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', marginBottom: '2px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: p.color }} />
          <span style={{ color: '#8aafc7' }}>{p.name}:</span>
          <span style={{ color: '#e2f0f9', fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const RANGES = ['Bu Hafta', 'Bu Ay', 'Son 3 Ay', '2026 Yılı'];

export default function AnalyticsPage() {
  const [range, setRange] = useState('Bu Ay');

  return (
    <div>
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#e2f0f9', letterSpacing: '-0.3px', marginBottom: '4px' }}>Analitik</h1>
          <p style={{ fontSize: '13px', color: '#4d6b82' }}>Sistem performansı ve hasta istatistikleri</p>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)} className="btn btn-sm"
              style={{ background: range === r ? 'rgba(0,229,255,0.12)' : 'rgba(255,255,255,0.04)', color: range === r ? '#00e5ff' : '#8aafc7', border: `1px solid ${range === r ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Toplam Yanıt',    val: '2.584', delta: '+18%', up: true,  color: '#00e5ff', dim: 'rgba(0,229,255,0.08)',   icon: Activity     },
          { label: 'Çözülen Alarm',   val: '87',    delta: '-31%', up: true,  color: '#10b981', dim: 'rgba(16,185,129,0.08)', icon: CheckCircle  },
          { label: 'SMS Gönderim',    val: '2.490', delta: '+14%', up: true,  color: '#a78bfa', dim: 'rgba(167,139,250,0.08)',icon: BarChart2    },
          { label: 'Ortalama Yanıt',  val: '94%',   delta: '+3%',  up: true,  color: '#f59e0b', dim: 'rgba(245,158,11,0.08)', icon: TrendingUp   },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="card animate-in stat-card" style={{ animationDelay: `${i * 0.05}s`, padding: '18px 20px', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: k.dim, border: `1px solid ${k.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color={k.color} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e2f0f9', lineHeight: 1, letterSpacing: '-0.3px' }}>{k.val}</div>
                <div style={{ fontSize: '11px', color: '#4d6b82', marginTop: '4px' }}>{k.label}</div>
                <div style={{ fontSize: '11px', color: k.up ? '#10b981' : '#f43f5e', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <TrendingUp size={10} />{k.delta} geçen döneme göre
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Area */}
        <div className="card animate-in delay-2" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#e2f0f9' }}>Aylık Yanıt & Alarm Trendi</div>
              <div style={{ fontSize: '12px', color: '#4d6b82', marginTop: '2px' }}>Ocak — Temmuz 2026</div>
            </div>
            <div className="badge badge-primary"><TrendingUp size={11} />+18%</div>
          </div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="aYanıt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00e5ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="aAlarm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="ay" stroke="#4d6b82" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#4d6b82" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CUSTOM_TOOLTIP />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#8aafc7' }} />
                <Area type="monotone" dataKey="yanıt" name="Yanıt" stroke="#00e5ff" strokeWidth={2.5} fill="url(#aYanıt)" dot={false} />
                <Area type="monotone" dataKey="alarm" name="Alarm" stroke="#f43f5e" strokeWidth={2} fill="url(#aAlarm)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie */}
        <div className="card animate-in delay-3" style={{ padding: '22px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#e2f0f9', marginBottom: '6px' }}>Hastalık Dağılımı</div>
          <div style={{ fontSize: '12px', color: '#4d6b82', marginBottom: '14px' }}>Tanıya göre hasta oranı</div>
          <div style={{ height: '160px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={DISEASE} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                  {DISEASE.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [`${v}%`, '']} contentStyle={{ background: 'rgba(8,14,26,0.97)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2f0f9', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {DISEASE.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: d.color }} />
                  <span style={{ fontSize: '12px', color: '#8aafc7' }}>{d.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#f43f5e' }}>{d.alarm} alarm</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#e2f0f9' }}>{d.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Weekly bar */}
        <div className="card animate-in delay-4" style={{ padding: '22px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#e2f0f9', marginBottom: '4px' }}>Haftalık Yanıt Dağılımı</div>
          <div style={{ fontSize: '12px', color: '#4d6b82', marginBottom: '16px' }}>Güne göre aktivite yoğunluğu</div>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="gun" stroke="#4d6b82" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#4d6b82" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CUSTOM_TOOLTIP />} />
                <Bar dataKey="yanıt" name="Yanıt" fill="rgba(0,229,255,0.6)" radius={[5,5,0,0]} />
                <Bar dataKey="alarm" name="Alarm" fill="rgba(244,63,94,0.6)" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar */}
        <div className="card animate-in delay-5" style={{ padding: '22px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#e2f0f9', marginBottom: '4px' }}>Sistem Performans Skoru</div>
          <div style={{ fontSize: '12px', color: '#4d6b82', marginBottom: '8px' }}>Bakanlık KPI kriterlerine göre değerlendirme</div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="rgba(255,255,255,0.07)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#8aafc7', fontSize: 11 }} />
                <Radar name="Puan" dataKey="A" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={{ background: 'rgba(8,14,26,0.97)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2f0f9', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
