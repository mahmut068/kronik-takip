'use client';

import React, { useState, useEffect } from 'react';
import { Snowflake, ThermometerSnowflake, Activity, Beaker, AlertOctagon, RefreshCcw, Dna } from 'lucide-react';
import Link from 'next/link';

export default function CryogenicsPage() {
  const [temp, setTemp] = useState(-196.0); // Sıvı nitrojen sıcaklığı
  const [viability, setViability] = useState(99.9);
  const [status, setStatus] = useState('STABIL');

  // Termal dalgalanma simülasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      setTemp(prev => {
        const fluctuate = (Math.random() * 0.4) - 0.2;
        return parseFloat((prev + fluctuate).toFixed(2));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="gpu-accelerated fast-render" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-1px', color: 'var(--text)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Snowflake size={36} color="#38bdf8" /> Kriyojenik Organ & Doku Koruma
            <span style={{ fontSize: '12px', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontWeight: 800 }}>V16 CRYO-MED</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px', fontWeight: 500, margin: 0 }}>
            Nakil bekleyen organların ve nadir DNA örneklerinin -196°C Sıvı Nitrojen tanklarındaki canlı telemetrisi.
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-ghost">Panele Dön</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Sol Panel: Tank 01 Simülasyonu */}
        <div className="card gpu-accelerated animate-in delay-2" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--surface2)', position: 'relative', overflow: 'hidden' }}>
           
           {/* Arka plan soğukluk efekti */}
           <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(to top, rgba(56,189,248,0.1), transparent)', pointerEvents: 'none' }} />
           
           <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
             <div>
                <div style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 800, letterSpacing: '1px' }}>KAPSÜL ID</div>
                <div style={{ fontSize: '20px', color: 'var(--text)', fontWeight: 900, fontFamily: 'monospace' }}>CRYO-TANK-01</div>
             </div>
             <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 800, letterSpacing: '1px' }}>İÇERİK</div>
                <div style={{ fontSize: '20px', color: 'var(--primary)', fontWeight: 900 }}>Kardiyak Doku (Kalp)</div>
             </div>
           </div>

           {/* Core Tank UI */}
           <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             
             {/* Dönen Buzlu Halkalar */}
             <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(56,189,248,0.2)', animation: 'spin 10s linear infinite' }} />
             <div style={{ position: 'absolute', inset: '15px', borderRadius: '50%', border: '2px dashed rgba(56,189,248,0.5)', animation: 'spin 15s linear infinite reverse' }} />
             
             {/* Merkez Isı */}
             <div style={{ textAlign: 'center', zIndex: 10, background: 'rgba(15,23,42,0.6)', padding: '20px', borderRadius: '50%', backdropFilter: 'blur(8px)', boxShadow: '0 0 30px rgba(56,189,248,0.2)' }}>
                <ThermometerSnowflake size={32} color="#38bdf8" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff', fontFamily: 'monospace', textShadow: '0 0 10px #38bdf8' }}>
                  {temp}°C
                </div>
                <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 700, marginTop: '4px' }}>SIVI NİTROJEN (LN2)</div>
             </div>
           </div>

           <div style={{ marginTop: '40px', display: 'flex', gap: '20px', width: '100%' }}>
              <div style={{ flex: 1, background: 'var(--surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 <div style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 700, marginBottom: '4px' }}>NİTROJEN SEVİYESİ</div>
                 <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)' }}>%84.2</div>
              </div>
              <div style={{ flex: 1, background: 'var(--surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 <div style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 700, marginBottom: '4px' }}>BASINÇ (PSI)</div>
                 <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)' }}>22.4 PSI</div>
              </div>
           </div>

        </div>

        {/* Sağ Panel: Biyolojik Durum & Analiz */}
        <div className="card gpu-accelerated animate-in delay-3" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
           
           <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Dna size={20} color="var(--primary)" /> Biyolojik Hücre Analizi
           </h3>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--text-sub)', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14}/> Hücresel Canlılık (Viability) Oranı</span>
                    <span style={{ color: 'var(--success)', fontWeight: 800 }}>%{viability}</span>
                 </div>
                 <div style={{ height: '8px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${viability}%`, height: '100%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }} />
                 </div>
              </div>

              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--text-sub)', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Beaker size={14}/> Antifriz (Cryoprotectant) Yoğunluğu</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Optimum</span>
                 </div>
                 <div style={{ height: '8px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: 'var(--primary)' }} />
                 </div>
              </div>
           </div>

           <div style={{ marginTop: 'auto', background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', flexShrink: 0 }}>
                    <RefreshCcw size={20} />
                 </div>
                 <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>Dondurma Döngüsü Stabil</div>
                    <p style={{ fontSize: '13px', color: 'var(--text-sub)', margin: 0, lineHeight: 1.5 }}>
                       Organ vitrifikasyon (camlaşma) süreci başarıyla tamamlandı. Buz kristali oluşumu engellendi. Organ, nakil işlemi için süresiz olarak güvenle saklanabilir.
                    </p>
                 </div>
              </div>
           </div>

           <button className="btn" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '15px', background: 'var(--surface2)', color: 'var(--danger)', border: '1px solid var(--danger-dim)' }}>
              <AlertOctagon size={18} /> Acil Çözdürme (Thawing) Protokolünü Başlat
           </button>
        </div>

      </div>
    </div>
  );
}
