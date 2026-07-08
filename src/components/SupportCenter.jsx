import React, { useState, useRef, useEffect } from 'react';
import {
  Headphones, MessageSquare, AlertCircle, CheckCircle, Clock,
  ChevronDown, ChevronUp, Send, Phone, Mail, ExternalLink,
  FileText, Zap, Shield, Search, PlusCircle, X, Paperclip,
  ThumbsUp, Activity, Monitor, Server, Wifi, RefreshCw, Star
} from 'lucide-react';

/* ─── Sabit Veriler ─── */
const FAQ = [
  { q: 'Hasta ölçüm değerleri neden güncellenmiyor?', a: 'Hasta simülatörü sekmesinden ilgili hastayı seçip ölçüm değeri girin. Değer eşik değerinin altındaysa yeşil, üstündeyse kırmızı olarak işaretlenir. Sorun devam ederse sayfayı yenileyin (F5).', category: 'Kullanım' },
  { q: 'Grafik verileri nasıl sıfırlanır?', a: 'Hasta detay modalındaki "Geçmiş" sekmesinden geçmiş ölçümler görüntülenebilir. Toplu sıfırlama için Ayarlar > Veri Yönetimi bölümüne gidin.', category: 'Teknik' },
  { q: 'Yeni hasta eklerken hata alıyorum', a: 'Ad Soyad, Hastalık Tanısı ve Risk Eşik Değeri alanlarının dolu olduğundan emin olun. Eşik değeri sayısal bir değer olmalıdır. Sorun devam ederse destek talebi oluşturun.', category: 'Kullanım' },
  { q: 'Bildirimler çalışmıyor', a: 'Tarayıcı bildirim iznini kontrol edin (adres çubuğunun solundaki kilit ikonuna tıklayın). Ayrıca bildirimlerin "Bildirimler" sekmesinde aktif olduğunu doğrulayın.', category: 'Bildirim' },
  { q: 'Raporlar PDF olarak indirilebilir mi?', a: 'Raporlar sekmesinden ilgili raporu seçin ve "PDF İndir" butonuna tıklayın. Tarayıcı yazdırma diyaloğu açılır; "Hedef" olarak "PDF\'e Kaydet" seçeneğini kullanın.', category: 'Raporlar' },
  { q: 'Birden fazla doktor aynı anda sistemi kullanabilir mi?', a: 'Evet. Sistem çoklu kullanıcı desteği sunar. Her doktor kendi rolü ile giriş yapar. Veri çakışmalarını önlemek için aynı hasta kaydı eş zamanlı düzenlenmemelidir.', category: 'Genel' },
  { q: 'Uygulama mobil cihazlarda çalışıyor mu?', a: 'MediTrack PWA olarak tasarlanmıştır. Mobil tarayıcıdan açıp "Ana Ekrana Ekle" seçeneğiyle kurabilirsiniz. Tablet ve telefon ekranlarında tam uyumludur.', category: 'Teknik' },
  { q: 'Hastanın geçmiş ölçüm verilerini nasıl görebilirim?', a: 'Hasta listesinde "Detay" butonuna tıklayın. Açılan modalda "Geçmiş" veya "Grafik" sekmesine geçin. Grafik sayfasında da tüm hastaların zaman serisi verileri görünür.', category: 'Kullanım' },
];

const SYSTEM_STATUS = [
  { name: 'Web Uygulaması',    status: 'operational', uptime: '99.98%' },
  { name: 'Bildirim Servisi',  status: 'operational', uptime: '99.95%' },
  { name: 'Veri Tabanı',       status: 'operational', uptime: '100%'   },
  { name: 'YZ / Analitik',     status: 'degraded',    uptime: '97.2%'  },
  { name: 'SMS Gateway',       status: 'operational', uptime: '99.91%' },
  { name: 'Dosya Depolama',    status: 'operational', uptime: '100%'   },
];

