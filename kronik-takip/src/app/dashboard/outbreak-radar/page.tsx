'use client';

import React, { useState, useEffect } from 'react';
import { Radar, Globe2, ShieldAlert, Activity, MapPin, Radio, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function OutbreakRadarPage() {
  const [scanning, setScanning] = useState(true);
  
  // Radar noktaları simülasyonu
  const [points, setPoints] = useState<any[]>([]);

  useEffect(() => {
    // Rastgele dünya üzerinde kırmızı alarm noktaları oluştur
    const generatePoints = () => {
      const newPoints = Array.from({length: 5}, () => ({
        top: Math.floor(Math.random() * 80) + 10 + '%',
        left: Math.floor(Math.random() * 80) + 10 + '%',
        size: Math.floor(Math.random() * 20) + 10,
        opacity: Math.random() * 0.5 + 0.5,
      }));
      setPoints(newPoints);
    };

    generatePoints();
    const interval = setInterval(generatePoints, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="gpu-accelerated fast-render" style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-1px', color: 'var(--text)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Globe2 size={36} color="var(--warning)" /> Global Pandemi & Salgın Radarı
            <span style={{ fontSize: '12px', background: 'linear-gradient(90deg, #f59e0b, #ef4444)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontWeight: 800 }}>V16 COMMAND CENTER</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px', fontWeight: 500, margin: 0 }}>
            DSÖ (WHO) ve Uydu Veri Ağları üzerinden anlık patojen ve mutasyon tespit haritası.
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-ghost">Panele Dön</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
        
        {/* Sol Panel: Dünya Radar Simülasyonu */}
        <div className="card gpu-accelerated animate-in delay-2" style={{ padding: 0, position: 'relative', overflow: 'hidden', background: '#020617', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           
           {/* Grid Arkaplan */}
           <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

           {/* Radar Çemberleri */}
           <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', border: '1px solid rgba(245, 158, 11, 0.2)' }} />
           <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', border: '1px solid rgba(245, 158, 11, 0.4)' }} />
           <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', border: '1px dashed rgba(245, 158, 11, 0.6)' }} />
           
           {/* Dönen Radar Taraması (Sweep) */}
           <div style={{ position: 'absolute', width: '250px', height: '250px', top: '50%', left: '50%', transformOrigin: 'top left', background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(245, 158, 11, 0.4) 360deg)', animation: 'spin 4s linear infinite', borderRight: '2px solid var(--warning)' }} />
           
           {/* Merkez İkon */}
           <Globe2 size={64} color="var(--warning)" style={{ position: 'absolute', opacity: 0.8, filter: 'drop-shadow(0 0 20px var(--warning))' }} />

           {/* Anomali Noktaları */}
           {points.map((p, i) => (
             <div key={i} style={{ position: 'absolute', top: p.top, left: p.left, width: p.size, height: p.size, background: 'var(--danger)', borderRadius: '50%', opacity: p.opacity, filter: 'drop-shadow(0 0 10px var(--danger))', animation: 'pulseGlow 1s infinite alternate' }} />
           ))}
           
           {/* HUD Overlay Text */}
           <div style={{ position: 'absolute', top: '20px', left: '20px', color: 'var(--warning)', fontFamily: 'monospace', fontSize: '13px', fontWeight: 'bold', textShadow: '0 0 5px var(--warning)' }}>
              <div>SAT-UPLINK: ONLINE</div>
              <div>SCAN-RES: 0.5 METER</div>
              <div>BIO-THREAT: SCANNING...</div>
           </div>
        </div>

        {/* Sağ Panel: Tespit Edilen Anomaliler */}
        <div className="card gpu-accelerated animate-in delay-3" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--surface)' }}>
           
           <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--danger)', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <ShieldAlert size={20} /> Kritik Tespitler (Son 24 Saat)
           </h3>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              
              {/* Tespit Kartı 1 */}
              <div style={{ padding: '16px', background: 'var(--danger-dim)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontWeight: 800, fontSize: '15px' }}>
                       <Radar size={16} /> BÖLGE: Güneydoğu Asya
                    </div>
                    <span style={{ fontSize: '11px', background: 'var(--danger)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>SIVI KIRMIZI</span>
                 </div>
                 <div style={{ fontSize: '13px', color: 'var(--text-sub)', marginBottom: '12px' }}>
                    Solunum yolu enfeksiyonu (Viral). %400 vaka artışı tespit edildi. H5N1 varyantı şüphesi.
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text)', fontWeight: 600 }}>
                    <Activity size={14} color="var(--warning)"/> R0 Değeri: 4.2 (Yüksek Bulaş)
                 </div>
              </div>

              {/* Tespit Kartı 2 */}
              <div style={{ padding: '16px', background: 'var(--warning-dim)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--warning)', fontWeight: 800, fontSize: '15px' }}>
                       <Radar size={16} /> BÖLGE: Doğu Avrupa
                    </div>
                    <span style={{ fontSize: '11px', background: 'var(--warning)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>SARI KOD</span>
                 </div>
                 <div style={{ fontSize: '13px', color: 'var(--text-sub)', marginBottom: '12px' }}>
                    Açıklanamayan su kaynaklı zehirlenme kümelenmesi. 214 yeni vaka.
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text)', fontWeight: 600 }}>
                    <MapPin size={14} color="var(--primary)"/> Vektör: Kontamine İçme Suyu
                 </div>
              </div>

           </div>

           {/* Aksiyon Butonu */}
           <button className="btn" style={{ padding: '16px', fontSize: '15px', background: 'var(--danger)', color: '#fff', width: '100%', justifyContent: 'center', boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)' }}>
              <Radio size={20} /> DSÖ (WHO) ve Sağlık Bakanlığı'nı Uyar
           </button>
        </div>

      </div>
    </div>
  );
}
