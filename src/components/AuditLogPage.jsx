import React, { useState, useMemo } from 'react';
import {
  Shield, AlertTriangle, CheckCircle, Info,
  Filter, Download, Eye, Clock, User,
} from 'lucide-react';

/* ─── Mock log verisi ─── */
const MOCK_LOGS = [
  { id: 1,  timestamp: '2026-07-07 11:02:14', user: 'Dr. Mehmet Öztürk',    role: 'Doktor',      action: 'Hasta kaydı güncellendi',           target: 'Ahmet Yılmaz',       type: 'info' },
  { id: 2,  timestamp: '2026-07-07 11:01:55', user: 'Hemş. Ayşe Kılıç',     role: 'Hemşire',     action: 'Yeni vital ölçüm girildi',           target: 'Fatma Çelik',        type: 'success' },
  { id: 3,  timestamp: '2026-07-07 10:58:33', user: 'Admin',                  role: 'Yönetici',    action: 'Sisteme giriş yapıldı',              target: 'sistem',             type: 'info' },
  { id: 4,  timestamp: '2026-07-07 10:55:21', user: 'Dr. Zeynep Arslan',     role: 'Doktor',      action: 'İlaç dozu değiştirildi',             target: 'Mehmet Demir',       type: 'warning' },
  { id: 5,  timestamp: '2026-07-07 10:52:09', user: 'Dr. Mehmet Öztürk',    role: 'Doktor',      action: 'Kritik eşik aşıldı — ACİL bildirim', target: 'Ali Koç',            type: 'danger' },
  { id: 6,  timestamp: '2026-07-07 10:49:47', user: 'Lab. Tek. Burak Şahin', role: 'Teknisyen',   action: 'Lab sonucu yüklendi',                target: 'Zeynep Yıldız',      type: 'success' },
  { id: 7,  timestamp: '2026-07-07 10:47:02', user: 'Hemş. Merve Güler',    role: 'Hemşire',     action: 'Vizit notu eklendi',                 target: 'Hasan Karaca',       type: 'info' },
  { id: 8,  timestamp: '2026-07-07 10:43:38', user: 'Dr. Can Aydın',         role: 'Doktor',      action: 'Ameliyat planlandı',                 target: 'Şükran Doğan',       type: 'warning' },
  { id: 9,  timestamp: '2026-07-07 10:41:15', user: 'Admin',                  role: 'Yönetici',    action: 'Kullanıcı şifresi sıfırlandı',       target: 'Dr. Zeynep Arslan',  type: 'warning' },
  { id: 10, timestamp: '2026-07-07 10:38:52', user: 'Dr. Mehmet Öztürk',    role: 'Doktor',      action: 'Hasta taburcu edildi',               target: 'Nihat Özbek',        type: 'success' },
  { id: 11, timestamp: '2026-07-07 10:35:19', user: 'Hemş. Ayşe Kılıç',     role: 'Hemşire',     action: 'Alerji uyarısı eklendi',             target: 'Büşra Tekin',        type: 'danger' },
  { id: 12, timestamp: '2026-07-07 10:32:04', user: 'Lab. Tek. Burak Şahin', role: 'Teknisyen',   action: 'Kan tahlili sonucu anormal',         target: 'Caner Aksoy',        type: 'danger' },
  { id: 13, timestamp: '2026-07-07 10:29:47', user: 'Dr. Can Aydın',         role: 'Doktor',      action: 'Radyoloji raporu incelendi',         target: 'Esra Şimşek',        type: 'info' },
  { id: 14, timestamp: '2026-07-07 10:26:31', user: 'Admin',                  role: 'Yönetici',    action: 'Yeni kullanıcı oluşturuldu',         target: 'Hemş. Seda Polat',   type: 'info' },
  { id: 15, timestamp: '2026-07-07 10:23:18', user: 'Hemş. Merve Güler',    role: 'Hemşire',     action: 'İlaç uygulandı',                     target: 'Mahmut Yılmaz',      type: 'success' },
  { id: 16, timestamp: '2026-07-07 10:20:05', user: 'Dr. Zeynep Arslan',     role: 'Doktor',      action: 'Konsültasyon talep edildi',          target: 'Rana Demirtaş',      type: 'info' },
  { id: 17, timestamp: '2026-07-07 10:17:42', user: 'Dr. Mehmet Öztürk',    role: 'Doktor',      action: 'Tahlil sonucu paylaşıldı',           target: 'Ahmet Yılmaz',       type: 'success' },
  { id: 18, timestamp: '2026-07-07 10:14:29', user: 'Admin',                  role: 'Yönetici',    action: 'Yedekleme başlatıldı',              target: 'sistem',             type: 'info' },
  { id: 19, timestamp: '2026-07-07 10:11:17', user: 'Hemş. Ayşe Kılıç',     role: 'Hemşire',     action: 'Düşme riski uyarısı oluşturuldu',    target: 'Selçuk Akar',        type: 'danger' },
  { id: 20, timestamp: '2026-07-07 10:08:03', user: 'Lab. Tek. Burak Şahin', role: 'Teknisyen',   action: 'Mikrobiyoloji kültürü hazır',        target: 'Sema Yıldırım',      type: 'success' },
];

