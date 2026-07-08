'use client';

import { useState } from 'react';
import { Mic, Play, Bot, PhoneCall, Volume2, Save, Wand2, Settings2, CheckCircle2 } from 'lucide-react';

export default function AIVoicePage() {
  const [prompt, setPrompt] = useState('Merhaba, ben Sağlık Bakanlığı Sanal Asistanı Ayşe. Sisteme göre bugün tansiyon ölçümünüzü girmemişsiniz. Şu anki durumunuz nasıl?');
  const [voice, setVoice] = useState('ayse');
  const [speed, setSpeed] = useState(1);
  const [simulating, setSimulating] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSimulate = () => {
    if (!('speechSynthesis' in window)) {
      alert('Tarayıcınız sesli okuma (Text-to-Speech) özelliğini desteklemiyor.');
      return;
    }

    setSimulating(true);
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(prompt);
    utterance.lang = 'tr-TR';
    utterance.rate = speed;
    
    // Kadın/Erkek sesi simülasyonu için perde (pitch) ayarı
    utterance.pitch = voice === 'ayse' ? 1.4 : 0.8;

    utterance.onend = () => {
      setSimulating(false);
    };
    
    utterance.onerror = () => {
      setSimulating(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-in" style={{ paddingBottom: '40px' }}>
      
      {/* ── Header ── */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f0f9ff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bot size={30} color="#a78bfa" />
          Yapay Zeka Sesli Asistan Komuta Merkezi
        </h1>
        <p style={{ color: '#8aafc7', marginTop: '6px', fontSize: '14px' }}>
          Hastalara yapılacak otomatik aramaların diyalog senaryolarını (Prompt) ve ses modellerini yönetin.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* ── Prompt Engineering Panel ── */}
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#e2f0f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wand2 size={20} color="#a78bfa" /> Diyalog Senaryosu (Prompt)
            </h2>
            <div className="badge badge-success" style={{ display: 'flex', gap: '6px' }}>
              <CheckCircle2 size={12} /> YZ Modeli Aktif
            </div>
          </div>
          
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <textarea
              className="input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{
                width: '100%', height: '160px', padding: '20px', resize: 'none',
                background: 'rgba(0,0,0,0.2)', fontSize: '15px', lineHeight: '1.6', color: '#e2f0f9',
                border: '1px solid rgba(167,139,250,0.3)', borderRadius: '12px'
              }}
            />
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', fontSize: '11px', color: '#8aafc7' }}>
              {prompt.length} karakter (Ort. 12 saniye)
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-ghost" style={{ fontSize: '12px', background: 'rgba(255,255,255,0.03)' }}>
              + Değişken Ekle: [Hasta Adı]
            </button>
            <button className="btn btn-ghost" style={{ fontSize: '12px', background: 'rgba(255,255,255,0.03)' }}>
              + Değişken Ekle: [Son Ölçüm]
            </button>
            <button className="btn btn-ghost" style={{ fontSize: '12px', background: 'rgba(255,255,255,0.03)' }}>
              + Değişken Ekle: [Hastalık Tipi]
            </button>
          </div>
        </div>

        {/* ── Voice & Settings Panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '28px', flex: 1 }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#e2f0f9', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings2 size={18} color="#00e5ff" /> Ses Modeli Konfigürasyonu
            </h2>

            <label style={{ display: 'block', fontSize: '12px', color: '#8aafc7', marginBottom: '8px', fontWeight: 600 }}>Asistan Sesi</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {[
                { id: 'ayse', name: 'Hemşire Ayşe (TR - Kadın)', badge: 'Doğal' },
                { id: 'kemal', name: 'Dr. Kemal (TR - Erkek)', badge: 'Otoriter' },
              ].map(v => (
                <div 
                  key={v.id} 
                  onClick={() => setVoice(v.id)}
                  style={{
                    padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                    background: voice === v.id ? 'rgba(0,229,255,0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${voice === v.id ? 'rgba(0,229,255,0.3)' : 'rgba(255,255,255,0.05)'}`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '13px', color: voice === v.id ? '#00e5ff' : '#8aafc7', fontWeight: voice === v.id ? 700 : 500 }}>{v.name}</span>
                  <div className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#4d6b82' }}>{v.badge}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '24px' }}>
               <label style={{ display: 'block', fontSize: '12px', color: '#8aafc7', marginBottom: '8px', fontWeight: 600 }}>Konuşma Hızı ({speed}x)</label>
               <input 
                 type="range" min="0.5" max="2" step="0.1" 
                 value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} 
                 style={{ width: '100%', accentColor: '#a78bfa' }} 
               />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={handleSimulate} disabled={simulating} className="btn" style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)', justifyContent: 'center' }}>
                {simulating ? (
                  <><div className="spinner" style={{ width: '15px', height: '15px', borderWidth: '2px', borderColor: '#a78bfa', borderTopColor: 'transparent' }} /> Ses İşleniyor...</>
                ) : (
                  <><Volume2 size={16} /> Önizleme Dinle</>
                )}
              </button>
              <button onClick={handleSave} className="btn btn-primary" style={{ justifyContent: 'center' }}>
                {saved ? <><CheckCircle2 size={16} /> Kaydedildi</> : <><Save size={16} /> Senaryoyu Kaydet</>}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Active Calling Status ── */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#e2f0f9', marginTop: '40px', marginBottom: '20px' }}>Canlı Arama Kuyruğu</h3>
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16,185,129,0.2)' }}>
            <PhoneCall size={24} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#f0f9ff' }}>142 <span style={{ fontSize: '13px', color: '#4d6b82', fontWeight: 500 }}>bekleyen arama</span></div>
            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', fontWeight: 600 }}>Şu an 3 hasta ile otonom görüşülüyor.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '12px', color: '#8aafc7' }}>
            Tahmini Bitiş: <strong style={{ color: '#e2f0f9' }}>14 Dakika</strong>
          </div>
        </div>
      </div>

    </div>
  );
}
