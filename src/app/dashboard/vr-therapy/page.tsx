'use client';

import React, { useState } from 'react';
import { Glasses, HeartPulse, Activity, Zap, PlayCircle, PauseCircle, CheckCircle, TrendingDown } from 'lucide-react';
import Link from 'next/link';

export default function VRTherapyPage() {
  const [sessionActive, setSessionActive] = useState(false);
  const [stressLevel, setStressLevel] = useState(85); // Başlangıçta yüksek

  const toggleSession = () => {
    if (!sessionActive) {
      setSessionActive(true);
      // Stres seviyesini yavaşça düşür (Terapinin çalıştığını simüle et)
      let current = 85;
      const interval = setInterval(() => {
        current -= Math.floor(Math.random() * 3) + 1;
        if (current <= 20) {
          clearInterval(interval);
          setStressLevel(20);
        } else {
          setStressLevel(current);
        }
      }, 800);
    } else {
      setSessionActive(false);
    }
  };

  return (
    <div className="gpu-accelerated fast-render" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1px', color: '#0f172a', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Glasses size={36} color="#ec4899" /> VR Sanal Terapi (Digital Therapeutics)
            <span style={{ fontSize: '12px', background: 'linear-gradient(90deg, #ec4899, #f43f5e)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontWeight: 800 }}>FDA ONAYLI</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px', fontWeight: 500, margin: 0 }}>
            Kronik Ağrı (Fibromiyalji) ve Travma Sonrası Stres (TSSB) için reçete edilebilir Sanal Gerçeklik modülü.
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-ghost">Panele Dön</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        
        {/* Sol: VR Ortam Ekranı (Simüle edilmiş) */}
        <div className="card gpu-accelerated animate-in delay-2" style={{ overflow: 'hidden', padding: '24px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Hasta Başlığından Canlı Görünüm</div>
              {sessionActive ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '13px', fontWeight: 700 }}><Activity size={14} className="spin" /> TERAPİ AKTİF</div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px', fontWeight: 700 }}>BEKLEMEDE</div>
              )}
           </div>

           <div style={{ width: '100%', height: '350px', background: sessionActive ? 'linear-gradient(to bottom, #38bdf8, #0ea5e9)' : '#e2e8f0', borderRadius: '16px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 2s ease' }}>
              {!sessionActive ? (
                <div style={{ color: '#94a3b8', fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <Glasses size={48} />
                  <span>Hastanın kulaklık ve VR gözlüğünü takmasını bekleyin.</span>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                   <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>"Gevşeme Vadisi" Modülü Başladı</div>
                   <div style={{ fontSize: '14px', fontWeight: 500, opacity: 0.9 }}>Bilişsel Davranışçı Terapi (BDT) Ses Dosyası Oynatılıyor...</div>
                   
                   {/* Animasyonlu VR dalgaları */}
                   <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} style={{ width: '8px', height: `${Math.random() * 50 + 20}px`, background: 'rgba(255,255,255,0.8)', borderRadius: '4px', animation: `pulseGlow ${Math.random() + 0.5}s infinite alternate` }} />
                      ))}
                   </div>
                </div>
              )}
           </div>

           <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button onClick={toggleSession} className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '16px' }}>
                 {sessionActive ? <><PauseCircle size={20} /> Seansı Durdur</> : <><PlayCircle size={20} /> 15 Dk. Seansı Başlat</>}
              </button>
           </div>
        </div>

        {/* Sağ: Biyometrik Geribildirim */}
        <div className="card gpu-accelerated animate-in delay-3" style={{ padding: '24px' }}>
           <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 24px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>Biyofeedback Verileri</h3>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><HeartPulse size={14} color="#e11d48"/> Kalp Atış Hızı</span>
                    <span style={{ color: sessionActive ? '#10b981' : '#e11d48' }}>{sessionActive ? '72 bpm' : '110 bpm'}</span>
                 </div>
                 <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: sessionActive ? '50%' : '85%', height: '100%', background: sessionActive ? '#10b981' : '#e11d48', transition: 'all 1s ease' }} />
                 </div>
              </div>

              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Zap size={14} color="#f59e0b"/> Somatik Stres / Ağrı Seviyesi</span>
                    <span style={{ color: stressLevel > 50 ? '#f59e0b' : '#3b82f6' }}>%{stressLevel}</span>
                 </div>
                 <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${stressLevel}%`, height: '100%', background: stressLevel > 50 ? '#f59e0b' : '#3b82f6', transition: 'width 0.5s ease' }} />
                 </div>
              </div>

              <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                 <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', marginBottom: '8px' }}>YAPAY ZEKA ANALİZİ</div>
                 {stressLevel <= 30 ? (
                   <div style={{ color: '#10b981', fontSize: '13px', fontWeight: 600, display: 'flex', gap: '8px' }}>
                      <CheckCircle size={18} style={{ flexShrink: 0 }} /> Terapötik hedef sağlandı. Kortizol salınımı durduruldu ve hasta rahatladı.
                   </div>
                 ) : (
                   <div style={{ color: '#f59e0b', fontSize: '13px', fontWeight: 600, display: 'flex', gap: '8px' }}>
                      <TrendingDown size={18} style={{ flexShrink: 0 }} /> Seans başladı. Sempati sinir sistemi aktivitesi düşürülmeye çalışılıyor.
                   </div>
                 )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
