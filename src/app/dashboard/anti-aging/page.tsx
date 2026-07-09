'use client';

import React, { useState, useEffect } from 'react';
import { Infinity, Hourglass, Zap, RotateCcw, Dna, Activity, Lock } from 'lucide-react';
import Link from 'next/link';

export default function AntiAgingPage() {
  const [activating, setActivating] = useState(false);
  const [telomereLen, setTelomereLen] = useState(4.2); // KB (Kilobaz)
  const [lifespan, setLifespan] = useState(82); // Yıl

  useEffect(() => {
    let interval: any;
    if (activating && lifespan < 250) {
      interval = setInterval(() => {
        setTelomereLen(prev => prev < 15.0 ? parseFloat((prev + 0.1).toFixed(2)) : 15.0);
        setLifespan(prev => prev + 2); // Ömür hızla artıyor
      }, 50);
    } else if (lifespan >= 250) {
      setActivating(false);
    }
    return () => clearInterval(interval);
  }, [activating, lifespan]);

  return (
    <div className="gpu-accelerated fast-render" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-1px', color: 'var(--text)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Infinity size={36} color="var(--accent)" /> Immortality (Ölümsüzlük) Protokolü
            <span style={{ fontSize: '12px', background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontWeight: 800 }}>V18 GOD MODE</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px', fontWeight: 500, margin: 0 }}>
            Telomeraz enzim aktivasyonu ile hücresel yaşlanmayı durdurma ve biyolojik yaşı geriye alma simülasyonu.
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-ghost">Panele Dön</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Sol Panel: Telomer Uzunluk Göstergesi */}
        <div className="card gpu-accelerated animate-in delay-2" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--surface2)', position: 'relative', overflow: 'hidden' }}>
           
           <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
             <div>
                <div style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 800, letterSpacing: '1px' }}>KROMOZOM</div>
                <div style={{ fontSize: '20px', color: 'var(--text)', fontWeight: 900, fontFamily: 'monospace' }}>CHR-01: TELOMERE</div>
             </div>
             <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 800, letterSpacing: '1px' }}>HÜCRE BÖLÜNME LİMİTİ</div>
                <div style={{ fontSize: '20px', color: activating ? 'var(--accent)' : lifespan >= 250 ? 'var(--success)' : 'var(--warning)', fontWeight: 900 }}>
                  {lifespan >= 250 ? 'LİMİTSİZ (HAYFLICK AŞILDI)' : '52 BÖLÜNME (KRİTİK)'}
                </div>
             </div>
           </div>

           {/* Merkez DNA / Kum Saati Animasyonu */}
           <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
             
             {/* Dönen Enerji Halkası */}
             {activating && (
                <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '2px solid var(--accent)', animation: 'spin 2s linear infinite' }} />
             )}

             {/* İç İçe Geçmiş İkonlar */}
             <div style={{ position: 'absolute', opacity: lifespan >= 250 ? 0 : 1, transition: 'opacity 1s' }}>
                <Hourglass size={120} color="var(--warning)" style={{ animation: activating ? 'spin 1s linear infinite' : 'none' }} />
             </div>
             <div style={{ position: 'absolute', opacity: lifespan >= 250 ? 1 : 0, transition: 'opacity 1s', filter: 'drop-shadow(0 0 40px var(--accent))' }}>
                <Infinity size={140} color="var(--accent)" style={{ animation: 'pulseGlow 2s infinite alternate' }} />
             </div>
           </div>

           <button 
             onClick={() => setActivating(true)} 
             disabled={activating || lifespan >= 250}
             className="btn" 
             style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '15px', background: activating ? 'transparent' : lifespan >= 250 ? 'var(--surface2)' : 'var(--accent)', color: activating ? 'var(--accent)' : lifespan >= 250 ? 'var(--success)' : '#fff', border: activating ? '1px solid var(--accent)' : lifespan >= 250 ? '1px solid var(--success)' : 'none', boxShadow: (activating || lifespan >= 250) ? 'none' : '0 10px 25px rgba(139, 92, 246, 0.4)' }}>
              {activating ? <><Zap className="spin" size={18} /> Telomeraz Enjekte Ediliyor...</> : lifespan >= 250 ? <><Infinity size={18} /> Ölümsüzlük Modu Aktif</> : <><RotateCcw size={18} /> Yaşlanmayı Geriye Çevir</>}
           </button>
        </div>

        {/* Sağ Panel: Ömür & Biyolojik Veriler */}
        <div className="card gpu-accelerated animate-in delay-3" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
           
           <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Activity size={20} color="var(--primary)" /> Biyometrik Yaşam Verileri
           </h3>

           <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              
              <div style={{ background: 'var(--surface2)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-sub)', fontWeight: 700, display: 'flex', gap: '6px', alignItems: 'center' }}>
                       <Dna size={16} /> Telomer Uzunluğu (Genetik Gençlik)
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text)', fontFamily: 'monospace' }}>{telomereLen.toFixed(1)} KB</div>
                 </div>
                 <div style={{ width: '100%', height: '8px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(telomereLen / 15) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--danger), var(--warning), var(--success))', transition: 'width 0.1s linear' }} />
                 </div>
              </div>

              <div style={{ background: 'var(--surface2)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-sub)', fontWeight: 700, display: 'flex', gap: '6px', alignItems: 'center' }}>
                       <Hourglass size={16} /> Tahmini Kalan Ömür (Lifespan)
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: lifespan >= 250 ? 'var(--accent)' : 'var(--text)', fontFamily: 'monospace' }}>
                       {lifespan >= 250 ? '250+ YIL' : `${lifespan} YIL`}
                    </div>
                 </div>
              </div>

           </div>

           <div style={{ marginTop: 'auto', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                    <Lock size={20} />
                 </div>
                 <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>Hücresel Yenilenme (Immortality)</div>
                    <p style={{ fontSize: '13px', color: 'var(--text-sub)', margin: 0, lineHeight: 1.5 }}>
                       Yaşlanmanın ana sebebi olan hücre bölünmesindeki kromozom kısalması durduruldu. Hayflick limiti aşıldı. Biyolojik bedenin çürümesi tamamen engellendi.
                    </p>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