const SUPPORT_TEAM = [
  { name: 'Yazılım Destek Hattı', value: '0850 123 45 67', icon: <Phone size={16}/>, type: 'phone' },
  { name: 'Destek E-posta',       value: 'destek@meditrack.com.tr', icon: <Mail size={16}/>, type: 'email' },
  { name: 'Acil Teknik Destek',   value: '7/24 aktif',  icon: <Zap size={16}/>, type: 'info' },
];

const PRIORITY_OPTIONS = [
  { value: 'low',      label: '🟢 Düşük — Acil değil',          color: '#10b981' },
  { value: 'medium',   label: '🟡 Orta — 1 iş günü içinde',     color: '#f59e0b' },
  { value: 'high',     label: '🔴 Yüksek — Bugün çözülmeli',    color: '#ef4444' },
  { value: 'critical', label: '🚨 Kritik — Sistem kullanılamıyor',color: '#dc2626' },
];

const CATEGORY_OPTIONS = [
  'Teknik Hata', 'Kullanım Sorunu', 'Performans', 'Veri Kaybı',
  'Erişim / Yetki', 'Bildirim Sorunu', 'Raporlama', 'Diğer',
];

const MOCK_TICKETS = [
  { id: 'TKT-1042', title: 'Grafik verileri yüklenmiyor', priority: 'high',   status: 'in_progress', date: '07.07.2026', category: 'Teknik Hata' },
  { id: 'TKT-1038', title: 'PDF raporu boş çıkıyor',     priority: 'medium', status: 'resolved',    date: '05.07.2026', category: 'Raporlama'   },
  { id: 'TKT-1031', title: 'Bildirimler geç geliyor',    priority: 'low',    status: 'closed',      date: '01.07.2026', category: 'Bildirim Sorunu' },
];

/* ─── Status Badge ─── */
const StatusBadge = ({ status }) => {
  const map = {
    operational: { label: 'Çalışıyor',   color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    degraded:    { label: 'Yavaş',       color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    outage:      { label: 'Çevrimdışı',  color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
  };
  const s = map[status] || map.operational;
  return (
    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.color}40` }}>
      {s.label}
    </span>
  );
};

/* ─── Ticket Status Badge ─── */
const TicketBadge = ({ status }) => {
  const map = {
    open:        { label: 'Açık',        color: '#00e5ff', bg: 'rgba(0,229,255,0.1)'   },
    in_progress: { label: 'İşlemde',     color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
    resolved:    { label: 'Çözüldü',     color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
    closed:      { label: 'Kapatıldı',   color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
  };
  const s = map[status] || map.open;
  return (
    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.color}40` }}>
      {s.label}
    </span>
  );
};

