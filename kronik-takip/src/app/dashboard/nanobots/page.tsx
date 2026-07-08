'use client';

import React, { useState, useEffect } from 'react';
import { Target, Zap, ShieldAlert, Cpu, Crosshair, Radar } from 'lucide-react';
import Link from 'next/link';

export default function NanobotPage() {
  const [attacking, setAttacking] = useState(false);
  const [destroyed, setDestroyed] = useState(false);
  const [swarm, setSwarm] = useState(2500000000); // 2.5 Milyar nanobot
  const [bloodPressure, setBloodPressure] = useState(120);

  // Kalp atışı / kan basıncı simülasyonu
  useEffect(() => {
    const bpInterval = setInterval(() => {
      setBloodPressure(prev => prev === 120 ? 128 : 120);
    }, 1200);
    return () => clearInterval(bpInterval);
  }, []);

  useEffect(() => {
    if (attacking && !destroyed) {
      const attackTimer = setTimeout(() => {
        setDestroyed(true);
        setAttacking(false);
      }, 5000); // 5 saniyede tümör yok edilir
      return () => clearTimeout(attackTimer);
    }
  }, [attacking, destroyed]);

  return (
    <div className="gpu-accelerated fast-render" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-1px', color: 'var(--text)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Cpu size={36} color="var(--primary)" /> Kuantum Nanobot (Swarm) Komuta
            <span style={{ fontSize: '12px', background: 'linear-gradient(90deg, #3b82f6, #00f2fe)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontWeight: 800 }}>V18 IMMORTALITY</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px', fontWeight: 500, margin: 0 }}>
            Damar içi kamera feed'inden (Canlı yayın) 2.5 Milyar Nanobot sürüsünü yönlendirip tümörleri/pıhtıları lazerle imha etme.
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-ghost">Panele Dön</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
        
        {/* Sol Panel: Damar İçi Kamera (Bloodstream Feed) */}
        <div className="card gpu-accelerated animate-in delay-2" style={{ padding: '0', display: 'flex', flexDirection: 'column', background: '#300a0a', border: '1px solid var(--border)', position: 'relative', minHeight: '550px', overflow: 'hidden' }}>
           
           {/* Damar İçi Görünüm (Kırmızımtırak Arkaplan & Kan Akışı efekti) */}
           <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #6b1414 0%, #1a0404 100%)', opacity: 0.8 }} />
           
           {/* Akış Partikülleri (Kırmızı Kan Hücreleri Simülasyonu) */}
           <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(239, 68, 68, 0.2) 2px, transparent 2px)', backgroundSize: '30px 30px', animation: 'panUp 10s linear infinite', opacity: 0.3 }} />

           {/* HUD: Camera Info */}
           <div style={{ position: 'relative', zIndex: 10, padding: '20px', display: 'flex', justifyContent: 'space-between', color: '#fff', fontFamily: 'monospace', textShadow: '0 0 5px #000' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                 <span><span style={{ color: 'var(--danger)' }}>REC 🔴</span> VEIN-CAM 4</span>
                 <span>BP: {bloodPressure}/80</span>
              </div>
              <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                 SWARM_SIZE: {(swarm / 1000000000).toFixed(1)} BILLION
              </div>
           </div>

           {/* Merkez: Tümör / Pıhtı Hedefi */}
           <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              
              {!destroyed ? (
                 <>
                   {/* Tümör/Pıhtı Kütlesi */}
                   <div style={{ width: '120px', height: '120px', background: 'radial-gradient(circle, #000 20%, #450a0a 100%)', borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', boxShadow: '0 0 40px rgba(0,0,0,0.8)', animation: 'pulseGlow 2s infinite alternate', position: 'relative' }}>
                      
                      {/* Lazer Tarama/Kilidi */}
                      {attacking && (
                        <>
                          <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '2px solid var(--primary)', animation: 'spin 0.5s linear infinite' }} />
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '2px', background: 'var(--primary)', boxShadow: '0 0 20px var(--primary)', animation: 'spin 0.2s linear infinite' }} />
                        </>
                      )}
                   </div>
                   
                   {/* Nanobot Sürüsü Görselleşmesi (Mavi noktalar) */}
                   <div style={{ position: 'absolute', top: '50%', left: '50%', width: '300px', height: '300px', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
                      {[...Array(12)].map((_, i) => (
                        <div key={i} style={{ position: 'absolute', top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, width: '4px', height: '4px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--primary)', transition: 'all 2s', transform: attacking ? `translate(${50 - Math.random()*100}px, ${50 - Math.random()*100}px)` : 'none' }} />
                      ))}
                   </div>
                 </>
              ) : (
                 // Yok edildi animasyonu
                 <div style={{ color: 'var(--primary)', textAlign: 'center', animation: 'pulseGlow 1s infinite alternate' }}>
                    <ShieldAlert size={80} style={{ margin: '0 auto 16px' }} />
                    <h2 style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '24px', margin: 0, textShadow: '0 0 20px var(--primary)' }}>THREAT ELIMINATED</h2>
                    <p style={{ color: '#fff', fontSize: '13px' }}>Tümör kütlesi %100 oranında nanobot lazerleriyle buharlaştırıldı.</p>
                 </div>
              )}
           </div>

        </div>

        {/* Sağ Panel: Swarm Komuta (Sürü) */}
        <div className="card gpu-accelerated animate-in delay-3" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--surface)' }}>
           
           <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Radar size={20} color="var(--primary)" /> Sürü Navigasyonu
           </h3>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '16px', borderRadius: '12px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', fontWeight: 800, marginBottom: '4px' }}>
                    <Target size={16} /> Hedef: Malign Melanom (Evre 1)
                 </div>
                 <div style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
                    Hedef lokasyon: Sol Arteryel Dal (Aorta). Kütle çapı 4.2mm.
                 </div>
              </div>

              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '16px', borderRadius: '12px' }}>
                 <div style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 700, marginBottom: '4px' }}>SÜRÜ ENERJİSİ (Nano-Battery)</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
                       <div style={{ width: attacking ? '65%' : '98%', height: '100%', background: 'var(--primary)', transition: 'width 4s linear' }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text)' }}>{attacking ? '%65' : '%98'}</span>
                 </div>
              </div>
           </div>

           <div style={{ marginTop: 'auto' }}>
             <button 
               onClick={() => setAttacking(true)} 
               disabled={attacking || destroyed}
               className="btn" 
               style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '15px', background: attacking ? 'transparent' : destroyed ? 'var(--surface2)' : 'var(--primary)', color: attacking ? 'var(--primary)' : destroyed ? 'var(--muted)' : '#fff', border: attacking ? '1px solid var(--primary)' : destroyed ? '1px solid var(--border)' : 'none', boxShadow: (attacking || destroyed) ? 'none' : '0 10px 25px rgba(59, 130, 246, 0.4)' }}>
                {attacking ? <><Zap className="spin" size={18} /> Nanobot Lazerleri Ateşleniyor...</> : destroyed ? <><ShieldAlert size={18} /> Görev Başarılı</> : <><Crosshair size={18} /> Sürüyü (Swarm) Hedefe Kilitle</>}
             </button>
           </div>
           
           <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)', marginBottom: '4px' }}>Nano-Tech (V18)</div>
              <p style={{ fontSize: '12px', color: 'var(--text-sub)', margin: 0, lineHeight: 1.5 }}>
                 Nanobotlar hedefe ulaştığında kuantum dolanıklık prensibiyle aynı anda mikroskobik lazer atışı gerçekleştirerek sadece hatalı hücreyi yok eder, sağlıklı dokuya zarar vermez.
              </p>
           </div>

        </div>

      </div>
    </div>
  );
}
