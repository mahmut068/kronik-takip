'use client';

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart2, TrendingUp, Users, HeartPulse, Activity, BrainCircuit } from 'lucide-react';

const BAR_DATA = [
  { name: 'Ocak', SMS: 85, Arama: 65, Uyum: 75 },
  { name: 'Şubat', SMS: 88, Arama: 68, Uyum: 78 },
  { name: 'Mart', SMS: 92, Arama: 75, Uyum: 82 },
  { name: 'Nisan', SMS: 90, Arama: 78, Uyum: 85 },
  { name: 'Mayıs', SMS: 95, Arama: 82, Uyum: 89 },
  { name: 'Haziran', SMS: 96, Arama: 85, Uyum: 92 },
  { name: 'Temmuz', SMS: 98, Arama: 88, Uyum: 95 },
];

const PIE_DATA = [
  { name: 'Hipertansiyon', value: 450, color: '#0ea5e9' },
  { name: 'Diyabet (Tip 2)', value: 380, color: '#10b981' },
  { name: 'Kalp Yetmezliği', value: 210, color: '#f59e0b' },
  { name: 'KOAH', value: 160, color: '#8b5cf6' },
  { name: 'Diğer', value: 47, color: '#e11d48' },
];

const CUSTOM_TOOLTIP = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
      <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px', fontWeight: 700 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', fontSize: '14px', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color }} />
            <span style={{ color: '#475569', fontWeight: 500 }}>{p.name}</span>
          </div>
          <span style={{ fontWeight: 800, color: '#0f172a' }}>{p.name === 'Uyum' ? p.value + '%' : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  return (
    <div className="animate-in" style={{ paddingBottom: '60px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* ── Header ── */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.5px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart2 size={24} color="#2563eb" />
          </div>
          Klinik Analitik & Raporlar
        </h1>
        <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', fontWeight: 500 }}>
          Sistemdeki hastaların etkileşim analizleri, demografik dağılımları ve genel uyum trendleri.
        </p>
      </div>

      {/* ── Mini KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { icon: Users, label: 'Kayıtlı Hasta', val: '1,247', change: '+12%', color: '#2563eb', bg: '#eff6ff' },
          { icon: Activity, label: 'Ortalama Uyum', val: '%86', change: '+4.2%', color: '#10b981', bg: '#ecfdf5' },
          { icon: HeartPulse, label: 'Önlenen Kriz', val: '142', change: '+18%', color: '#f59e0b', bg: '#fffbeb' },
          { icon: BrainCircuit, label: 'YZ Etkileşimi', val: '8.4K', change: '+24%', color: '#8b5cf6', bg: '#f5f3ff' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="card animate-in" style={{ padding: '24px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', animationDelay: `${i * 0.05}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={item.color} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '4px 10px', borderRadius: '20px' }}>
                  {item.change}
                </div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', lineHeight: 1 }}>{item.val}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px', fontWeight: 600 }}>{item.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* ── Main Chart: Trend ── */}
        <div className="card" style={{ padding: '28px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>Sistem Etkileşim Trendleri</h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontWeight: 500 }}>Aylık SMS, Sesli Arama ve Tedavi Uyum Oranları</p>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>Dışa Aktar</button>
          </div>
          
          <div style={{ height: '340px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BAR_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CUSTOM_TOOLTIP />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 500, color: '#475569' }} />
                <Bar dataKey="SMS" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Arama" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Uyum" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Right Panel: Distribution ── */}
        <div className="card" style={{ padding: '28px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>Hastalık Dağılımı</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px 0', fontWeight: 500 }}>Aktif hasta havuzu tanıları</p>
          
          <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
                  {PIE_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CUSTOM_TOOLTIP />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px', flex: 1, overflowY: 'auto' }}>
            {PIE_DATA.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: d.color }} />
                  <span style={{ color: '#475569', fontSize: '13px', fontWeight: 600 }}>{d.name}</span>
                </div>
                <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
