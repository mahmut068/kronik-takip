'use client';

import { useState } from 'react';
import {
  FileText, Download, Calendar, Filter, CheckCircle,
  Users, AlertTriangle, BarChart2, FileDown, Printer,
  Eye, Clock, TrendingUp, Shield,
} from 'lucide-react';

const REPORT_TYPES = [
  {
    id: 'monthly',
    title: 'Aylık Özet Raporu',
    desc: 'Seçilen aydaki tüm hasta takip, alarm ve SMS istatistiklerini içerir.',
    icon: BarChart2, color: '#00e5ff', dim: 'rgba(0,229,255,0.1)',
    pages: 8, date: 'Temmuz 2026', status: 'Hazır',
  },
  {
    id: 'patients',
    title: 'Hasta Kayıt Raporu',
    desc: 'Aktif hasta listesi, tanı bilgileri, eşik değerleri ve takip durumu.',
    icon: Users, color: '#10b981', dim: 'rgba(16,185,129,0.1)',
    pages: 12, date: 'Temmuz 2026', status: 'Hazır',
  },
  {
    id: 'alerts',
    title: 'Alarm & Müdahale Raporu',
    desc: 'Kritik eşik aşım olayları, müdahale süreleri ve çözüm notları.',
    icon: AlertTriangle, color: '#f43f5e', dim: 'rgba(244,63,94,0.1)',
    pages: 5, date: 'Temmuz 2026', status: 'Hazır',
  },
  {
    id: 'compliance',
    title: 'KVKK Uyum Raporu',
    desc: 'Kişisel sağlık verileri işleme, saklama ve erişim logları.',
    icon: Shield, color: '#a78bfa', dim: 'rgba(167,139,250,0.1)',
    pages: 4, date: 'Temmuz 2026', status: 'Hazır',
  },
  {
    id: 'sms',
    title: 'SMS & Arama Log Raporu',
    desc: 'Tüm SMS ve yapay zeka sesli arama gönderim logları ve başarı oranları.',
    icon: TrendingUp, color: '#f59e0b', dim: 'rgba(245,158,11,0.1)',
    pages: 9, date: 'Temmuz 2026', status: 'Hazır',
  },
  {
    id: 'ministry',
    title: 'Bakanlık Sunum Paketi',
    desc: 'T.C. Sağlık Bakanlığı\'na özel standart formatta kapsamlı veri paketi.',
    icon: FileText, color: '#3b82f6', dim: 'rgba(59,130,246,0.1)',
    pages: 24, date: 'Temmuz 2026', status: 'Hazır',
    featured: true,
  },
];

