'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, FileText, CheckCircle2, AlertCircle, 
  Stethoscope, Pill, ScrollText, StopCircle, RefreshCw
} from 'lucide-react';

const customCss = `
  .glass-card {
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(139, 92, 246, 0.15);
    border-radius: 20px;
    box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.4);
  }
  .audio-bar {
    width: 6px;
    background: #8b5cf6;
    border-radius: 3px;
    animation: bounce 1s ease-in-out infinite;
  }
  .audio-bar:nth-child(1) { animation-delay: 0.1s; height: 10px; }
  .audio-bar:nth-child(2) { animation-delay: 0.3s; height: 30px; }
  .audio-bar:nth-child(3) { animation-delay: 0.0s; height: 50px; }
  .audio-bar:nth-child(4) { animation-delay: 0.4s; height: 25px; }
  .audio-bar:nth-child(5) { animation-delay: 0.2s; height: 40px; }
  
  @keyframes bounce {
    0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
    50% { transform: scaleY(1.5); opacity: 1; }
  }
  
  .typewriter-text {
    overflow: hidden;
    white-space: pre-wrap;
    border-right: 2px solid #8b5cf6;
    animation: blink-caret .75s step-end infinite;
  }
  @keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: #8b5cf6; }
  }

  .neon-gradient {
    background: linear-gradient(90deg, #a855f7, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

// Simüle edilecek diyalog
const MOCK_TRANSCRIPT = [
  { speaker: 'Dr. Admin', text: 'Hoş geldiniz Ahmet Bey. Şikayetleriniz nelerdir, bugün sizi nasıl hissediyorsunuz?' },
  { speaker: 'Ahmet Bey', text: 'Hocam merhaba. Son 3 gündür göğsümde garip bir sıkışma var. Merdiven çıkarken nefes nefese kalıyorum.' },
  { speaker: 'Dr. Admin', text: 'Anlıyorum. Çarpıntınız veya sol kola vuran bir ağrı eşlik ediyor mu?' },
  { speaker: 'Ahmet Bey', text: 'Sol kolumda uyuşma oluyor evet. Bir de tansiyonumu evde ölçtüm, 150\'ye 95 çıkıyor genelde.' },
];

export default function AiScribePage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<{speaker: string, text: string}[]>([]);
  const [extractedData, setExtractedData] = useState<any>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTranscript([]);
      setExtractedData(null);
      simulateConversation();
    }
  };

  const simulateConversation = () => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < MOCK_TRANSCRIPT.length) {
        setTranscript(prev => [...prev, MOCK_TRANSCRIPT[index]]);
        index++;
      } else {
        clearInterval(interval);
        setIsListening(false);
        // Diyalog bitince veriyi (NLP) işlemiş gibi sonuç göster
        setTimeout(() => {
          setExtractedData({
            icd: ['I20.9 - Angina Pectoris, Tanımlanmamış', 'I10 - Esansiyel (Primer) Hipertansiyon'],
            summary: 'Hasta son 3 gündür eforla gelen göğüs sıkışması ve sol kolda uyuşma tarifliyor. Ev takibi kan basıncı 150/95 mmHg.',
            plan: 'Kardiyoloji konsültasyonu, EKG, Troponin I, EKO.',
            meds: ['Aspirin 100mg 1x1', 'Metoprolol 50mg 1x1']
          });
        }, 1500);
      }
    }, 3000); // Her 3 saniyede 1 cümle
  };

  return (
    <div style={{ paddingBottom: '60px', maxWidth: '1400px', margin: '0 auto', color: '#f8fafc', minHeight: '100vh', padding: '20px' }}>
      <style>{customCss}</style>

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <Mic size={24} color="#a855f7" />
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }} className="neon-gradient">
              AI Ambient Scribe
            </h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '15px', margin: 0, fontWeight: 500 }}>
            Ortam dinleme teknolojisi ile vizit (muayene) anında otomatik ICD ve Epikriz çıkarımı.
          </p>
        </div>

        <button 
          onClick={toggleListening}
          className="glass-card" 
          style={{ 
            padding: '12px 32px', 
            color: isListening ? '#f43f5e' : '#a855f7', 
            fontWeight: 800, 
            display: 'flex', 
            gap: '12px', 
            alignItems: 'center', 
            cursor: 'pointer', 
            border: `1px solid ${isListening ? 'rgba(244, 63, 94, 0.4)' : 'rgba(168, 85, 247, 0.4)'}` 
          }}
        >
          {isListening ? (
            <><StopCircle size={20} /> Dinlemeyi Durdur</>
          ) : (
            <><Mic size={20} /> Ortam Dinlemeyi Başlat</>
          )}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* ── LEFT: LIVE TRANSCRIPT ── */}
        <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={18} color="#a855f7" className={isListening ? "spin" : ""} /> Canlı Transkript
            </h3>
            
            {isListening && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(139, 92, 246, 0.1)', padding: '6px 12px', borderRadius: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#c084fc' }}>Scribe Dinliyor</div>
                <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '16px' }}>
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                </div>
              </div>
            )}
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
            {transcript.length === 0 && !isListening ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <MicOff size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                <p>Muayeneyi dinlemeye başlamak için üstteki butona tıklayın.</p>
              </div>
            ) : (
              transcript.map((msg, idx) => (
                <div key={idx} className="animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: msg.speaker === 'Dr. Admin' ? '#a855f7' : '#3b82f6' }}>
                    {msg.speaker}
                  </span>
                  <div style={{ 
                    background: msg.speaker === 'Dr. Admin' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(59, 130, 246, 0.1)', 
                    padding: '16px', 
                    borderRadius: '16px',
                    borderLeft: `3px solid ${msg.speaker === 'Dr. Admin' ? '#a855f7' : '#3b82f6'}`,
                    fontSize: '15px',
                    lineHeight: '1.6'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            
            {isListening && transcript.length > 0 && transcript.length < MOCK_TRANSCRIPT.length && (
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.6, marginTop: '8px' }}>
                 <Loader2 size={16} color="#94a3b8" className="spin" />
                 <span className="typewriter-text" style={{ fontSize: '14px', color: '#94a3b8' }}>Hasta yanıtı bekleniyor...</span>
               </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: NLP EXTRACTION (CLINICAL DATA) ── */}
        <div className="glass-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
          
          {/* Overlay loading when not extracted */}
          {!extractedData && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
               {isListening ? (
                 <>
                   <Brain size={40} color="#ec4899" className="pulse-ring" style={{ marginBottom: '16px' }} />
                   <h3 style={{ color: '#fff', margin: '0 0 8px 0' }}>Gerçek Zamanlı Analiz (NLP)</h3>
                   <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', maxWidth: '300px' }}>
                     Doğal dil işleme (NLP) motoru konuşmaları tarıyor ve tıbbi terimleri eşleştiriyor...
                   </p>
                 </>
               ) : (
                 <div style={{ color: '#64748b', textAlign: 'center' }}>
                    <FileText size={40} style={{ opacity: 0.3, marginBottom: '16px', margin: '0 auto' }} />
                    <p>Çıkarımlar muayene bitiminde burada belirecektir.</p>
                 </div>
               )}
            </div>
          )}

          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
            <CheckCircle2 size={20} color="#10b981" /> Yapay Zeka Çıkarımları
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', opacity: extractedData ? 1 : 0.3, transition: 'all 0.5s' }}>
            
            {/* Olası Tanılar (ICD-10) */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#ec4899', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Stethoscope size={16} /> ÖNERİLEN ICD-10 KODLARI
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {extractedData?.icd.map((code: string, i: number) => (
                  <div key={i} style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.2)', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 600 }}>
                    {code}
                  </div>
                ))}
              </div>
            </div>

            {/* Epikriz Notu */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#a855f7', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ScrollText size={16} /> KLİNİK ÖZET (EPİKRİZ)
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', fontSize: '14px', lineHeight: '1.6', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.05)' }}>
                {extractedData?.summary}
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                  <strong>Plan:</strong> {extractedData?.plan}
                </div>
              </div>
            </div>

            {/* Reçete Önerisi */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#3b82f6', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Pill size={16} /> YZ REÇETE ÖNERİSİ
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {extractedData?.meds.map((med: string, i: number) => (
                  <span key={i} style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, color: '#60a5fa' }}>
                    {med}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
              <button style={{ flex: 1, background: '#a855f7', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                Hasta Dosyasına Kaydet
              </button>
              <button style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                Düzenle
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
