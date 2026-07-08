import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, AlertTriangle, CheckCircle, Activity, RotateCcw, Copy } from 'lucide-react';

// ── Kural tabanlı simüle AI motoru ──
const AI_KNOWLEDGE = {
  symptoms: {
    'baş ağrısı': { conditions: ['Hipertansiyon', 'Migren', 'Gerilim Baş Ağrısı'], urgency: 'medium' },
    'göğüs ağrısı': { conditions: ['Akut Miyokard Enfarktüsü', 'Angina Pektoris', 'GERD'], urgency: 'high' },
    'nefes darlığı': { conditions: ['Kalp Yetmezliği', 'KOAH', 'Astım', 'Pulmoner Emboli'], urgency: 'high' },
    'çarpıntı': { conditions: ['Atriyal Fibrilasyon', 'Taşikardi', 'Anemi', 'Hipertiroidi'], urgency: 'medium' },
    'yorgunluk': { conditions: ['Anemi', 'Hipotiroidizm', 'Diyabet', 'Depresyon'], urgency: 'low' },
    'poliüri': { conditions: ['Diyabet Mellitus', 'Diyabetes İnsipidus', 'Böbrek Hastalığı'], urgency: 'medium' },
    'ödem': { conditions: ['Kalp Yetmezliği', 'Böbrek Yetmezliği', 'Hipoalbüminemi'], urgency: 'medium' },
    'sarılık': { conditions: ['Hepatit', 'Kolesistit', 'Pankreas Kanseri'], urgency: 'high' },
    'ateş': { conditions: ['Enfeksiyon', 'Viral Hastalık', 'Otoimmün Hastalık'], urgency: 'medium' },
    'kilo kaybı': { conditions: ['Kanser', 'Hipertiroidi', 'Diyabet', 'TBC'], urgency: 'high' },
  },
  drugs: {
    'metformin': { class: 'Biguanid', use: 'Tip 2 Diyabet', interactions: ['Alkol', 'Furosemid', 'Kontras Madde'], dose: '500-2000mg/gün' },
    'amlodipine': { class: 'Kalsiyum Kanal Bloköörü', use: 'Hipertansiyon', interactions: ['Digoksin', 'Siklosporin'], dose: '5-10mg/gün' },
    'furosemid': { class: 'Loop Diüretik', use: 'Ödem, Kalp Yetmezliği', interactions: ['Metformin', 'Digoksin', 'NSAID'], dose: '20-80mg/gün' },
    'warfarin': { class: 'K Vitamini Antagonisti', use: 'Antikoagülasyon', interactions: ['Aspirin', 'NSAID', 'Antibiyotikler'], dose: 'INR hedefine göre' },
    'aspirin': { class: 'NSAID/Antiplatelet', use: 'Kardiyoprofilaksi', interactions: ['Warfarin', 'NSAID', 'ACE İnhibitörleri'], dose: '75-325mg/gün' },
    'lisinopril': { class: 'ACE İnhibitörü', use: 'Hipertansiyon, Kalp Yetmezliği', interactions: ['Potasyum tutucu diüretikler', 'NSAID'], dose: '5-40mg/gün' },
    'atorvastatin': { class: 'Statin', use: 'Hiperlipidemi', interactions: ['Siklosporin', 'Antifungaller', 'Eritromisin'], dose: '10-80mg/gün' },
    'omeprazol': { class: 'PPI', use: 'Peptik Ülser, GERD', interactions: ['Klopidogrel', 'Metotreksat'], dose: '20-40mg/gün' },
  },
  protocols: {
    'hipertansiyon': ['Yaşam tarzı değişikliği (diyet, egzersiz, tuz kısıtlaması)', 'İlk basamak: Tiazid diüretik veya ACE İnhibitörü', 'Hedef KB: <130/80 mmHg', 'Günlük ev tansiyonu takibi', '3 ayda bir kontrol'],
    'diyabet': ['HbA1c hedefi: <%7 (bireyselleştirilebilir)', 'Metformin ilk basamak tedavi', 'SGLT2 inhibitörü veya GLP-1 RA değerlendirin', '3 ayda bir HbA1c, yıllık böbrek/göz muayenesi', 'Kan şekeri günlük takip'],
    'kalp yetmezliği': ['ACE İnhibitörü + Beta Bloker + Diüretik üçlüsü', 'LVEF <40%: ARNI değerlendirin', 'SGLT2 inhibitörü ekleyin', 'Günlük kilo takibi (>2kg artış = uyarı)', 'Sodyum kısıtlaması <2g/gün'],
    'koah': ['GOLD sınıflamasına göre tedavi', 'SABA başlangıç', 'Orta-ağır: LAMA ± LABA', 'Yıllık grip aşısı', 'Sigarayı bırakma desteği zorunlu'],
  }
};

