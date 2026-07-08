'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  Users, AlertTriangle, MessageSquare, Activity,
  CheckCircle, TrendingUp, TrendingDown, Heart, Zap, ArrowUpRight,
  Dna, Mic, Sparkles, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

// ── Recharts lazy load ──────────────
const DashboardCharts = dynamic(() => import('@/components/DashboardCharts'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'contents' }}>
      {[0,1,2].map(i => <div key={i} className="skeleton" style={{ height: '260px', borderRadius: '14px', background: '#e2e8f0' }} />)}
    </div>
  ),
});

// ── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = '', duration = 900 }: { target: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current || target === 0) { setVal(target); return; }
    ran.current = true;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return <>{val.toLocaleString('tr-TR')}{suffix}</>;
}

// ── KPI Card (Light Mode) ───────────────────────────────────────────────────
function KPICard({ icon: Icon, label, value, suffix = '', sub, color, colorDim, trend, delay = 0 }: any) {
  return (
    <div className="card stat-card animate-in" style={{ animationDelay: delay + 's', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ width: '50px', height: '50px', borderRadius: '14px', flexShrink: 0, background: colorDim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={24} color={color} strokeWidth={2} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.5px' }}>
          <Counter target={typeof value === 'number' ? value : 0} suffix={suffix} />
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginTop: '6px' }}>{label}</div>
        {sub && (
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: trend === 'up' ? '#059669' : trend === 'down' ? '#e11d48' : '#64748b', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {trend === 'up' && <TrendingUp size={12} />}
            {trend === 'down' && <TrendingDown size={12} />}
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardHome() {
  const [stats,   setStats]   = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div>
        <div style={{ marginBottom: '28px' }}>
          <div className="skeleton" style={{ height: '28px', width: '200px', borderRadius: '8px', marginBottom: '8px', background: '#e2e8f0' }} />
          <div className="skeleton" style={{ height: '16px', width: '300px', borderRadius: '6px', background: '#e2e8f0' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: '14px', marginBottom: '24px' }}>
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '14px', background: '#e2e8f0' }} />)}
        </div>
      </div>
    );
  }

  const kpis = [
    { icon: Users,         label: 'Toplam Hasta',      value: stats?.totalPatients ?? 0,  suffix: '',  color: '#2563eb', colorDim: 'rgba(37,99,235,0.1)',   sub: 'Takip altında',          trend: 'up',  delay: 0    },
    { icon: AlertTriangle, label: 'Açık Alarm',         value: stats?.openAlerts ?? 0,     suffix: '',  color: '#e11d48', colorDim: 'rgba(225,29,72,0.1)',   sub: 'Kritik eşik aşılanlar', trend: 'down',delay: 0.05 },
    { icon: Activity,      label: 'Bugünkü Yanıt',     value: stats?.todayResponses ?? 0, suffix: '',  color: '#059669', colorDim: 'rgba(5,150,105,0.1)',  sub: 'Son 24 saat',           trend: 'up',  delay: 0.10 },
    { icon: MessageSquare, label: 'Aktif SMS Takibi',  value: stats?.activePatients ?? 0, suffix: '',  color: '#8b5cf6', colorDim: 'rgba(139,92,246,0.1)', sub: 'Düzenli gönderim',      trend: null,  delay: 0.15 },
    { icon: Heart,         label: 'Toplam Ölçüm',       value: stats?.totalResponses ?? 0, suffix: '',  color: '#d97706', colorDim: 'rgba(217,119,6,0.1)',  sub: 'Tüm zamanlar',          trend: 'up',  delay: 0.20 },
    { icon: Zap,           label: 'Kritik Alarm',       value: stats?.criticalAlerts ?? 0, suffix: '',  color: '#0284c7', colorDim: 'rgba(2,132,199,0.1)',  sub: 'Acil müdahale gerekir', trend: 'down',delay: 0.25 },
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.3px', marginBottom: '6px', color: '#0f172a' }}>Klinik Yönetim Paneli</h1>
          <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
            {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#059669', padding: '8px 16px', background: 'rgba(5,150,105,0.08)', borderRadius: '10px', fontWeight: 700 }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', boxShadow: '0 0 8px rgba(5,150,105,0.5)', animation: 'breathe 2s ease-in-out infinite' }} />
          Sistem Aktif & Canlı Veri Akışı
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: '16px', marginBottom: '32px' }}>
        {kpis.map((k, i) => <KPICard key={i} {...k} />)}
      </div>

      {/* V13 Futuristic Banner */}
      <div className="animate-in delay-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
         <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #082f49 100%)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(0, 242, 254, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={14} color="#00f2fe" />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#00f2fe', letterSpacing: '1px' }}>V13 FÜTÜRİSTİK MODÜL</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 8px 0' }}>Biyometrik İkiz & Genomik</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Hücresel düzeyde risk ve ilaç uyum haritası.</p>
            </div>
            <Link href="/dashboard/biometric-twin" className="btn" style={{ background: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe', border: '1px solid rgba(0, 242, 254, 0.4)', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none' }}>
              <Dna size={18} /> Başlat
            </Link>
         </div>
         
         <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #31102f 100%)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(168, 85, 247, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={14} color="#a855f7" />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#a855f7', letterSpacing: '1px' }}>V13 YZ ORTAM DİNLEME</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 8px 0' }}>AI Ambient Scribe</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Muayeneyi dinler, epikriz ve ICD'yi yazar.</p>
            </div>
            <Link href="/dashboard/ai-scribe" className="btn" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.4)', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none' }}>
              <Mic size={18} /> Scribe
            </Link>
         </div>
      </div>

      {/* Charts — lazy loaded */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 320px', gap: '20px', marginBottom: '24px' }}>
        <DashboardCharts diseaseStats={stats?.diseaseStats} />
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Recent alerts */}
        <div className="card animate-in delay-4" style={{ padding: '24px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Son Kritik Alarmlar</div>
            <Link href="/dashboard/alerts" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: 700 }}>
              Tümü <ArrowUpRight size={14} />
            </Link>
          </div>
          {!stats?.recentAlerts?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px', gap: '12px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(5,150,105,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={28} color="#059669" />
              </div>
              <div style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', fontWeight: 500 }}>Harika! Aktif kritik alarm yok.<br />Tüm hastalarınızın durumu stabil.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats.recentAlerts.slice(0, 5).map((alert: any) => (
                <div key={alert.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(225,29,72,0.04)', border: '1px solid rgba(225,29,72,0.15)', transition: 'transform 0.2s' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <AlertTriangle size={18} color="#e11d48" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{alert.patient?.name}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#e11d48', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{alert.message}</div>
                  </div>
                  <Link href={"/dashboard/patients/" + alert.patientId} className="btn btn-ghost btn-sm" style={{ flexShrink: 0, fontSize: '12px', padding: '6px 12px', fontWeight: 700, color: '#0f172a', border: '1px solid rgba(0,0,0,0.1)' }}>
                    İncele
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SMS Logs */}
        <div className="card animate-in delay-5" style={{ padding: '24px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Son Otomatik Bildirimler</div>
            <Link href="/dashboard/logs" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: 700 }}>
              Tümü <ArrowUpRight size={14} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stats?.smsLogs?.slice(0, 6).map((log: any) => (
              <div key={log.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', background: '#f8fafc' }}>
                <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{log.phone}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.message}</div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, background: 'rgba(5,150,105,0.1)', color: '#059669', padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={12} /> İletildi
                </div>
              </div>
            ))}
            {(!stats?.smsLogs || stats.smsLogs.length === 0) && (
              <div style={{ textAlign: 'center', padding: '32px', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Henüz sistem tarafından gönderilmiş otomatik bir uyarı bulunmuyor.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
