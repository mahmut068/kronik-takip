import React, { useState, useEffect } from 'react';
import {
  X, MessageCircle, Phone, Send, CheckCircle, Clock,
  ChevronDown, AlertTriangle, Heart, Smile, Bell, Copy, Trash2, User
} from 'lucide-react';

/* ── Şablon Tipleri ── */
const TEMPLATES = {
  critical_resolved: {
    label: 'Kritik Durum Atlatıldı',
    icon: '✅',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.3)',
    generate: (p) =>
      `Sayın Hasta Yakını,\n\n${p?.name || 'Hastanız'}'ın kritik durumu başarıyla atlatılmış olup sağlık ekibimiz gözetiminde stabilize edilmiştir.\n\nŞu anki genel durumu stabil olup takipleri devam etmektedir. Herhangi bir gelişme yaşanması halinde sizi derhal bilgilendireceğiz.\n\nSayılarımızla,\nHastane Hasta Takip Sistemi`,
  },
  routine_good: {
    label: 'Rutin Kontrol Sonucu İyi',
    icon: '💚',
    color: '#00e5ff',
    bg: 'rgba(0,229,255,0.06)',
    border: 'rgba(0,229,255,0.25)',
    generate: (p) =>
      `Sayın Hasta Yakını,\n\n${p?.name || 'Hastanız'}'ın bugün gerçekleştirilen rutin kontrolü olumlu sonuçlanmıştır.\n\nÖlçüm değerleri: ${p?.currentValue || '—'} (Eşik: ${p?.threshold || '—'})\nSağlık Skoru: ${p?.healthScore || '—'}/100\nGenel Durum: Stabil ✅\n\nTedavi planı değiştirilmeksizin devam edilmektedir. Endişeleriniz için lütfen bizimle iletişime geçin.\n\nSayılarımızla,\nHastane Hasta Takip Sistemi`,
  },
  emergency: {
    label: 'Acil Durum Bildirimi',
    icon: '🚨',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.3)',
    generate: (p) =>
      `⚠️ ACİL BİLDİRİM ⚠️\n\nSayın Hasta Yakını,\n\n${p?.name || 'Hastanız'} için acil tıbbi müdahale gereksinimi doğmuştur.\n\nLütfen en kısa sürede hastaneyle iletişime geçin veya aşağıdaki numarayı arayın:\n📞 Hastane Acil: 0 (212) 444 00 00\n\nSağlık ekibimiz hastanızla birlikte olup gerekli müdahaleler yapılmaktadır.\n\nHastane Hasta Takip Sistemi`,
  },
  medication_change: {
    label: 'İlaç Değişikliği Bildirimi',
    icon: '💊',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.3)',
    generate: (p) =>
      `Sayın Hasta Yakını,\n\n${p?.name || 'Hastanız'}'ın tedavi planında ilaç güncellemesi yapılmıştır.\n\nYeni ilaç düzenlememiz hakkında detaylı bilgi almak ve gerekli talimatlara uymak için lütfen sağlık ekibimizle iletişime geçin.\n\n⚠️ Lütfen eski ilaç dozajlarını kendi başınıza değiştirmeyin.\n\nSayılarımızla,\nHastane Hasta Takip Sistemi`,
  },
};

const CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬', color: '#25d366' },
  { id: 'sms',      label: 'SMS',       icon: '✉️', color: '#00e5ff' },
  { id: 'call',     label: 'Telefon',   icon: '📞', color: '#f59e0b' },
];

/* ── Simüle telefon numarası üreticisi ── */
const mockPhone = (name) => {
  const n = name ? name.charCodeAt(0) : 5;
  return `+90 5${n % 4}${n % 9} ${100 + (n * 7) % 900} ${10 + (n * 3) % 90} ${10 + (n * 11) % 90}`;
};

