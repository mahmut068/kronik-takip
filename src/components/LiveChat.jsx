import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Circle } from 'lucide-react';

const BOT_RESPONSES = {
  'iyi': 'Güzel! Değerlerinizin stabil olduğunu görüyorum. Egzersiz rutininize devam edin.',
  'kötü': 'Üzgünüm, duyduğuma. Lütfen durumunuzu biraz daha açar mısınız? İlaçlarınızı aldınız mı?',
  'baş ağrısı': 'Baş ağrısı tansiyonla ilişkili olabilir. Ölçümünüzü yapıp sonucu girin, doktorunuz değerlendirecek.',
  'ilaç': 'İlaç hatırlatıcılarınız sisteme kayıtlıdır. Düzenli kullanmaya devam edin.',
  'yorgun': 'Yorgunluk hissediyorsanız, kan değerlerinizi kontrol etmenizi öneririm.',
  'teşekkür': 'Ne demek, sağlığınız bizim önceliğimiz! Başka sorunuz var mı?',
};

const getAutoResponse = (text) => {
  const lower = text.toLowerCase();
  for (const [key, val] of Object.entries(BOT_RESPONSES)) {
    if (lower.includes(key)) return val;
  }
  return 'Mesajınız doktorunuza iletildi. En kısa sürede dönüş yapılacaktır. Acil durumlarda lütfen bizi arayın.';
};

const LiveChat = ({ patients }) => {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [conversations, setConversations] = useState({});
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const patient = patients.find(p => p.id === parseInt(selectedPatientId));
  const messages = conversations[selectedPatientId] || [
    { id: 1, sender: 'system', text: `${patient?.name || 'Hasta'} ile mesajlaşma kanalı açık. Doktor olarak mesaj gönderebilirsiniz.`, time: new Date().toLocaleTimeString() }
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations[selectedPatientId]?.length, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !patient) return;

    const doctorMsg = { id: Date.now(), sender: 'doctor', text: inputText, time: new Date().toLocaleTimeString() };
    const userInput = inputText;
    setInputText('');

    setConversations(prev => ({
      ...prev,
      [selectedPatientId]: [...(prev[selectedPatientId] || messages), doctorMsg]
    }));

    // Simulate patient auto-response
    setIsTyping(true);
    setTimeout(() => {
      const patientReply = {
        id: Date.now() + 1,
        sender: 'patient',
        text: getAutoResponse(userInput),
        time: new Date().toLocaleTimeString()
      };
      setIsTyping(false);
      setConversations(prev => ({
        ...prev,
        [selectedPatientId]: [...(prev[selectedPatientId] || messages), doctorMsg, patientReply]
      }));
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <MessageSquare size={36} color="var(--primary)" /> Canlı Mesajlaşma
      </h1>
      <p className="text-muted" style={{ marginBottom: '20px' }}>Hastalarla anlık güvenli mesajlaşma kanalı.</p>

      {/* Layout */}
      <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: 0 }}>
        {/* Patient List Sidebar */}
        <div className="glass-panel" style={{ width: '220px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flexShrink: 0 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Hastalar</p>
          {patients.map(p => (
            <button key={p.id} onClick={() => setSelectedPatientId(p.id)}
              style={{ background: parseInt(selectedPatientId) === p.id ? 'rgba(0,229,255,0.15)' : 'transparent', border: `1px solid ${parseInt(selectedPatientId) === p.id ? 'var(--primary)' : 'transparent'}`, borderRadius: '10px', padding: '12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0,229,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1rem' }}>{p.name[0]}</span>
                </div>
                <div>
                  <p style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '0.9rem' }}>{p.name.split(' ')[0]}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Circle size={8} fill={p.status === 'danger' ? '#ef4444' : '#10b981'} color="transparent" />
                    <span style={{ fontSize: '0.75rem', color: p.status === 'danger' ? '#ef4444' : '#10b981' }}>
                      {p.status === 'danger' ? 'Riskli' : 'Stabil'}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Chat Window */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
          {/* Chat Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(0,0,0,0.1)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(0,229,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.1rem' }}>{patient?.name[0]}</span>
            </div>
            <div>
              <p style={{ fontWeight: '600', color: 'var(--text-main)' }}>{patient?.name}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Circle size={8} fill="#10b981" color="transparent" />
                <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Çevrimiçi</span>
              </div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '4px 12px', borderRadius: '20px' }}>
              🔒 Şifreli Kanal
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map(msg => (
              <div key={msg.id} className="animate-fade-in" style={{ display: 'flex', justifyContent: msg.sender === 'doctor' ? 'flex-end' : msg.sender === 'system' ? 'center' : 'flex-start' }}>
                {msg.sender === 'system' ? (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 14px', borderRadius: '20px' }}>{msg.text}</span>
                ) : (
                  <div style={{ maxWidth: '70%' }}>
                    <div style={{
                      padding: '12px 16px', borderRadius: msg.sender === 'doctor' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.sender === 'doctor' ? 'var(--primary-dark)' : 'rgba(255,255,255,0.1)',
                      color: '#fff', fontSize: '0.95rem', lineHeight: 1.5
                    }}>
                      {msg.text}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: msg.sender === 'doctor' ? 'right' : 'left' }}>
                      {msg.sender === 'doctor' ? '👨‍⚕️ Doktor' : `🧑 ${patient?.name.split(' ')[0]}`} · {msg.time}
                    </p>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)', animation: `pulse 1s ${delay}s infinite` }} />
                  ))}
                </div>
                {patient?.name.split(' ')[0]} yazıyor...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: '16px 20px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '12px', background: 'rgba(0,0,0,0.1)' }}>
            <input type="text" className="glass-input" placeholder={`${patient?.name || 'Hastaya'} mesaj gönderin...`}
              value={inputText} onChange={e => setInputText(e.target.value)} style={{ flex: 1 }} />
            <button type="submit" className="glass-button primary" style={{ padding: '12px 20px' }}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