/* ─── Canlı Destek Chat ─── */
const LiveSupportChat = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: '👋 Merhaba! MediTrack Teknik Destek ekibine bağlandınız. Size nasıl yardımcı olabilirim?', time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const chatRef               = useRef(null);

  const QUICK_REPLIES = ['Teknik sorun var', 'Nasıl kullanılır?', 'Veri kaybı yaşadım', 'Erişim sorunu'];

  const BOT_RESPONSES = [
    'Sorununuzu anlıyorum. Biraz daha detay verir misiniz? Hangi tarayıcıyı kullanıyorsunuz?',
    'Teşekkür ederim. Ekibimizden bir uzman en geç 5 dakika içinde sizinle iletişime geçecek.',
    'Bu konuda size yardımcı olmaktan mutluluk duyarım. Sorununuzu kayıt altına aldım.',
    'Anlıyorum. Lütfen sistemi yenileyin (F5) ve tekrar deneyin. Sorun devam ederse ekibimize bildirin.',
    'Sorununuz teknik ekibimize iletildi. TKT numaranız e-posta ile gönderilecektir.',
  ];

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { from: 'user', text: msg, time }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        from: 'bot',
        text: BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)],
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', width: '360px', zIndex: 99990 }}>
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '480px', overflow: 'hidden', border: '1px solid rgba(0,229,255,0.3)' }}>
        {/* Header */}
        <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(59,130,246,0.1))', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Headphones size={18} color="#000" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>MediTrack Destek</p>
            <p style={{ fontSize: '0.72rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              Çevrimiçi — Ortalama yanıt: 2dk
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }} className="thin-scroll">
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '80%', padding: '10px 14px', borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.from === 'user' ? 'rgba(0,229,255,0.18)' : 'rgba(255,255,255,0.07)',
                border: `1px solid ${msg.from === 'user' ? 'rgba(0,229,255,0.3)' : 'var(--glass-border)'}`,
                fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5,
              }}>
                {msg.text}
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '3px' }}>{msg.time}</span>
            </div>
          ))}
          {typing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', background: 'rgba(255,255,255,0.07)', borderRadius: '16px 16px 16px 4px', width: 'fit-content', border: '1px solid var(--glass-border)' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
              ))}
            </div>
          )}
        </div>

        {/* Quick replies */}
        <div style={{ padding: '8px 12px', display: 'flex', gap: '6px', flexWrap: 'wrap', borderTop: '1px solid var(--glass-border)' }}>
          {QUICK_REPLIES.map((r, i) => (
            <button key={i} onClick={() => sendMessage(r)}
              style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', border: '1px solid rgba(0,229,255,0.3)', background: 'rgba(0,229,255,0.08)', color: 'var(--primary)', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,229,255,0.08)'}>
              {r}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '10px 12px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '8px' }}>
          <input
            className="glass-input"
            placeholder="Mesajınızı yazın..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            style={{ flex: 1, padding: '9px 12px', fontSize: '0.85rem' }}
          />
          <button onClick={() => sendMessage()}
            style={{ padding: '9px 14px', borderRadius: '8px', background: 'var(--primary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#000', transition: 'all 0.2s' }}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   ANA SUPPORT CENTER COMPONENT
════════════════════════════════════════════ */
const SupportCenter = ({ addNotification, addToast }) => {
  const [activeTab, setActiveTab]     = useState('ticket');
  const [openFaq, setOpenFaq]         = useState(null);
  const [showChat, setShowChat]       = useState(false);
  const [faqSearch, setFaqSearch]     = useState('');
  const [ticketSent, setTicketSent]   = useState(false);
  const [rating, setRating]           = useState(0);
  const [tickets, setTickets]         = useState(MOCK_TICKETS);
  const [form, setForm] = useState({
    title: '', category: CATEGORY_OPTIONS[0], priority: 'medium',
    description: '', contact: '', attachment: '',
  });

  const filteredFaq = FAQ.filter(f =>
    !faqSearch || f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    const newTicket = {
      id: `TKT-${1043 + tickets.length}`,
      title: form.title,
      priority: form.priority,
      status: 'open',
      date: new Date().toLocaleDateString('tr-TR'),
      category: form.category,
    };
    setTickets(prev => [newTicket, ...prev]);
    setTicketSent(true);
    if (addToast)   addToast('success', `✅ Destek talebiniz oluşturuldu: ${newTicket.id}`);
    if (addNotification) addNotification('success', `Yeni destek talebi: ${newTicket.id}`);
  };

  const TABS = [
    { key: 'ticket',  label: 'Destek Talebi', icon: <FileText size={16} /> },
    { key: 'history', label: 'Taleplerim',    icon: <Clock size={16} /> },
    { key: 'faq',     label: 'Sık Sorulanlar',icon: <MessageSquare size={16} /> },
    { key: 'status',  label: 'Sistem Durumu', icon: <Activity size={16} /> },
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px', position: 'relative' }}>

      {/* ─── Başlık ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
            <div style={{ padding: '10px', background: 'rgba(0,229,255,0.15)', borderRadius: '12px', border: '1px solid rgba(0,229,255,0.3)' }}>
              <Headphones size={26} style={{ color: 'var(--primary)' }} />
            </div>
            Yazılım Destek Merkezi
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Teknik sorunlarınız, kullanım sorularınız ve önerileriniz için buradayız.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {SUPPORT_TEAM.slice(0,2).map((s, i) => (
            <a key={i} href={s.type === 'phone' ? `tel:${s.value}` : s.type === 'email' ? `mailto:${s.value}` : '#'}
              style={{ padding: '10px 16px', borderRadius: '10px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,229,255,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
              <span style={{ color: 'var(--primary)' }}>{s.icon}</span> {s.value}
            </a>
          ))}
          <button onClick={() => setShowChat(true)}
            style={{ padding: '10px 18px', borderRadius: '10px', background: 'rgba(0,229,255,0.15)', border: '1px solid rgba(0,229,255,0.4)', color: 'var(--primary)', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', animation: 'buttonPulse 3s infinite' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,229,255,0.15)'}>
            <MessageSquare size={16} /> Canlı Destek
          </button>
        </div>
      </div>

      {/* ─── Hızlı Bilgi Kartları ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { icon: <Clock size={22} />,    label: 'Yanıt Süresi',     value: '< 2 saat',  color: 'var(--success)',   bg: 'rgba(16,185,129,0.15)'  },
          { icon: <Shield size={22} />,   label: 'Aktif Talepler',   value: tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length, color: 'var(--warning)', bg: 'rgba(245,158,11,0.15)' },
          { icon: <CheckCircle size={22}/>,label: 'Çözüm Oranı',    value: '%98.5',     color: 'var(--primary)',   bg: 'rgba(0,229,255,0.12)'   },
        ].map((card, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '50%', background: card.bg, flexShrink: 0 }}>
              <span style={{ color: card.color }}>{card.icon}</span>
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2px' }}>{card.label}</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: card.color }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Tab Navigasyonu ─── */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--glass-bg)', borderRadius: '12px', padding: '5px', border: '1px solid var(--glass-border)', marginBottom: '24px', flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, minWidth: '120px', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontSize: '0.88rem',
              background: activeTab === tab.key ? 'rgba(0,229,255,0.18)' : 'transparent',
              color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === tab.key ? 700 : 400, transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
              borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
            }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ══════ TAB: YENİ TALEP ══════ */}
      {activeTab === 'ticket' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Form */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            {ticketSent ? (
              <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle size={32} style={{ color: 'var(--success)' }} />
                </div>
                <h3 style={{ color: 'var(--success)', fontSize: '1.4rem', marginBottom: '10px' }}>Talebiniz Alındı!</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Destek ekibimiz en kısa sürede sizinle iletişime geçecek.
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '28px' }}>
                  Takip numaranızı e-posta ile gönderdik.
                </p>
                {/* Memnuniyet puanı */}
                <div style={{ marginBottom: '28px' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '10px' }}>Destek kalitemizi değerlendirin:</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => { setRating(s); if(addToast) addToast('success','⭐ Değerlendirmeniz için teşekkürler!'); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <Star size={28} fill={s <= rating ? '#f59e0b' : 'none'} style={{ color: s <= rating ? '#f59e0b' : 'var(--text-muted)' }} />
                      </button>
                    ))}
                  </div>
                </div>
                <button className="glass-button primary" onClick={() => { setTicketSent(false); setForm({ title:'', category:CATEGORY_OPTIONS[0], priority:'medium', description:'', contact:'', attachment:'' }); setRating(0); }}>
                  <PlusCircle size={16} /> Yeni Talep Oluştur
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PlusCircle size={18} style={{ color: 'var(--primary)' }} /> Yeni Destek Talebi
                </h3>
                <form onSubmit={handleSubmitTicket} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '7px', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>Sorun Başlığı *</label>
                    <input className="glass-input" required placeholder="Sorununuzu kısaca özetleyin..."
                      value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '7px', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>Kategori</label>
                      <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                        {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '7px', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>Öncelik</label>
                      <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                        {PRIORITY_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '7px', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>Açıklama *</label>
                    <textarea className="glass-input" required rows={5} placeholder="Sorununuzu detaylıca açıklayın. Hangi adımları izlediniz? Hata mesajı aldıysanız buraya yazın..."
                      value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                      style={{ resize: 'vertical', minHeight: '120px', lineHeight: 1.6 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '7px', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>İletişim E-posta</label>
                    <input className="glass-input" type="email" placeholder="cevap@hastane.com"
                      value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '4px' }}>
                    <button type="button" className="glass-button" onClick={() => setForm({ title:'', category:CATEGORY_OPTIONS[0], priority:'medium', description:'', contact:'', attachment:'' })}>
                      Temizle
                    </button>
                    <button type="submit" className="glass-button primary" style={{ padding: '11px 24px' }}>
                      <Send size={16} /> Talebi Gönder
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Sağ Panel: İpuçları + İletişim */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* İpuçları */}
            <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(0,229,255,0.2)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '14px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={16} /> Talep Öncesi Kontrol Listesi
              </h4>
              {['Sayfayı yenileyin (F5)', 'Tarayıcı önbelleğini temizleyin', 'Başka bir tarayıcı deneyin', 'Bildirimlerin açık olduğunu kontrol edin', 'SSS bölümünü inceleyin'].map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                  <CheckCircle size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  {tip}
                </div>
              ))}
            </div>

            {/* İletişim Bilgileri */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '14px', fontSize: '0.9rem' }}>📞 Hızlı İletişim</h4>
              {SUPPORT_TEAM.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)' }}>
                  <span style={{ color: 'var(--primary)' }}>{s.icon}</span>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.name}</p>
                    <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Çalışma Saatleri */}
            <div className="glass-panel" style={{ padding: '20px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <h4 style={{ color: 'var(--success)', marginBottom: '12px', fontSize: '0.9rem' }}>🕐 Destek Saatleri</h4>
              {[
                { day: 'Pzt – Cum', time: '08:00 – 22:00', active: true },
                { day: 'Cmt – Paz', time: '09:00 – 18:00', active: true },
                { day: 'Acil Hat', time: '7/24', active: true },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.83rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{row.day}</span>
                  <span style={{ color: row.active ? 'var(--success)' : 'var(--text-muted)', fontWeight: 600 }}>{row.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════ TAB: TALEPLERİM ══════ */}
      {activeTab === 'history' && (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Destek Talebi Geçmişi</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tickets.length} talep</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Outfit, sans-serif' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                {['ID', 'Başlık', 'Kategori', 'Öncelik', 'Durum', 'Tarih'].map(col => (
                  <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.73rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', background: 'rgba(255,255,255,0.02)' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map((t, i) => {
                const pColor = t.priority === 'critical' ? '#dc2626' : t.priority === 'high' ? '#ef4444' : t.priority === 'medium' ? '#f59e0b' : '#10b981';
                return (
                  <tr key={t.id}
                    style={{ borderBottom: i < tickets.length - 1 ? '1px solid var(--glass-border)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700, fontFamily: 'monospace' }}>{t.id}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.87rem', color: 'var(--text-main)', fontWeight: 500 }}>{t.title}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 9px', borderRadius: '20px', fontSize: '0.74rem', background: 'rgba(59,130,246,0.12)', color: 'var(--secondary)', border: '1px solid rgba(59,130,246,0.25)' }}>
                        {t.category}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 9px', borderRadius: '20px', fontSize: '0.74rem', background: `${pColor}18`, color: pColor, border: `1px solid ${pColor}40`, fontWeight: 700 }}>
                        {PRIORITY_OPTIONS.find(p => p.value === t.priority)?.label.split('—')[0].trim()}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}><TicketBadge status={t.status} /></td>
                    <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{t.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ══════ TAB: SSS ══════ */}
      {activeTab === 'faq' && (
        <div>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="glass-input" placeholder="Soru veya anahtar kelime ara..."
              style={{ paddingLeft: '42px', fontSize: '0.9rem', padding: '12px 16px 12px 42px' }}
              value={faqSearch} onChange={e => setFaqSearch(e.target.value)} />
          </div>

          {filteredFaq.length === 0 ? (
            <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Search size={32} style={{ opacity: 0.4, marginBottom: '12px' }} />
              <p>Bu arama için sonuç bulunamadı.</p>
              <button className="glass-button primary" style={{ marginTop: '16px' }} onClick={() => { setFaqSearch(''); setActiveTab('ticket'); }}>
                Destek Talebi Oluştur
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredFaq.map((faq, i) => (
                <div key={i} className="glass-panel" style={{ overflow: 'hidden', transition: 'all 0.2s' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', padding: '18px 20px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ padding: '3px 9px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(0,229,255,0.1)', color: 'var(--primary)', border: '1px solid rgba(0,229,255,0.25)', flexShrink: 0 }}>
                        {faq.category}
                      </span>
                      <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>{faq.q}</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'none' }}>
                      <ChevronDown size={18} />
                    </span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 20px 18px 20px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                      <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.88rem' }}>{faq.a}</p>
                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Bu cevap işe yaradı mı?</span>
                        <button onClick={() => { if(addToast) addToast('success', '👍 Geri bildiriminiz için teşekkürler!'); }}
                          style={{ padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)', color: 'var(--success)', cursor: 'pointer', fontSize: '0.76rem', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ThumbsUp size={12} /> Evet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════ TAB: SİSTEM DURUMU ══════ */}
      {activeTab === 'status' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'flex-start' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Server size={18} style={{ color: 'var(--primary)' }} /> Servis Durumları
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--success)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', animation: 'pulse 2s infinite' }} />
                Son güncelleme: {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SYSTEM_STATUS.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '10px', background: s.status === 'degraded' ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.04)', border: `1px solid ${s.status === 'degraded' ? 'rgba(245,158,11,0.2)' : 'var(--glass-border)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.status === 'operational' ? 'var(--success)' : s.status === 'degraded' ? 'var(--warning)' : 'var(--danger)', boxShadow: `0 0 8px ${s.status === 'operational' ? 'rgba(16,185,129,0.5)' : 'rgba(245,158,11,0.5)'}` }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>{s.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Uptime: {s.uptime}</span>
                    <StatusBadge status={s.status} />
                  </div>
                </div>
              ))}
            </div>

            {/* Genel durum banner */}
            <div style={{ marginTop: '20px', padding: '14px 16px', borderRadius: '10px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle size={20} style={{ color: 'var(--success)', flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.9rem' }}>Sistemler Genel Olarak Çalışıyor</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>YZ/Analitik servisi yoğun trafik nedeniyle yavaş yanıt veriyor. Ekibimiz çalışıyor.</p>
              </div>
            </div>
          </div>

          {/* Sağ: Son Olaylar */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} style={{ color: 'var(--primary)' }} /> Son Olaylar
            </h4>
            {[
              { date: '07.07 11:00', text: 'YZ servisi yüksek yük nedeniyle yavaşladı', type: 'warning' },
              { date: '07.07 09:30', text: 'Planlı bakım tamamlandı, tüm servisler aktif', type: 'success' },
              { date: '06.07 22:00', text: 'Planlı bakım başladı (30 dk)', type: 'info' },
              { date: '05.07 14:20', text: 'SMS servisi geçici kesinti — çözüldü', type: 'success' },
              { date: '01.07 10:00', text: 'v11.0 güncellemesi yayına alındı', type: 'info' },
            ].map((ev, i) => {
              const c = ev.type === 'warning' ? '#f59e0b' : ev.type === 'success' ? '#10b981' : '#00e5ff';
              return (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '14px', paddingBottom: '14px', borderBottom: i < 4 ? '1px solid var(--glass-border)' : 'none' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c, marginTop: '6px', flexShrink: 0, boxShadow: `0 0 6px ${c}` }} />
                  <div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.4 }}>{ev.text}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>{ev.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Canlı Destek Chat ─── */}
      {showChat && <LiveSupportChat onClose={() => setShowChat(false)} />}

      {/* ─── Sabit Canlı Destek Butonu (chat kapalıysa) ─── */}
      {!showChat && (
        <button onClick={() => setShowChat(true)}
          style={{
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 9998,
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), #0284c7)',
            border: '2px solid rgba(0,229,255,0.4)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 24px rgba(0,229,255,0.4)',
            animation: 'buttonPulse 3s infinite', transition: 'transform 0.2s',
          }}
          title="Canlı Destek"
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <Headphones size={22} color="#000" />
        </button>
      )}
    </div>
  );
};

export default SupportCenter;