const FamilyNotificationModal = ({ patients = [], onClose, addNotification, addToast }) => {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [templateKey, setTemplateKey]             = useState('routine_good');
  const [channel, setChannel]                     = useState('whatsapp');
  const [message, setMessage]                     = useState('');
  const [sending, setSending]                     = useState(false);
  const [sent, setSent]                           = useState(false);
  const [log, setLog]                             = useState([
    {
      id: 1, patient: 'Ahmet Yılmaz', channel: 'whatsapp', template: 'Rutin Kontrol Sonucu İyi',
      time: '09:14', status: 'delivered',
    },
    {
      id: 2, patient: 'Mehmet Demir', channel: 'sms', template: 'Kritik Durum Atlatıldı',
      time: '10:02', status: 'delivered',
    },
  ]);

  const selectedPatient = patients.find(p => p.id === parseInt(selectedPatientId)) || patients[0];
  const tpl             = TEMPLATES[templateKey];

  /* Şablon veya hasta değişince mesajı yenile */
  useEffect(() => {
    if (tpl && selectedPatient) {
      setMessage(tpl.generate(selectedPatient));
    }
  }, [templateKey, selectedPatientId]);

  const handleSend = () => {
    if (!message.trim()) return;
    setSending(true);
    setTimeout(() => {
      const entry = {
        id: Date.now(),
        patient: selectedPatient?.name || '—',
        channel,
        template: tpl.label,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
      };
      setLog(prev => [entry, ...prev]);
      setSending(false);
      setSent(true);
      if (addToast) addToast('success', `📨 ${selectedPatient?.name || 'Hasta'} yakınına bildirim gönderildi.`);
      if (addNotification) addNotification('success', `Hasta yakını bilgilendirildi (${CHANNELS.find(c => c.id === channel)?.label}).`);
      setTimeout(() => setSent(false), 2000);
    }, 1400);
  };

  const channelObj = CHANNELS.find(c => c.id === channel);

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)',
        zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-slide-in"
        style={{ width: '760px', maxWidth: '96vw', maxHeight: '92vh', overflowY: 'auto', padding: '32px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Başlık */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)', fontSize: '1.4rem' }}>
            <div style={{ padding: '10px', background: 'linear-gradient(135deg, #25d366, #128c7e)', borderRadius: '12px' }}>
              <Bell size={20} color="#fff" />
            </div>
            Hasta Yakını Bilgilendirme
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* SOL PANEL — Konfigürasyon */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Hasta Seçimi */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <User size={13} /> Hasta
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  style={{
                    width: '100%', padding: '11px 14px', appearance: 'none',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                    borderRadius: '10px', color: 'var(--text-main)', fontFamily: 'Outfit', fontSize: '0.9rem',
                    cursor: 'pointer', outline: 'none',
                  }}
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — {p.disease}</option>
                  ))}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              </div>
              {selectedPatient && (
                <div style={{ marginTop: '8px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
                  <span>📞 {mockPhone(selectedPatient.name)}</span>
                  <span>|</span>
                  <span style={{ color: selectedPatient.status === 'danger' ? 'var(--danger)' : 'var(--success)' }}>
                    {selectedPatient.status === 'danger' ? '🔴 Riskli' : '✅ Stabil'}
                  </span>
                </div>
              )}
            </div>

            {/* Şablon Seçimi */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Bildirim Şablonu
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(TEMPLATES).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => setTemplateKey(key)}
                    style={{
                      padding: '10px 14px', borderRadius: '10px', border: `1px solid ${templateKey === key ? t.border : 'var(--glass-border)'}`,
                      background: templateKey === key ? t.bg : 'transparent',
                      color: templateKey === key ? t.color : 'var(--text-muted)',
                      cursor: 'pointer', fontFamily: 'Outfit', fontSize: '0.86rem',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      transition: 'all 0.2s', textAlign: 'left',
                      fontWeight: templateKey === key ? 700 : 400,
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>{t.icon}</span>
                    {t.label}
                    {templateKey === key && <CheckCircle size={14} style={{ marginLeft: 'auto' }} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Kanal Seçimi */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Gönderim Kanalı
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {CHANNELS.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setChannel(ch.id)}
                    style={{
                      flex: 1, padding: '10px 8px', borderRadius: '10px',
                      border: `1px solid ${channel === ch.id ? ch.color + '66' : 'var(--glass-border)'}`,
                      background: channel === ch.id ? `${ch.color}18` : 'transparent',
                      color: channel === ch.id ? ch.color : 'var(--text-muted)',
                      cursor: 'pointer', fontFamily: 'Outfit', fontSize: '0.8rem',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                      transition: 'all 0.2s', fontWeight: channel === ch.id ? 700 : 400,
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{ch.icon}</span>
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gönder Butonu */}
            <button
              onClick={handleSend}
              disabled={sending || sent}
              style={{
                padding: '14px', borderRadius: '12px', border: 'none',
                background: sent
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : sending
                  ? 'rgba(255,255,255,0.08)'
                  : `linear-gradient(135deg, ${channelObj?.color || '#00e5ff'}, ${channelObj?.color || '#00e5ff'}99)`,
                color: '#fff', cursor: sending || sent ? 'default' : 'pointer',
                fontFamily: 'Outfit', fontSize: '0.95rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'all 0.3s',
                boxShadow: !sending && !sent ? `0 4px 20px ${channelObj?.color || '#00e5ff'}40` : 'none',
              }}
            >
              {sent ? (
                <><CheckCircle size={18} /> Gönderildi!</>
              ) : sending ? (
                <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Gönderiliyor...</>
              ) : (
                <><Send size={18} /> {channelObj?.icon} {channelObj?.label} ile Gönder</>
              )}
            </button>
          </div>

          {/* SAĞ PANEL — Önizleme + Log */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Mesaj Önizleme */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Mesaj Önizleme
                </label>
                <button
                  onClick={() => navigator.clipboard.writeText(message)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontFamily: 'Outfit' }}
                >
                  <Copy size={12} /> Kopyala
                </button>
              </div>
              <div style={{ position: 'relative', borderRadius: '12px', background: tpl.bg, border: `1px solid ${tpl.border}`, overflow: 'hidden' }}>
                <div style={{ padding: '8px 12px', background: tpl.bg, borderBottom: `1px solid ${tpl.border}`, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: tpl.color, fontWeight: 700 }}>
                  {tpl.icon} {tpl.label}
                </div>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={9}
                  style={{
                    width: '100%', padding: '14px', background: 'transparent', border: 'none',
                    color: 'var(--text-main)', fontFamily: 'Outfit', fontSize: '0.85rem',
                    lineHeight: 1.7, resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                ✏️ Metni doğrudan düzenleyebilirsiniz
              </p>
            </div>

            {/* Gönderim Logu */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Gönderim Geçmişi
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                {log.length === 0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                    Henüz gönderim yapılmadı.
                  </div>
                )}
                {log.map(entry => {
                  const ch = CHANNELS.find(c => c.id === entry.channel);
                  return (
                    <div key={entry.id} style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1rem' }}>{ch?.icon || '📨'}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {entry.patient}
                        </p>
                        <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{entry.template}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{entry.time}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <CheckCircle size={10} /> İletildi
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyNotificationModal;