/* ─── Tip konfigürasyonları ─── */
const TYPE_CONFIG = {
  info:    { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  label: 'Bilgi',   Icon: Info },
  warning: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  label: 'Uyarı',   Icon: AlertTriangle },
  danger:  { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   label: 'Kritik',  Icon: AlertTriangle },
  success: { color: '#10b981', bg: 'rgba(16,185,129,0.08)',  label: 'Başarılı', Icon: CheckCircle },
};

const ROLE_COLORS = {
  Doktor:      { bg: 'rgba(0,229,255,0.15)', color: '#00e5ff' },
  Hemşire:     { bg: 'rgba(167,139,250,0.15)', color: '#a78bfa' },
  Yönetici:    { bg: 'rgba(239,68,68,0.15)',  color: '#ef4444' },
  Teknisyen:   { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
};

const FILTERS = [
  { key: 'all',     label: 'Tümü',     color: 'var(--text-muted)' },
  { key: 'warning', label: 'Uyarı',    color: '#f59e0b' },
  { key: 'danger',  label: 'Kritik',   color: '#ef4444' },
  { key: 'success', label: 'Başarılı', color: '#10b981' },
];

/* ─── Ana bileşen ─── */
export default function AuditLogPage({ logs }) {
  const effectiveLogs = (logs && logs.length > 0) ? logs : MOCK_LOGS;

  const [activeFilter, setActiveFilter] = useState('all');
  const [dateFilter,   setDateFilter]   = useState('');
  const [search,       setSearch]       = useState('');
  const [hoveredRow,   setHoveredRow]   = useState(null);

  const filtered = useMemo(() => {
    return effectiveLogs.filter(log => {
      if (activeFilter !== 'all' && log.type !== activeFilter) return false;
      if (dateFilter && !log.timestamp.startsWith(dateFilter)) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          log.user.toLowerCase().includes(s) ||
          log.action.toLowerCase().includes(s) ||
          log.target.toLowerCase().includes(s) ||
          log.role.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [effectiveLogs, activeFilter, dateFilter, search]);

  /* CSV indir */
  const handleDownload = () => {
    const header = 'ID,Zaman,Kullanıcı,Rol,Aksiyon,Hedef,Tip\n';
    const rows = filtered.map(l =>
      `${l.id},"${l.timestamp}","${l.user}","${l.role}","${l.action}","${l.target}","${l.type}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'audit_log.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '28px', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>

      {/* ─── Başlık ─── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            padding: '10px', borderRadius: '14px',
            boxShadow: '0 0 22px rgba(59,130,246,0.4)',
          }}>
            <Shield size={26} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px', margin: 0 }}>
              Denetim Kaydı
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Audit Log — Sistem aktiviteleri ve kullanıcı işlemleri
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Arama */}
          <div style={{ position: 'relative' }}>
            <Eye size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="glass-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Kullanıcı, aksiyon ara..."
              style={{ paddingLeft: '32px', width: '200px', fontSize: '0.82rem' }}
            />
          </div>
          {/* Tarih filtresi */}
          <div style={{ position: 'relative' }}>
            <Clock size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />
            <input
              type="date"
              className="glass-input"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              style={{ paddingLeft: '32px', width: '160px', fontSize: '0.82rem', colorScheme: 'dark' }}
            />
          </div>
          {/* İndir */}
          <button className="glass-button primary" onClick={handleDownload} style={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
            <Download size={15} />
            CSV İndir
          </button>
        </div>
      </div>

      {/* ─── Filtre Butonları ─── */}
      <div className="glass-panel" style={{ padding: '14px 18px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.82rem', marginRight: '6px' }}>
          <Filter size={14} /> Filtre:
        </div>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            style={{
              padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
              transition: 'all 0.22s ease',
              border: activeFilter === f.key ? `1.5px solid ${f.color}` : '1.5px solid var(--glass-border)',
              background: activeFilter === f.key ? `${f.color}18` : 'transparent',
              color: activeFilter === f.key ? f.color : 'var(--text-muted)',
              transform: activeFilter === f.key ? 'translateY(-1px)' : 'none',
            }}
            onMouseEnter={e => { if (activeFilter !== f.key) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { if (activeFilter !== f.key) e.currentTarget.style.background = 'transparent'; }}
          >
            {f.label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{filtered.length}</span> kayıt gösteriliyor
        </div>
      </div>

      {/* ─── Log Tablosu ─── */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Tablo başlıkları */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '160px 1fr 110px 1fr 130px 80px',
          padding: '12px 20px',
          borderBottom: '1px solid var(--glass-border)',
          background: 'rgba(0,0,0,0.15)',
          gap: '12px',
        }}>
          {['Zaman', 'Kullanıcı', 'Rol', 'Aksiyon', 'Hedef', 'Tip'].map(h => (
            <div key={h} style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              {h}
            </div>
          ))}
        </div>

        {/* Log satırları */}
        <div style={{ maxHeight: '62vh', overflowY: 'auto' }} className="thin-scroll">
          {filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Shield size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
              <p>Filtre kriterlerine uygun kayıt bulunamadı.</p>
            </div>
          ) : filtered.map((log, idx) => {
            const cfg = TYPE_CONFIG[log.type] || TYPE_CONFIG.info;
            const roleCfg = ROLE_COLORS[log.role] || { bg: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)' };
            const isHovered = hoveredRow === log.id;

            return (
              <div
                key={log.id}
                onMouseEnter={() => setHoveredRow(log.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '160px 1fr 110px 1fr 130px 80px',
                  padding: '13px 20px',
                  gap: '12px',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  background: isHovered ? 'rgba(255,255,255,0.04)' : 'transparent',
                  transition: 'background 0.15s ease',
                  cursor: 'default',
                  position: 'relative',
                  borderLeft: `3px solid ${cfg.color}`,
                  animation: `fadeIn 0.3s ease both`,
                  animationDelay: `${idx * 0.02}s`,
                }}
              >
                {/* Timestamp */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {log.timestamp.split(' ')[1]}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {log.timestamp.split(' ')[0]}
                  </span>
                </div>

                {/* Kullanıcı */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: `linear-gradient(135deg, ${cfg.color}40, ${cfg.color}20)`,
                    border: `1px solid ${cfg.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <User size={13} color={cfg.color} />
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 500 }}>
                    {log.user}
                  </span>
                </div>

                {/* Rol badge */}
                <div>
                  <span style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700,
                    background: roleCfg.bg, color: roleCfg.color,
                    border: `1px solid ${roleCfg.color}30`,
                    whiteSpace: 'nowrap',
                  }}>
                    {log.role}
                  </span>
                </div>

                {/* Aksiyon */}
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>
                  {log.action}
                </div>

                {/* Hedef */}
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  {log.target}
                </div>

                {/* Tip ikonu */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: cfg.color }}>
                  <div style={{
                    background: cfg.bg, border: `1px solid ${cfg.color}40`,
                    borderRadius: '8px', padding: '4px 8px',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <cfg.Icon size={12} />
                    <span style={{ fontSize: '0.68rem', fontWeight: 700 }}>{cfg.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alt bilgi */}
        <div style={{
          padding: '10px 20px',
          borderTop: '1px solid var(--glass-border)',
          background: 'rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: '0.75rem', color: 'var(--text-muted)',
          gap: '12px', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={13} />
            Son 30 gün gösteriliyor
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%', background: '#10b981',
              animation: 'live-pulse 2s ease-in-out infinite',
            }} />
            Otomatik yenileme: 30 sn
          </div>
          <div>
            Toplam <strong style={{ color: 'var(--primary)' }}>{effectiveLogs.length}</strong> kayıt
          </div>
        </div>
      </div>
    </div>
  );
}