const QUICK_PROMPTS = [
  '🩺 Göğüs ağrısı olan hastada ayırıcı tanı nedir?',
  '💊 Metformin + Furosemid etkileşimini açıkla',
  '📋 Hipertansiyon tedavi protokolü nedir?',
  '🔴 Diyabetik hastada acil belirtiler nelerdir?',
  '❤️ Kalp yetmezliği yönetim rehberi',
  '💉 Warfarin başlangıç dozu nasıl belirlenir?',
];

const analyzeQuery = (query) => {
  const q = query.toLowerCase();
  const results = [];

  // Semptom analizi
  for (const [symptom, data] of Object.entries(AI_KNOWLEDGE.symptoms)) {
    if (q.includes(symptom)) {
      results.push({
        type: 'diagnosis',
        title: `🔍 Semptom Analizi: ${symptom}`,
        urgency: data.urgency,
        content: data.conditions,
        symptom,
      });
    }
  }

  // İlaç analizi
  for (const [drug, data] of Object.entries(AI_KNOWLEDGE.drugs)) {
    if (q.includes(drug)) {
      results.push({
        type: 'drug',
        title: `💊 İlaç Bilgisi: ${drug.charAt(0).toUpperCase() + drug.slice(1)}`,
        content: data,
      });
    }
  }

  // Protokol
  for (const [condition, steps] of Object.entries(AI_KNOWLEDGE.protocols)) {
    if (q.includes(condition)) {
      results.push({
        type: 'protocol',
        title: `📋 Tedavi Protokolü: ${condition.charAt(0).toUpperCase() + condition.slice(1)}`,
        content: steps,
      });
    }
  }

  // Genel yanıt
  if (results.length === 0) {
    results.push({
      type: 'general',
      title: '🤖 MediAI Yanıtı',
      content: 'Bu konu için spesifik bir protokol bulunamadı. Lütfen semptom adı, ilaç adı veya hastalık adı içeren daha spesifik bir soru sorun. Örn: "göğüs ağrısı", "metformin", "hipertansiyon protokolü".',
    });
  }

  return results;
};

const urgencyColor = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--success)' };
const urgencyLabel = { high: '🔴 Acil', medium: '🟡 Orta', low: '🟢 Düşük' };

