'use client';

import React, { useState, useEffect } from 'react';
import { Printer, Droplet, Activity, Dna, ArrowDownToLine, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function BioPrintingPage() {
  const [printing, setPrinting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [layer, setLayer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (printing && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setPrinting(false);
            return 100;
          }
          return prev + 1;
        });
        setLayer(prev => prev + 45); // Layer artışı
      }, 300);
    }
    return () => clearInterval(interval);
  }, [printing, progress]);

  const totalLayers = 4500;

  return (
    <div className="gpu-accelerated fast-render" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-1px', color: 'var(--text)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Printer size={36} color="var(--success)" /> 3D Bio-Forge (Organ Yazıcısı)
            <span style={{ fontSize: '12px', background: 'linear-gradient(90deg, #10b981, #0ea5e9)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontWeight: 800 }}>V17 GOD MODE</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px', fontWeight: 500, margin: 0 }}>
            Hastanın kendi otolog kök hücreleri kullanılarak katman katman (layer-by-layer) canlı doku basımı.
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-ghost">Panele Dön</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px' }}>
        
        {/* Sol Panel: Bio-Ink & Ekstrüder Kontrolü */}
        <div className="card gpu-accelerated animate-in delay-2" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--surface)' }}>
           <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Droplet size={20} color="var(--primary)" /> Biyo-Mürekkep (Bio-Ink) Kartuşları
           </h3>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--text-sub)', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Dna size={14}/> Kök Hücre (Stem Cell) Jeli</span>
                    <span style={{ color: 'var(--success)', fontWeight: 800 }}>%85</span>
                 </div>
                 <div style={{ height: '6px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '85%', height: '100%', background: 'var(--success)', transition: 'width 0.3s ease' }} />
                 </div>
              </div>

              <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--text-sub)', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14}/> Büyüme Faktörü (Vasküler)</span>
                    <span style={{ color: 'var(--warning)', fontWeight: 800 }}>%42</span>
                 </div>
                 <div style={{ height: '6px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '42%', height: '100%', background: 'var(--warning)', transition: 'width 0.3s ease' }} />
                 </div>
              </div>
           </div>

           <div style={{ marginTop: 'auto' }}>
              <button 
                onClick={() => setPrinting(true)} 
                disabled={printing || progress === 100}
                className="btn" 
                style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '15px', background: printing ? 'transparent' : 'var(--success)', color: printing ? 'var(--muted)' : '#fff', border: printing ? '1px solid var(--border)' : 'none' }}>
                 {printing ? <><Zap className="spin" size={18} /> Ekstrüzyon İşlemi Sürüyor...</> : progress === 100 ? <><CheckCircle2 size={18} /> Organ Tamamlandı</> : <><ArrowDownToLine size={18} /> Karaciğer (Lob) Basımını Başlat</>}
              </button>
           </div>
        </div>

        {/* Sağ Panel: 3D Baskı Alanı & Hologram */}
        <div className="card gpu-accelerated animate-in delay-3" style={{ padding: '0', display: 'flex', flexDirection: 'column', background: '#020617', border: '1px solid var(--border)', position: 'relative', minHeight: '500px', overflow: 'hidden' }}>
           
           <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
              <div style={{ color: 'var(--success)', fontFamily: 'monospace', fontWeight: 'bold' }}>
                STATUS: {printing ? 'PRINTING_IN_PROGRESS' : progress === 100 ? 'PRINT_COMPLETE' : 'READY_FOR_GCODE'}
              </div>
              <div style={{ color: 'var(--success)', fontFamily: 'monospace', fontWeight: 'bold' }}>
                LAYER: {layer} / {totalLayers}
              </div>
           </div>

           {/* Baskı Simülasyonu */}
           <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              
              {/* Tarama Çizgisi */}
              {printing && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--success)', boxShadow: '0 0 15px var(--success)', animation: 'scanline 2s linear infinite' }} />
              )}
              
              <div style={{ position: 'relative' }}>
                <Activity size={160} color="var(--success)" style={{ opacity: 0.1, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                
                {/* Yükselen Organ Simülasyonu (Clip Path ile kesit gösterimi) */}
                <div style={{ 
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '160px', height: '160px', overflow: 'hidden'
                 }}>
                   <div style={{ 
                      position: 'absolute', bottom: 0, left: 0, right: 0, 
                      height: `${progress}%`, background: 'rgba(16, 185, 129, 0.3)', 
                      backdropFilter: 'blur(4px)', borderTop: printing ? '2px solid var(--success)' : 'none',
                      transition: 'height 0.3s linear', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 -10px 20px rgba(16, 185, 129, 0.2)'
                   }}>
                      <div style={{ width: '100%', height: '100%', backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(16, 185, 129, 0.3) 25%, rgba(16, 185, 129, 0.3) 26%, transparent 27%, transparent 74%, rgba(16, 185, 129, 0.3) 75%, rgba(16, 185, 129, 0.3) 76%, transparent 77%, transparent)', backgroundSize: '20px 20px', animation: printing ? 'panUp 10s linear infinite' : 'none' }} />
                   </div>
                </div>
              </div>

              {progress === 100 && (
                <div className="animate-in" style={{ position: 'absolute', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--success)', padding: '12px 24px', borderRadius: '12px', backdropFilter: 'blur(10px)', color: 'var(--success)', fontWeight: 800, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 30px rgba(16,185,129,0.2)' }}>
                   <CheckCircle2 size={24} /> Canlı Doku Başarıyla Basıldı (Vasküler Ağ Bağlandı)
                </div>
              )}
           </div>

           {/* Alt Progress Bar */}
           <div style={{ padding: '24px', background: 'var(--surface2)', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: 'var(--text-sub)', fontWeight: 800 }}>
                 <span>TOPLAM İLERLEME</span>
                 <span style={{ color: 'var(--success)' }}>%{progress}</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
                 <div style={{ width: `${progress}%`, height: '100%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)', transition: 'width 0.3s linear' }} />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
