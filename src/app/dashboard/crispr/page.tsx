'use client';

import React, { useState, useEffect } from 'react';
import { Dna, Scissors, Activity, Terminal, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CrisprPage() {
  const [splicing, setSplicing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dnaStream, setDnaStream] = useState<string[]>([]);
  
  // Matrix-style DNA stream
  useEffect(() => {
    const chars = ['A', 'T', 'G', 'C'];
    const interval = setInterval(() => {
      setDnaStream(prev => {
        const newLine = Array.from({length: 30}, () => chars[Math.floor(Math.random() * chars.length)]).join(' - ');
        return [newLine, ...prev].slice(0, 8); // Son 8 satırı tut
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: any;
    if (splicing && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          if(prev >= 100) {
            setSplicing(false);
            return 100;
          }
          return prev + 1.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [splicing, progress]);

  return (
    <div className="gpu-accelerated fast-render" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-1px', color: 'var(--text)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Dna size={36} color="var(--success)" /> CRISPR-Cas9 DNA Hack Paneli
            <span style={{ fontSize: '12px', background: 'linear-gradient(90deg, #10b981, #0ea5e9)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontWeight: 800 }}>V18 IMMORTALITY</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px', fontWeight: 500, margin: 0 }}>
            Kanserli ve yaşlanan gen mutasyonlarının (G-A-T-C) tespit edilip enzim makaslarıyla kesilmesi ve yeniden yazılması.
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-ghost">Panele Dön</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
        
        {/* Sol Panel: DNA Akış Ekranı */}
        <div className="card gpu-accelerated animate-in delay-2" style={{ padding: '0', display: 'flex', flexDirection: 'column', background: '#020617', border: '1px solid var(--border)', position: 'relative', minHeight: '550px', overflow: 'hidden' }}>
           
           {/* Terminal / Matrix HUD */}
           <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontFamily: 'monospace', fontSize: '13px', fontWeight: 'bold' }}>
             <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
               <Terminal size={16} /> CHROMOSOME_TARGET: 17q21.31 (BRCA1)
             </div>
             <div>{splicing ? 'SPLICING_ACTIVE' : progress === 100 ? 'GENE_OVERWRITTEN' : 'AWAITING_COMMAND'}</div>
           </div>

           {/* Kayan DNA Dizilimi */}
           <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'monospace', fontSize: '18px', color: splicing ? 'var(--danger)' : 'var(--success)', fontWeight: 'bold', textShadow: splicing ? '0 0 10px var(--danger)' : '0 0 10px var(--success)', opacity: 0.8, overflow: 'hidden' }}>
              {dnaStream.map((line, i) => (
                <div key={i} style={{ opacity: 1 - (i * 0.1) }}>
                  {line}
                </div>
              ))}
              
              {/* Lazer Tarama Çizgisi */}
              <div style={{ position: 'absolute', top: '20%', left: 0, right: 0, height: '2px', background: splicing ? 'var(--danger)' : 'rgba(16, 185, 129, 0.5)', boxShadow: splicing ? '0 0 20px var(--danger)' : '0 0 20px var(--success)', animation: 'scanline 3s linear infinite' }} />
           </div>

           {/* 3D Helix Animasyonu Simülasyonu */}
           <div style={{ position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)', opacity: 0.2 }}>
              <Dna size={200} color={progress === 100 ? "var(--success)" : "var(--primary)"} style={{ animation: 'spin 10s linear infinite', filter: 'drop-shadow(0 0 30px var(--primary))' }} />
           </div>
           
           {/* Başarı Mesajı */}
           {progress === 100 && (
             <div className="animate-in" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(15, 23, 42, 0.9)', padding: '24px', borderRadius: '16px', border: '1px solid var(--success)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', boxShadow: '0 0 50px rgba(16, 185, 129, 0.3)' }}>
                <ShieldCheck size={48} color="var(--success)" />
                <span style={{ color: 'var(--success)', fontWeight: 900, fontSize: '18px', fontFamily: 'monospace' }}>MUTASYON İMHA EDİLDİ</span>
                <span style={{ color: 'var(--text)', fontSize: '13px' }}>Sağlıklı T-A dizilimi başarıyla implante edildi.</span>
             </div>
           )}

        </div>

        {/* Sağ Panel: Makas & Overwrite Kontrolü */}
        <div className="card gpu-accelerated animate-in delay-3" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--surface)' }}>
           
           <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Activity size={20} color="var(--danger)" /> CRISPR Kontrol Modülü
           </h3>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'var(--danger-dim)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '16px', borderRadius: '12px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', fontWeight: 800, marginBottom: '4px' }}>
                    <AlertTriangle size={16} /> Onko-Gen Tespit Edildi
                 </div>
                 <div style={{ fontSize: '12px', color: 'var(--text-sub)' }}>21. Kromozomda anormal hücre bölünmesini tetikleyen (Malign) bir DNA dizilimi tarandı.</div>
              </div>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text)', fontWeight: 700 }}>
                 <span>Kesim & Yeniden Yazma (Splicing)</span>
                 <span style={{ color: splicing ? 'var(--danger)' : 'var(--success)' }}>%{Math.floor(progress)}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
                 <div style={{ width: `${progress}%`, height: '100%', background: splicing ? 'var(--danger)' : 'var(--success)', transition: 'width 0.1s linear' }} />
              </div>
           </div>

           <div style={{ marginTop: 'auto' }}>
             <button 
               onClick={() => { setSplicing(true); setProgress(0); }} 
               disabled={splicing || progress === 100}
               className="btn" 
               style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '15px', background: splicing ? 'transparent' : progress === 100 ? 'var(--surface2)' : 'var(--danger)', color: splicing ? 'var(--danger)' : progress === 100 ? 'var(--muted)' : '#fff', border: splicing ? '1px solid var(--danger)' : progress === 100 ? '1px solid var(--border)' : 'none', boxShadow: (splicing || progress === 100) ? 'none' : '0 10px 25px rgba(239, 68, 68, 0.3)' }}>
                {splicing ? <><Scissors className="spin" size={18} /> Mutasyon Kesiliyor...</> : progress === 100 ? <><CheckCircle2 size={18} /> DNA Yamalandı</> : <><Scissors size={18} /> Cas9 Makasını Aktif Et</>}
             </button>
           </div>
           
           <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px' }}>
              <ShieldCheck size={20} color="var(--success)" style={{ flexShrink: 0 }} />
              <div>
                 <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--success)', marginBottom: '4px' }}>Biyolojik Onay (V18)</div>
                 <p style={{ fontSize: '12px', color: 'var(--text-sub)', margin: 0, lineHeight: 1.5 }}>
                    Splicing işlemi hastanın gen havuzundan %99.9 oranında kanseri sonsuza dek silecektir. 
                 </p>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
