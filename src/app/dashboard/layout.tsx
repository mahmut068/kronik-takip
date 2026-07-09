import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Activity, LayoutDashboard, Users, AlertTriangle,
  BarChart2, FileText, Shield, Settings, Calendar,
  Send, Brain, Pill, Truck, Dna, Mic, Radio, Glasses, 
  Crosshair, Snowflake, Globe2, Printer, CloudUpload,
  Video, Bot, LogOut, Wifi, ChevronRight, MessageSquare,
  Infinity, Cpu
} from 'lucide-react';
import React from 'react';
import NotificationBell from '@/components/NotificationBell';
import ToastSimulation from '@/components/ToastSimulation';
import { LanguageProvider } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

const NAV_SECTIONS = [
  {
    label: 'Klinik Yönetim',
    items: [
      { href: '/dashboard',             icon: LayoutDashboard, label: 'Ana Panel',       badge: null     },
      { href: '/dashboard/patients',    icon: Users,           label: 'Hastalar',        badge: null     },
      { href: '/dashboard/telemedicine',icon: Video,           label: 'Tele-Tıp (Canlı)',badge: 'danger' },
      { href: '/dashboard/alerts',      icon: AlertTriangle,   label: 'Alarmlar',        badge: null },
      { href: '/dashboard/calendar',    icon: Calendar,        label: 'Klinik Takvim',   badge: null     },
    ],
  },
  {
    label: 'Raporlama & Analiz',
    items: [
      { href: '/dashboard/analytics', icon: BarChart2, label: 'Analitik',  badge: null },
      { href: '/dashboard/reports',   icon: FileText,  label: 'Raporlar',  badge: null },
    ],
  },
  {
    label: 'Yapay Zeka & İletişim',
    items: [
      { href: '/dashboard/ai-voice',  icon: Bot,  label: 'YZ Sesli Asistan', badge: 'new' },
      { href: '/dashboard/campaigns', icon: Send, label: 'Branş Tavsiyeleri', badge: null },
    ],
  },
  {
    label: 'Sağlık Operasyonları',
    items: [
      { href: '/dashboard/prescriptions', icon: Pill,  label: 'Akıllı E-Reçete', badge: 'ai' },
      { href: '/dashboard/dispatch',      icon: Truck, label: 'Evde Sağlık & Filo', badge: null },
    ],
  },
  {
    label: 'Gelecek Teknolojileri',
    items: [
      { href: '/dashboard/anti-aging',    icon: Infinity, label: 'Ölümsüzlük Protokolü', badge: 'v18' },
      { href: '/dashboard/crispr',        icon: Dna, label: 'DNA Hack & Splicing', badge: 'v18' },
      { href: '/dashboard/nanobots',      icon: Cpu, label: 'Kuantum Nanobot Sürüsü', badge: 'v18' },
      { href: '/dashboard/bio-printing',  icon: Printer, label: '3D Organ Yazıcısı', badge: 'v17' },
      { href: '/dashboard/neural-backup', icon: CloudUpload, label: 'Hafıza Yedekleme', badge: 'v17' },
      { href: '/dashboard/cybernetics',   icon: Settings, label: 'Biyonik Kalibrasyon', badge: 'v17' },
      { href: '/dashboard/cyber-surgery', icon: Crosshair, label: 'Tele-Cerrahi', badge: 'v16' },
      { href: '/dashboard/cryogenics',    icon: Snowflake, label: 'Kriyojenik Dondurma', badge: 'v16' },
      { href: '/dashboard/outbreak-radar',icon: Globe2,    label: 'Salgın Radarı', badge: 'v16' },
      { href: '/dashboard/quantum',       icon: Activity, label: 'Kuantum Diagnostik', badge: 'v15' },
      { href: '/dashboard/neuro-link',    icon: Radio, label: 'Neuro-Link BCI',  badge: 'v14' },
      { href: '/dashboard/digital-pill',  icon: Pill,  label: 'Akıllı Hap Takibi', badge: 'v14' },
      { href: '/dashboard/vr-therapy',    icon: Glasses, label: 'VR Terapi',     badge: 'v14' },
      { href: '/dashboard/biometric-twin', icon: Dna, label: 'Biyometrik İkiz', badge: 'v13' },
      { href: '/dashboard/ai-scribe',      icon: Mic, label: 'AI Scribe (Ortam)', badge: 'v13' },
      { href: '/dashboard/radiology', icon: Brain, label: 'AI Radyoloji', badge: 'new' },
    ],
  },
  {
    label: 'Sistem',
    items: [
      { href: '/dashboard/settings', icon: Settings, label: 'Ayarlar', badge: null },
      { href: '/dashboard/audit',    icon: Shield,   label: 'Denetim Logları', badge: null },
    ],
  },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // SUNUM MODU BYPASS
  const session = { user: { name: 'Dr. Admin' } };

  const initial = (session.user?.name?.[0] || 'D').toUpperCase();

  return (
    <ThemeProvider>
    <LanguageProvider>
      <div className="main-layout">

      {/* ══════ SIDEBAR ══════ */}
      <aside className="sidebar" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

          {/* Logo */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '20px 18px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{
              position: 'relative', width: '42px', height: '42px', flexShrink: 0,
              borderRadius: '12px', background: 'rgba(0,229,255,0.1)',
              border: '1px solid rgba(0,229,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Activity size={22} color="#00e5ff" />
              <div style={{
                position: 'absolute', top: '-2px', right: '-2px',
                width: '10px', height: '10px', borderRadius: '50%',
                background: '#10b981', border: '2px solid #0b1626',
                boxShadow: '0 0 6px rgba(16,185,129,0.7)',
              }} />
            </div>
            <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#e2f0f9', letterSpacing: '-0.3px' }}>
                Medi<span style={{ color: '#00e5ff' }}>Takip</span>
              </div>
              <div style={{ fontSize: '10px', color: '#4d6b82', fontWeight: 500 }}>
                Sağlık Bakanlığı v2.1
              </div>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
            {NAV_SECTIONS.map((section) => (
              <div key={section.label} style={{ marginBottom: '4px' }}>
                <div className="nav-section-title" style={{ marginTop: '16px' }}>
                  {section.label}
                </div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} className="nav-item" style={{ justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={17} strokeWidth={1.8} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge === 'danger' && (
                        <div style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: '#f43f5e',
                          boxShadow: '0 0 6px rgba(244,63,94,0.7)',
                          flexShrink: 0,
                        }} />
                      )}
                      {item.badge === 'new' && (
                        <div className="badge badge-success" style={{ fontSize: '9px', padding: '2px 4px' }}>YENİ</div>
                      )}
                      {item.badge === 'v13' && (
                        <div style={{ fontSize: '9px', padding: '2px 6px', background: 'linear-gradient(90deg, #00f2fe, #4facfe)', color: '#000', fontWeight: 900, borderRadius: '4px', boxShadow: '0 0 10px rgba(0,242,254,0.5)' }}>V13</div>
                      )}
                      {item.badge === 'v14' && (
                        <div style={{ fontSize: '9px', padding: '2px 6px', background: 'linear-gradient(90deg, #f59e0b, #ef4444)', color: '#fff', fontWeight: 900, borderRadius: '4px', boxShadow: '0 0 10px rgba(239,68,68,0.5)', animation: 'pulseGlow 2s infinite' }}>V14</div>
                      )}
                      {item.badge === 'v15' && (
                        <div style={{ fontSize: '9px', padding: '2px 6px', background: 'linear-gradient(90deg, #d946ef, #00f2fe)', color: '#fff', fontWeight: 900, borderRadius: '4px', boxShadow: '0 0 12px rgba(217,70,239,0.7)', animation: 'pulseGlow 1s infinite' }}>V15</div>
                      )}
                      {item.badge === 'v16' && (
                        <div style={{ fontSize: '9px', padding: '2px 6px', background: 'linear-gradient(90deg, #ff0055, #ffaa00)', color: '#fff', fontWeight: 900, borderRadius: '4px', boxShadow: '0 0 15px rgba(255,0,85,0.8)', animation: 'pulseGlow 0.5s infinite alternate' }}>V16</div>
                      )}
                      {item.badge === 'v17' && (
                        <div style={{ fontSize: '9px', padding: '2px 6px', background: 'linear-gradient(90deg, #fbbf24, #10b981)', color: '#fff', fontWeight: 900, borderRadius: '4px', boxShadow: '0 0 15px rgba(251,191,36,0.8)', animation: 'pulseGlow 0.5s infinite alternate' }}>V17</div>
                      )}
                      {item.badge === 'v18' && (
                        <div style={{ fontSize: '9px', padding: '2px 6px', background: 'linear-gradient(90deg, #000, #4f46e5)', color: '#00f2fe', fontWeight: 900, borderRadius: '4px', border: '1px solid #00f2fe', boxShadow: '0 0 20px rgba(0,242,254,0.9)', animation: 'pulseGlow 0.3s infinite alternate' }}>V18</div>
                      )}
                      {item.badge === 'ai' && (
                        <div style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid #c084fc', fontWeight: 800, borderRadius: '4px' }}>YZ</div>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom — User + Logout */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '14px 10px' }}>
          {/* System status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 14px', marginBottom: '10px',
            background: 'rgba(16,185,129,0.05)',
            border: '1px solid rgba(16,185,129,0.15)',
            borderRadius: '10px',
          }}>
            <Wifi size={13} color="#10b981" />
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>Sistem Aktif</span>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', marginLeft: 'auto', boxShadow: '0 0 5px rgba(16,185,129,0.7)' }} />
          </div>

          {/* User card */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '8px',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg,rgba(0,229,255,0.2),rgba(59,130,246,0.2))',
              border: '1px solid rgba(0,229,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: 800, color: '#00e5ff', flexShrink: 0,
            }}>
              {initial}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2f0f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {session.user?.name || 'Doktor'}
              </div>
              <div style={{ fontSize: '11px', color: '#4d6b82' }}>Klinik Yönetici</div>
            </div>
          </div>

          <Link href="/api/auth/signout" className="nav-item" style={{ color: '#f43f5e', marginBottom: 0 }}>
            <LogOut size={16} />
            <span>Güvenli Çıkış</span>
          </Link>
        </div>
      </aside>

      {/* ══════ OFFICIAL STRIP ══════ */}
      <div className="official-strip animate-slide-down" style={{ position: 'sticky', top: 0, zIndex: 41, justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>
        <Shield size={15} color="var(--primary)" />
        <span style={{ letterSpacing: '1px' }}>T.C. SAĞLIK BAKANLIĞI — ULUSAL KRONİK HASTALIK TAKİP AĞI</span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span style={{ color: 'var(--primary)' }}>VIP SHOWCASE SÜRÜMÜ</span>
      </div>

      {/* ══════ TOP HEADER ══════ */}
      <header className="top-header" style={{ top: '34px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={14} color="#00e5ff" />
          <span style={{ fontSize: '12px', color: '#4d6b82', fontWeight: 600 }}>
            T.C. Sağlık Bakanlığı
          </span>
          <ChevronRight size={13} color="#2d4255" />
          <span style={{ fontSize: '12px', color: '#8aafc7' }}>
            Kronik Hasta Uzaktan Takip Sistemi
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle />
          <NotificationBell />

          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 12px 6px 6px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px', cursor: 'pointer',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'linear-gradient(135deg,rgba(0,229,255,0.2),rgba(59,130,246,0.2))',
              border: '1px solid rgba(0,229,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 800, color: '#00e5ff',
            }}>
              {initial}
            </div>
            <span style={{ fontSize: '13px', color: '#8aafc7', fontWeight: 600 }}>
              {session.user?.name?.split(' ')[0] || 'Dr.'}
            </span>
          </div>
        </div>
      </header>

      {/* ══════ MAIN CONTENT ══════ */}
      <main className="page-content" style={{ paddingTop: '24px' }}>
        {children}
      </main>

      <ToastSimulation />
      </div>
    </LanguageProvider>
    </ThemeProvider>
  );
}
