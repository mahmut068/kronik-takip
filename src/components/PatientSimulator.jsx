import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Mic, Send, Volume2, Zap, AlertTriangle, RefreshCw } from 'lucide-react';

const VoiceWaves = () => (
  <div className="voice-wave-container">
    {Array(9).fill(0).map((_, i) => (
      <div key={i} className="voice-bar" />
    ))}
  </div>
);

/* Risk senaryoları tablosu */
const RISK_SCENARIOS = [
  { diseaseHint: 'Hipertansiyon', valueRange: [145, 185], label: 'Yüksek Tansiyon Krizi' },
  { diseaseHint: 'Diyabet',       valueRange: [210, 280], label: 'Hiperglisemi Atağı'   },
  { diseaseHint: 'Kalp',          valueRange: [105, 130], label: 'Kalp Yetmezliği Kötüleşme' },
  { diseaseHint: null,            valueRange: [999, 999], label: 'Genel Kritik Durum'   },
];

const getRandInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const PatientSimulator = ({ patients, onSubmit, addToast }) => {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [inputValue,        setInputValue]         = useState('');
  const [chatHistory,       setChatHistory]        = useState([]);
  const [speakingIdx,       setSpeakingIdx]        = useState(null);
  const [isRingingAlarm,    setIsRingingAlarm]     = useState(false);
  const [isSimulating,      setIsSimulating]       = useState(false);
  const [lastScenario,      setLastScenario]       = useState(null);
  const chatRef = useRef(null);

  const activePatient = patients.find(p => p.id === parseInt(selectedPatientId));

  /* Sohbet alanını otomatik aşağı kaydır */
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    const ap = patients.find(p => p.id === parseInt(selectedPatientId));
    if (ap) {
      const initialQuestion = ap.questions[0] || 'Merhaba, bugünkü değerlerinizi paylaşır mısınız?';
      setChatHistory([{ sender: 'bot', text: initialQuestion }]);
      setSpeakingIdx(0);
      setIsRingingAlarm(false);
      const t = setTimeout(() => setSpeakingIdx(null), 3000);

      if (ap.status === 'danger') {
        setTimeout(() => {
          setIsRingingAlarm(true);
          setChatHistory(prev => [...prev, {
            sender: 'bot',
            text: '🚨 DİKKAT: Ölçümünüz eşik değerin çok üzerinde! Hayati risk taşıyor. Sizi derhal hastaneye bekliyoruz, acil durum ekipleri bilgilendirildi.',
            isUrgent: true,
          }]);
          setSpeakingIdx(1);
          setTimeout(() => setSpeakingIdx(null), 5000);
        }, 500);
      }
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatientId, patients]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !activePatient) return;
    setChatHistory(prev => [...prev, { sender: 'user', text: inputValue }]);
    onSubmit(activePatient.id, inputValue);
    setInputValue('');
  };

  /* ─── Rastgele Risk Senaryosu Üret ─── */
  const handleRandomRisk = () => {
    if (!patients || patients.length === 0) return;
    setIsSimulating(true);

    // Hasta seç — öncelikli olarak eşiğe yakın olanı
    const targetPatient = patients[getRandInt(0, patients.length - 1)];

    // Senaryoya göre değer üret
    const scenario = RISK_SCENARIOS[getRandInt(0, RISK_SCENARIOS.length - 2)]; // son genel senaryoyu hariç tut
    const criticalValue = getRandInt(
      Math.round(targetPatient.threshold * 1.1),
      Math.round(targetPatient.threshold * 1.4)
    );

    // Simülatörde bu hastayı seç
    setSelectedPatientId(String(targetPatient.id));

    // 600ms sonra değeri gönder (gerçekçi gecikme)
    setTimeout(() => {
      onSubmit(targetPatient.id, criticalValue);

      const scenarioLabel = scenario.label;
      setLastScenario({ patient: targetPatient.name, value: criticalValue, label: scenarioLabel });

      // Sohbete kritik yanıt ekle
      setChatHistory(prev => [
        ...prev,
        { sender: 'user', text: String(criticalValue) },
        {
          sender: 'bot',
          text: `🚨 KRİTİK: ${scenarioLabel} tespit edildi! Değer: ${criticalValue} (Eşik: ${targetPatient.threshold}). Acil protokol başlatıldı.`,
          isUrgent: true,
        },
      ]);
      setIsRingingAlarm(true);

      // Toast bildirim
      if (addToast) {
        addToast('danger', `🚨 ${targetPatient.name} — ${scenarioLabel}: ${criticalValue} (Eşik: ${targetPatient.threshold})`);
      }

      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

      {/* ─── Sol Bilgi Paneli ─── */}
      <div style={{ flex: 1, minWidth: '280px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', color: 'var(--text-main)' }}>Hasta Simülatörü</h1>
        <p className="text-muted" style={{ marginBottom: '28px', lineHeight: 1.6 }}>
          Hastanın sistemle olan etkileşimini (SMS veya Sesli Çağrı) simüle edin.
          Okuma yazma bilmeyen hastalar için sesli asistan devreye girer.
        </p>

        {/* Hasta seçici */}
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Simüle Edilecek Hastayı Seçin
          </label>
          <select
            className="glass-input"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', width: '100%' }}
            value={selectedPatientId}
            onChange={e => setSelectedPatientId(e.target.value)}
          >
            <option value="">-- Hasta Seçin --</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.disease} ({p.literacy ? 'SMS' : 'Sesli'})
              </option>
            ))}
          </select>
        </div>

        {/* Sistem bilgi kutusu */}
        {activePatient && (
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '14px', color: 'var(--primary)', fontSize: '0.95rem' }}>Sistem Bilgisi</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}><strong>Hasta:</strong> {activePatient.name}</li>
              <li style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}><strong>Hastalık:</strong> {activePatient.disease}</li>
              <li style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
                <strong>İletişim:</strong>{' '}
                {activePatient.literacy
                  ? <span style={{ color: 'var(--primary)' }}>✉️ Yazılı SMS</span>
                  : <span style={{ color: 'var(--warning)' }}>🔊 Sesli Bot</span>}
              </li>
              <li style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
                <strong>Kritik Eşik:</strong>{' '}
                <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>{activePatient.threshold}</span>
              </li>
            </ul>
          </div>
        )}

        {/* ─── Rastgele Risk Senaryosu Butonu ─── */}
        <div className="glass-panel" style={{
          padding: '20px',
          border: '1px solid rgba(239,68,68,0.3)',
          background: 'rgba(239,68,68,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Zap size={18} style={{ color: 'var(--danger)' }} />
            <h4 style={{ color: 'var(--danger)', fontSize: '0.92rem', fontWeight: 700 }}>Risk Simülasyonu</h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.5 }}>
            Rastgele bir hasta için kritik eşik üstü değer üretir. Riskli/Acil sayacı artar ve toast bildirimi fırlar.
          </p>
          <button
            onClick={handleRandomRisk}
            disabled={isSimulating || patients.length === 0}
            style={{
              width: '100%', padding: '12px', borderRadius: '10px',
              background: isSimulating ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.18)',
              border: '1px solid rgba(239,68,68,0.5)',
              color: isSimulating ? 'var(--text-muted)' : 'var(--danger)',
              fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem',
              cursor: isSimulating ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => { if (!isSimulating) e.currentTarget.style.background = 'rgba(239,68,68,0.28)'; }}
            onMouseLeave={e => { if (!isSimulating) e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
          >
            {isSimulating
              ? <><RefreshCw size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Simüle ediliyor...</>
              : <><AlertTriangle size={16} /> Rastgele Risk Senaryosu Üret</>}
          </button>

          {/* Son senaryo bilgisi */}
          {lastScenario && (
            <div style={{
              marginTop: '12px', padding: '10px 12px', borderRadius: '8px',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              fontSize: '0.78rem', color: 'var(--text-muted)',
            }}>
              <strong style={{ color: 'var(--danger)' }}>Son:</strong>{' '}
              {lastScenario.patient} — {lastScenario.label} ({lastScenario.value})
            </div>
          )}
        </div>
      </div>

      {/* ─── Telefon Simülatörü ─── */}
      <div style={{ display: 'flex', justifyContent: 'center', flex: 1, minWidth: '300px' }}>
        <div
          className={`phone-simulator ${isRingingAlarm ? 'alarm-shake' : ''}`}
          style={isRingingAlarm
            ? { boxShadow: '0 0 40px rgba(239,68,68,0.6)', border: '2px solid rgba(239,68,68,0.8)' }
            : {}}
        >
          {/* Status Bar */}
          <div className="phone-header"
            style={{ background: isRingingAlarm ? '#ef4444' : (activePatient && !activePatient.literacy ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.07)') }}>
            <Smartphone size={20} color="#fff" style={{ marginRight: '10px' }} />
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>
              {activePatient
                ? (activePatient.literacy ? '💬 SMS: Sağlık Sistemi' : '🔊 Sesli Asistan')
                : 'Bekleniyor...'}
            </span>
          </div>

          {/* Chat alanı */}
          <div className="chat-container" id="chat-container" ref={chatRef}>
            {!activePatient && (
              <div style={{ textAlign: 'center', marginTop: '60px', color: 'rgba(255,255,255,0.3)' }}>
                <Smartphone size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                <p>Sol taraftan hasta seçin.</p>
              </div>
            )}

            {activePatient && chatHistory.map((chat, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: chat.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div
                  className={`chat-bubble ${chat.sender} animate-fade-in`}
                  style={chat.isUrgent ? { backgroundColor: 'var(--danger)', color: '#fff', fontWeight: 'bold' } : {}}
                >
                  {chat.sender === 'bot' && activePatient && !activePatient.literacy && !chat.isUrgent && (
                    <Volume2 size={14} style={{ verticalAlign: 'middle', marginRight: '5px', opacity: 0.7 }} />
                  )}
                  {chat.text}
                </div>
                {chat.sender === 'bot' && activePatient && !activePatient.literacy && !chat.isUrgent && speakingIdx === idx && (
                  <div className="animate-fade-in" style={{ marginLeft: '4px', marginTop: '-4px' }}>
                    <VoiceWaves />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Formu */}
          {activePatient && (
            <form
              onSubmit={handleSubmit}
              style={{
                position: 'absolute', bottom: 0, width: '100%',
                background: 'rgba(0,0,0,0.7)', padding: '12px 16px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', gap: '8px',
              }}
            >
              <input
                type="number"
                className="glass-input"
                placeholder="Ölçüm değerini girin..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                style={{ padding: '8px 12px', flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' }}
              />
              <button
                type="submit"
                className="glass-button primary"
                style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {!activePatient.literacy ? <Mic size={18} /> : <Send size={18} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientSimulator;