const MessageBubble = ({ msg }) => {
  const [copied, setCopied] = useState(false);

  const copyText = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  if (msg.role === 'user') return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
      <div style={{ maxWidth: '70%', padding: '12px 18px', borderRadius: '18px 18px 4px 18px', background: 'var(--primary)', color: '#fff', fontSize: '0.95rem', lineHeight: 1.5 }}>
        {msg.text}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'flex-start' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Bot size={18} color="#fff" />
      </div>
      <div style={{ flex: 1 }}>
        {msg.loading ? (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '14px 18px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px 18px 18px 18px', width: 'fit-content' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {msg.results?.map((result, ri) => (
              <div key={ri} className="glass-panel" style={{ padding: '16px', borderRadius: '4px 18px 18px 18px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>{result.title}</h4>
                  <button onClick={() => copyText(JSON.stringify(result.content, null, 2))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
                    {copied ? <CheckCircle size={14} color="var(--success)" /> : <Copy size={14} />}
                  </button>
                </div>

                {result.type === 'diagnosis' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', padding: '8px 12px', borderRadius: '8px', background: `${urgencyColor[result.urgency]}15`, border: `1px solid ${urgencyColor[result.urgency]}33` }}>
                      <AlertTriangle size={14} color={urgencyColor[result.urgency]} />
                      <span style={{ fontSize: '0.82rem', color: urgencyColor[result.urgency], fontWeight: 600 }}>Aciliyet: {urgencyLabel[result.urgency]}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Olası Tanılar (Ayırıcı Tanı):</div>
                    {result.content.map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', marginBottom: '6px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem' }}>{i + 1}.</span>
                        <span style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{c}</span>
                      </div>
                    ))}
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px', fontStyle: 'italic' }}>⚠️ Bu bilgi klinik karar desteği amaçlıdır. Kesin tanı için fizik muayene ve tetkik gereklidir.</p>
                  </div>
                )}

                {result.type === 'drug' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[['Sınıf', result.content.class], ['Kullanım', result.content.use], ['Standart Doz', result.content.dose]].map(([k, v]) => (
                      <div key={k} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '3px' }}>{k}</div>
                        <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>{v}</div>
                      </div>
                    ))}
                    <div style={{ gridColumn: '1/-1', padding: '10px 14px', background: 'rgba(239,68,68,0.07)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginBottom: '6px' }}>⚠️ Dikkatli Kullanım / Etkileşimler</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {result.content.interactions.map(i => (
                          <span key={i} style={{ padding: '3px 10px', borderRadius: '12px', background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', fontSize: '0.78rem' }}>{i}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {result.type === 'protocol' && (
                  <div>
                    {result.content.map((step, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(0,229,255,0.15)', border: '1px solid var(--primary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5, paddingTop: '2px' }}>{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {result.type === 'general' && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{result.content}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ClinicalAI = ({ patients }) => {
  const [messages, setMessages] = useState([
    {
      id: 0, role: 'assistant',
      results: [{
        type: 'general',
        title: '🤖 MediAI Klinik Karar Destek Sistemine Hoş Geldiniz',
        content: 'Semptom analizi, ilaç bilgisi, etkileşim kontrolü ve tedavi protokolleri hakkında sorularınızı yanıtlıyorum. Aşağıdaki hızlı sorulardan birini seçin veya kendi sorunuzu yazın.',
      }],
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = (text) => {
    const query = text || input.trim();
    if (!query || loading) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: query };
    const loadingMsg = { id: Date.now() + 1, role: 'assistant', loading: true };
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setLoading(true);

    // Simüle AI gecikmesi
    setTimeout(() => {
      const results = analyzeQuery(query);

      // Seçili hasta varsa kontekst ekle
      if (selectedPatient) {
        const patient = patients.find(p => p.id === parseInt(selectedPatient));
        if (patient) {
          results.unshift({
            type: 'general',
            title: `👤 Hasta Bağlamı: ${patient.name}`,
            content: `Hastalık: ${patient.disease} | Sağlık Skoru: ${patient.healthScore}/100 | Son Ölçüm: ${patient.currentValue} (Eşik: ${patient.threshold}) | Durum: ${patient.status === 'danger' ? '🔴 Riskli' : '✅ Stabil'}`,
          });
        }
      }

      setMessages(prev => prev.map(m =>
        m.loading ? { ...m, loading: false, results } : m
      ));
      setLoading(false);
    }, 800 + Math.random() * 600);
  };

  const clearChat = () => {
    setMessages([{
      id: 0, role: 'assistant',
      results: [{ type: 'general', title: '🤖 Sohbet Temizlendi', content: 'Yeni bir soru sormaya hazırım.' }],
    }]);
  };

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', background: 'linear-gradient(135deg, var(--primary), #7c3aed)', borderRadius: '12px' }}>
              <Sparkles size={24} color="#fff" />
            </div>
            MediAI Klinik Asistan
          </h1>
          <p className="text-muted">Yapay zeka destekli klinik karar destek sistemi.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            style={{ padding: '9px 14px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-main)', fontFamily: 'Outfit', fontSize: '0.88rem' }}
            value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
            <option value="">Hasta bağlamı seçin...</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.disease})</option>)}
          </select>
          <button className="glass-button" onClick={clearChat} style={{ padding: '9px 14px' }}>
            <RotateCcw size={16} /> Temizle
          </button>
        </div>
      </div>

      {/* Quick Prompts */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', flexShrink: 0 }}>
        {QUICK_PROMPTS.map((p, i) => (
          <button key={i} onClick={() => sendMessage(p)}
            style={{ padding: '7px 14px', borderRadius: '20px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'Outfit', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
            {p}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="glass-panel" style={{ flex: 1, overflowY: 'auto', padding: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="glass-panel" style={{ padding: '16px', flexShrink: 0, display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Activity size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Semptom, ilaç adı veya hastalık adı girin... (Enter ile gönder)"
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '0.95rem', fontFamily: 'Outfit' }}
        />
        <button className="glass-button primary" onClick={() => sendMessage()} disabled={!input.trim() || loading}
          style={{ padding: '10px 20px', opacity: !input.trim() || loading ? 0.5 : 1 }}>
          <Send size={16} /> Gönder
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default ClinicalAI;
