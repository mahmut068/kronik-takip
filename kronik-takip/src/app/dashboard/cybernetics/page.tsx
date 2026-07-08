'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Zap, RotateCcw, Link2, Target, Crosshair, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function CyberneticsPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(30); // %30'dan başlar
  
  // Volt ve Ping dalgalanması
  const [volt, setVolt] = useState(4.2);
  const [ping, setPing] = useState(24);

  useEffect(() => {
    let voltInterval: any;
    voltInterval = setInterval(() => {
      setVolt(prev => parseFloat((4.2 + (Math.random() * 0.4 - 0.2)).toFixed(2)));
      if(syncing) {
        setPing(prev => prev > 2 ? prev - 1 : 2);
      } else {
        setPing(prev => prev < 24 ? prev + 1 : 24);
      }
    }, 1000);
    
    let syncInterval: any;
    if (syncing && syncProgress < 100) {
      syncInterval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= 100) {
            setSyncing(false);
            return 100;
          }
          return prev + 2;
        });
      }, 200);
    }
    
    return () => {
      clearInterval(voltInterval);
      clearInterval(syncInterval);
    };
  }, [syncing, syncProgress]);

  return (
    <div className="gpu-accelerated fast-render" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-1px', color: 'var(--text)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Settings size={36} color="var(--warning)" /> Biyonik & Cyborg Kalibrasyonu
            <span style={{ fontSize: '12px', background: 'linear-gradient(90deg, #f59e0b, #ef4444)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontWeight: 800 }}>V17 GOD MODE</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px', fontWeight: 500, margin: 0 }}>
            Nöromusküler entegrasyon (Protez Kol/Göz) için servo motor ve nöral tepkime ayarları.
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-ghost">Panele Dön</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px' }}>
        
        {/* Sol Panel: Biyonik Şema (Robot Kol) */}
        <div className="card gpu-accelerated animate-in delay-2" style={{ padding: '0', display: 'flex', flexDirection: 'column', background: '#050812', border: '1px solid var(--border)', position: 'relative', minHeight: '500px', overflow: 'hidden' }}>
           
           <div style={{ padding: '24px', position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ color: 'var(--warning)', fontFamily: 'monospace', fontWeight: 'bold' }}>MODEL: TITAN-ARM V4</div>
              <div style={{ color: 'var(--muted)', fontFamily: 'monospace', fontWeight: 'bold' }}>SN: 9812-XT</div>
           </div>

           {/* Şematik Çizim / Wireframe Simülasyonu */}
           <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', opacity: 0.8 }}>
              
              {/* Kol Eklem Daireleri */}
              <div style={{ position: 'absolute', top: '30%', left: '30%', width: '30px', height: '30px', borderRadius: '50%', border: '2px solid var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <div style={{ width: '8px', height: '8px', background: 'var(--warning)', borderRadius: '50%', animation: 'pulseGlow 1s infinite alternate' }} />
              </div>
              
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%', animation: 'pulseGlow 1.5s infinite alternate' }} />
              </div>

              <div style={{ position: 'absolute', top: '70%', left: '70%', width: '20px', height: '20px', borderRadius: '50%', border: '2px dashed var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Crosshair size={12} color="var(--danger)" />
              </div>
              
              {/* Bağlantı Çizgileri */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <line x1="30%" y1="30%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="50%" y1="50%" x2="70%" y2="70%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="5,5" />
              </svg>

              {syncing && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(245, 158, 11, 0.05)', animation: 'pulseGlow 0.5s infinite alternate' }} />
              )}
           </div>

           {/* Telemetri Barı */}
           <div style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.8)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                 <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 800 }}>PİL DURUMU</span>
                 <span style={{ fontSize: '18px', color: 'var(--success)', fontWeight: 900 }}>%94</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                 <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 800 }}>SERVO SICAKLIĞI</span>
                 <span style={{ fontSize: '18px', color: 'var(--warning)', fontWeight: 900 }}>34°C</span>
              </div>
           </div>
        </div>

        {/* Sağ Panel: Sinir (Nöral) Bağlantı Kalibrasyonu */}
        <div className="card gpu-accelerated animate-in delay-3" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
           
           <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Link2 size={20} color="var(--primary)" /> Nöromusküler Senkronizasyon
           </h3>

           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              
              <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 <div style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 700, marginBottom: '8px', display: 'flex', gap: '6px' }}><Zap size={14}/> Giriş Voltajı</div>
                 <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--warning)', fontFamily: 'monospace' }}>{volt}V</div>
              </div>

              <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 <div style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 700, marginBottom: '8px', display: 'flex', gap: '6px' }}><Target size={14}/> Sinaptik Ping (Gecikme)</div>
                 <div style={{ fontSize: '24px', fontWeight: 900, color: syncProgress === 100 ? 'var(--success)' : 'var(--danger)', fontFamily: 'monospace' }}>{ping}ms</div>
              </div>

           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text)', fontWeight: 700 }}>
                 <span>Senkronizasyon (Beyin <-> Uzuv)</span>
                 <span style={{ color: syncProgress === 100 ? 'var(--success)' : 'var(--warning)' }}>%{syncProgress}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
                 <div style={{ width: `${syncProgress}%`, height: '100%', background: syncProgress === 100 ? 'var(--success)' : 'var(--warning)', transition: 'width 0.2s linear' }} />
              </div>
           </div>

           <div style={{ marginTop: 'auto' }}>
             <button 
               onClick={() => { setSyncing(true); setSyncProgress(30); }} 
               disabled={syncing || syncProgress === 100}
               className="btn" 
               style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '15px', background: syncing ? 'transparent' : syncProgress === 100 ? 'var(--success)' : 'var(--warning)', color: (syncing || syncProgress === 100) ? '#fff' : '#000', border: syncing ? '1px solid var(--warning)' : 'none', boxShadow: syncing ? 'none' : '0 10px 25px rgba(245, 158, 11, 0.3)' }}>
                {syncing ? <><RotateCcw className="spin" size={18} /> Kalibre Ediliyor...</> : syncProgress === 100 ? <><Target size={18} /> Maksimum (2ms) Uyum Sağlandı</> : <><RotateCcw size={18} /> Nöral Senkronizasyonu Başlat</>}
             </button>
           </div>
           
           <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px' }}>
              <AlertTriangle size={20} color="var(--danger)" style={{ flexShrink: 0 }} />
              <div>
                 <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--danger)', marginBottom: '4px' }}>Ameliyat Sonrası Uyarı</div>
                 <p style={{ fontSize: '12px', color: 'var(--text-sub)', margin: 0, lineHeight: 1.5 }}>
                    Cyborg uzvun beyin korteksiyle ilk entegrasyonu (Ping süresi 2ms olana kadar) hafif kas spazmlarına yol açabilir. Motor becerileri 72 saat içinde %100 kapasiteye ulaşacaktır.
                 </p>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