const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz'];

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState('Temmuz');
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => setDownloading(null), 1800);
  };

  return (
    <div>
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#e2f0f9', letterSpacing: '-0.3px', marginBottom: '4px' }}>Raporlar</h1>
          <p style={{ fontSize: '13px', color: '#4d6b82' }}>Sistem raporlarını görüntüleyin, PDF veya Excel olarak indirin</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px' }}>
            <Calendar size={15} color="#4d6b82" />
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#e2f0f9', fontSize: '13px', fontFamily: 'Outfit, sans-serif', fontWeight: 600, cursor: 'pointer' }}
            >
              {MONTHS.map(m => <option key={m} value={m} style={{ background: '#0b1626' }}>{m} 2026</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div className="animate-in delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '28px' }}>
        {[
          { label: 'Kullanılabilir Rapor', val: REPORT_TYPES.length, color: '#00e5ff', dim: 'rgba(0,229,255,0.08)', icon: FileText },
          { label: 'Bu Ay İndirilen',      val: 14,                  color: '#10b981', dim: 'rgba(16,185,129,0.08)', icon: Download },
          { label: 'Son Güncelleme',       val: 'Bugün',             color: '#f59e0b', dim: 'rgba(245,158,11,0.08)', icon: Clock    },
        ].map(({ label, val, color, dim, icon: Icon }) => (
          <div key={label} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: dim, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#e2f0f9', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: '11px', color: '#4d6b82', marginTop: '4px' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured report */}
      {(() => {
        const feat = REPORT_TYPES.find(r => r.featured)!;
        const Icon = feat.icon;
        return (
          <div className="card animate-in delay-2" style={{ marginBottom: '20px', padding: '28px', background: 'linear-gradient(135deg,rgba(59,130,246,0.08),rgba(0,229,255,0.05))', borderColor: 'rgba(59,130,246,0.25)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', borderRadius: '50%', background: '#3b82f6', filter: 'blur(50px)', opacity: 0.08 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <div style={{ padding: '4px 10px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '20px', fontSize: '11px', fontWeight: 700, color: '#3b82f6' }}>
                ⭐ ÖNE ÇIKAN
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: feat.dim, border: `1px solid ${feat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={28} color={feat.color} strokeWidth={1.6} />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#e2f0f9', marginBottom: '6px' }}>{feat.title}</div>
                <div style={{ fontSize: '13px', color: '#8aafc7', lineHeight: '1.6', marginBottom: '16px' }}>{feat.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#4d6b82', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FileText size={12} />{feat.pages} sayfa</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={12} />{feat.date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981' }}><CheckCircle size={12} />{feat.status}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => handleDownload(feat.id)} className="btn btn-primary" style={{ justifyContent: 'center', minWidth: '160px' }}>
                  {downloading === feat.id
                    ? <><div className="spinner" style={{ width: '15px', height: '15px', borderWidth: '2px' }} />Hazırlanıyor…</>
                    : <><Download size={15} />PDF İndir</>}
                </button>
                <button onClick={() => handleDownload(feat.id + '_xl')} className="btn btn-ghost btn-sm" style={{ justifyContent: 'center' }}>
                  {downloading === feat.id + '_xl'
                    ? <><div className="spinner" style={{ width: '13px', height: '13px', borderWidth: '2px' }} />…</>
                    : <><FileDown size={14} />Excel İndir</>}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Report cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px,1fr))', gap: '16px' }}>
        {REPORT_TYPES.filter(r => !r.featured).map((rep, i) => {
          const Icon = rep.icon;
          return (
            <div key={rep.id} className="card animate-in" style={{ padding: '22px', animationDelay: `${(i + 3) * 0.05}s`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '80px', height: '80px', borderRadius: '50%', background: rep.color, filter: 'blur(25px)', opacity: 0.07 }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '13px', background: rep.dim, border: `1px solid ${rep.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} color={rep.color} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2f0f9', marginBottom: '4px' }}>{rep.title}</div>
                  <div style={{ fontSize: '12px', color: '#4d6b82', lineHeight: '1.5' }}>{rep.desc}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', fontSize: '11px', color: '#4d6b82' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={11} />{rep.pages} sayfa</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={11} />{rep.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', marginLeft: 'auto' }}><CheckCircle size={11} />{rep.status}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleDownload(rep.id)} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  {downloading === rep.id
                    ? <><div className="spinner" style={{ width: '13px', height: '13px', borderWidth: '2px' }} />İndiriliyor…</>
                    : <><Download size={13} />PDF</>}
                </button>
                <button onClick={() => handleDownload(rep.id + '_xl')} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  {downloading === rep.id + '_xl'
                    ? <><div className="spinner" style={{ width: '13px', height: '13px', borderWidth: '2px' }} />…</>
                    : <><FileDown size={13} />Excel</>}
                </button>
                <button className="btn btn-ghost btn-sm" style={{ justifyContent: 'center', paddingLeft: '10px', paddingRight: '10px' }}>
                  <Eye size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div style={{ marginTop: '28px', padding: '16px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#4d6b82' }}>
        <Shield size={14} color="#10b981" />
        <span>Tüm raporlar AES-256 şifreleme ile korunmakta ve KVKK kapsamında işlenmektedir. İndirilen raporlar 30 gün boyunca sistemde kayıt altında tutulur.</span>
      </div>
    </div>
  );
}
