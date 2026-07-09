'use client';

import React, { useState, useEffect } from 'react';
import { Crosshair, Zap, Activity, ShieldAlert, Cpu, Heart, AlertTriangle, Play, Pause, Navigation, Scissors } from 'lucide-react';
import Link from 'next/link';

export default function CyberSurgeryPage() {
  const [inSurgery, setInSurgery] = useState(false);
  const [latency, setLatency] = useState(12);
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    let interval: any;
    if (inSurgery) {
      interval = setInterval(() => {
        setLatency(prev => (prev === 12 ? 14 : prev === 14 ? 11 : 12));
        setDepth(prev => (prev < 4.5 ? prev + 0.1 : prev));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [inSurgery]);

  return (
    <div className="gpu-accelerated fast-render" style={{ padding: '20px', maxWidth: '1300px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-1px', color: 'var(--text)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Crosshair size={36} color="var(--danger)" /> Tele-Cerrahi (Robotic Surgery)
            <span style={{ fontSize: '12px', background: 'linear-gradient(90deg, #ef4444, #f97316)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontWeight: 800 }}>V16 CYBER-MED</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px', fontWeight: 500, margin: 0 }}>
            Da Vinci / Senhance robotik kollarının 5G ağları üzerinden "Haptic (Dokunsal)" uzaktan kontrol paneli.
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-ghost">Panele Dön</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
        
        {/* Sol Panel: Operasyon Ekranı */}
        <div className="card gpu-accelerated animate-in delay-2" style={{ padding: '0', overflow: 'hidden', background: '#000', border: '1px solid var(--border)', position: 'relative', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
           
           {/* HUD Overlay */}
           <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '20px', display: 'flex', justifyContent: 'space-between', pointerEvents: 'none', zIndex: 10 }}>
              <div style={{ display: 'flex', gap: '12px', color: '#00f2fe', fontFamily: 'monospace', fontSize: '14px', textShadow: '0 0 10px #00f2fe' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={16} /> HR: {inSurgery ? '68' : '72'} bpm</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Zap size={16} /> LATENCY: {latency}ms</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', color: '#ef4444', fontFamily: 'monospace', fontSize: '14px', textShadow: '0 0 10px #ef4444' }}>
                 <span>REC 🔴</span>
                 <span>4K 60FPS</span>
              </div>
           </div>

           {/* 3D Simüle Ekran */}
           <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {/* Target Reticle */}
              <div style={{ position: 'absolute', width: '200px', height: '200px', border: '1px solid rgba(0, 242, 254, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: inSurgery ? 'spin 10s linear infinite' : 'none' }}>
                 <div style={{ width: '100px', height: '100px', border: '1px dashed rgba(239, 68, 68, 0.4)', borderRadius: '50%' }} />
              </div>
              
              <Heart size={inSurgery ? 140 : 120} color={inSurgery ? '#ef4444' : '#64748b'} style={{ transition: 'all 0.5s ease', opacity: 0.8, filter: inSurgery ? 'drop-shadow(0 0 30px rgba(239,68,68,0.5))' : 'none', animation: inSurgery ? 'pulseGlow 1s infinite alternate' : 'none' }} />
              
              {inSurgery && (
                <>
                  {/* Robot Arms Simulation */}
                  <div style={{ position: 'absolute', bottom: '0', left: '20%', width: '4px', height: '200px', background: 'linear-gradient(to top, #334155, #94a3b8)', transform: 'rotate(25deg)', transformOrigin: 'bottom', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
                    <div style={{ position: 'absolute', top: '-10px', left: '-6px', color: '#cbd5e1' }}><Scissors size={16} style={{ transform: 'rotate(-45deg)' }}/></div>
                  </div>
                  <div style={{ position: 'absolute', bottom: '0', right: '20%', width: '4px', height: '180px', background: 'linear-gradient(to top, #334155, #94a3b8)', transform: 'rotate(-25deg)', transformOrigin: 'bottom', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
                     <div style={{ position: 'absolute', top: '-14px', left: '-6px', color: '#ef4444' }}><Crosshair size={16}/></div>
                  </div>
                </>
              )}
           </div>

           {/* Toolbar */}
           <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button onClick={() => setInSurgery(!inSurgery)} className="btn" style={{ background: inSurgery ? 'rgba(239,68,68,0.2)' : 'var(--primary)', color: inSurgery ? '#ef4444' : '#fff', border: inSurgery ? '1px solid #ef4444' : 'none', padding: '12px 32px', fontSize: '16px' }}>
                 {inSurgery ? <><Pause size={20} /> Cerrahisi Beklet</> : <><Play size={20} /> Kontrolü Devral (Haptic On)</>}
              </button>
           </div>
        </div>

        {/* Sağ Panel: Haptic & Robot Durumu */}
        <div className="card gpu-accelerated animate-in delay-3" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--surface)' }}>
           
           <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Cpu size={20} color="var(--primary)" /> Robotik Kollar & Telemetri
           </h3>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--text-sub)', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Navigation size={14}/> Sol Kol (Kesici) Derinliği</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 800 }}>{depth.toFixed(1)} mm</span>
                 </div>
                 <div style={{ height: '6px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(depth / 10) * 100}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s ease' }} />
                 </div>
              </div>

              <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--text-sub)', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Crosshair size={14}/> Sağ Kol (Lazer) Isısı</span>
                    <span style={{ color: inSurgery ? 'var(--danger)' : 'var(--muted)', fontWeight: 800 }}>{inSurgery ? '42°C' : '20°C'}</span>
                 </div>
                 <div style={{ height: '6px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: inSurgery ? '42%' : '20%', height: '100%', background: inSurgery ? 'var(--danger)' : 'var(--muted)', transition: 'width 1s ease' }} />
                 </div>
              </div>

           </div>

           <div style={{ marginTop: 'auto', padding: '16px', background: 'var(--warning-dim)', border: '1px solid var(--warning)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', fontWeight: 800, fontSize: '14px', marginBottom: '6px' }}>
                 <AlertTriangle size={16} /> Haptic Feedback (Dokunsal) Aktif
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-sub)', margin: 0, lineHeight: 1.5 }}>
                 Doktor konsolundaki dokunsal eldivenler ile senkronizasyon başarılı. Kesi esnasında organ dokusunun direnci doktorun eline gerçek zamanlı (12ms gecikme) iletilmektedir.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
