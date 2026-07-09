'use client';

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const MONTHLY_DATA = [
  { ay: 'Oca', yanıt: 312, alarm: 18, sms: 298 },
  { ay: 'Şub', yanıt: 289, alarm: 14, sms: 276 },
  { ay: 'Mar', yanıt: 401, alarm: 22, sms: 385 },
  { ay: 'Nis', yanıt: 378, alarm: 19, sms: 362 },
  { ay: 'May', yanıt: 445, alarm: 11, sms: 430 },
  { ay: 'Haz', yanıt: 512, alarm: 8,  sms: 498 },
  { ay: 'Tem', yanıt: 247, alarm: 3,  sms: 241 },
];

const TOOLTIP_STYLE = { background: 'rgba(8,14,26,0.97)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#e2f0f9', fontSize: '12px' };

const CustomTooltip = ({ active, payload, label }: any) => {
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

interface Props {
  diseaseStats?: { disease: string; count: number }[];
}

export default function DashboardCharts({ diseaseStats }: Props) {
  const DISEASE_COLORS: Record<string, string> = {
    'Hipertansiyon':            '#00e5ff',
    'Tip 2 Diyabet':            '#10b981',
    'Kalp Yetmezliği':         '#f59e0b',
    'KOAH':                     '#a78bfa',
    'Astım':                    '#3b82f6',
    'Kronik Böbrek Hastalığı':  '#f43f5e',
    'Epilepsi':                 '#ec4899',
    'Parkinson':                '#8b5cf6',
  };

  const pieData = diseaseStats?.length
    ? diseaseStats.map(d => ({ name: d.disease, value: d.count, color: DISEASE_COLORS[d.disease] || '#4d6b82' }))
    : [
        { name: 'Hipertansiyon', value: 42, color: '#00e5ff' },
        { name: 'Tip 2 Diyabet', value: 31, color: '#10b981' },
        { name: 'Kalp Yet.',     value: 16, color: '#f59e0b' },
        { name: 'KOAH',          value: 7,  color: '#a78bfa' },
        { name: 'Diğer',         value: 4,  color: '#4d6b82' },
      ];

  return (
    <>
      {/* Area Chart */}
      <div className="card animate-in delay-3" style={{ padding: '22px' }}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#e2f0f9' }}>Aylık Yanıt Trendi</div>
          <div style={{ fontSize: '12px', color: '#4d6b82', marginTop: '2px' }}>SMS ve sesli arama yanıtları</div>
        </div>
        <div style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="gY" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00e5ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="ay" stroke="#4d6b82" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#4d6b82" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="yanıt" name="Yanıt" stroke="#00e5ff" strokeWidth={2.5} fill="url(#gY)" dot={false} activeDot={{ r: 4, fill: '#00e5ff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card animate-in delay-4" style={{ padding: '22px' }}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#e2f0f9' }}>Aylık Alarm Sayısı</div>
          <div style={{ fontSize: '12px', color: '#4d6b82', marginTop: '2px' }}>Kritik eşik aşılma olayları</div>
        </div>
        <div style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="ay" stroke="#4d6b82" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#4d6b82" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="alarm" name="Alarm" fill="rgba(244,63,94,0.6)" radius={[5,5,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="card animate-in delay-5" style={{ padding: '22px' }}>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#e2f0f9' }}>Hastalık Dağılımı</div>
          <div style={{ fontSize: '12px', color: '#4d6b82', marginTop: '2px' }}>Tanıya göre hasta oranı</div>
        </div>
        <div style={{ height: '140px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={64} paddingAngle={3} dataKey="value">
                {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [v, '']} contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '8px' }}>
          {pieData.map(d => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '2px', background: d.color }} />
                <span style={{ fontSize: '11px', color: '#8aafc7' }}>{d.name}</span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#e2f0f9' }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
