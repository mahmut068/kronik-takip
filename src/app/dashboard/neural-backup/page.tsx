'use client';

import React, { useState, useEffect } from 'react';
import { Brain, CloudUpload, HardDrive, Cpu, RadioTower, Database, Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function NeuralBackupPage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [synapses, setSynapses] = useState(0);

  useEffect(() => {
    let interval: any;
    if (uploading && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setUploading(false);
            return 100;
          }
          return prev + 0.5; // Yavaş upload simülasyonu
        });
        setSynapses(prev => prev + Math.floor(Math.random() * 500000) + 100000);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [uploading, progress]);

  return (
    <div className="gpu-accelerated fast-render" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-1px', color: 'var(--text)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Brain size={36} color="var(--purple)" /> Nöral Hafıza Yedekleme (Engram Storage)
            <span style={{ fontSize: '12px', background: 'linear-gradient(90deg, #d946ef, #8b5cf6)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontWeight: 800 }}>V17 GOD MODE</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px', fontWeight: 500, margin: 0 }}>
            Alzheimer/Amnezi hastalarının anılarını ve kişilik örüntülerini (Engram) kuantum bulut sunucularına aktarma merkezi.
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-ghost">Panele Dön</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Sol Panel: Korteks Tarama */}
        <div className="card gpu-accelerated animate-in delay-2" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--surface2)', position: 'relative', overflow: 'hidden' }}>
           
           <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: uploading ? 'var(--purple)' : 'var(--border)', boxShadow: uploading ? '0 0 20px var(--purple)' : 'none', transition: 'all 0.3s' }} />

           <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
             <div>
                <div style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 800, letterSpacing: '1px' }}>HASTA ID</div>
                <div style={{ fontSize: '20px', color: 'var(--text)', fontWeight: 900, fontFamily: 'monospace' }}>PT-X-9921</div>
             </div>
             <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 800, letterSpacing: '1px' }}>DURUM</div>
                <div style={{ fontSize: '20px', color: uploading ? 'var(--warning)' : progress === 100 ? 'var(--success)' : 'var(--muted)', fontWeight: 900 }}>
                  {uploading ? 'UPLOAD EDİLİYOR' : progress === 100 ? 'YEDEKLEME TAMAM' : 'BEKLEMEDE'}
                </div>
             </div>
           </div>

           {/* Holografik Beyin / Veri Akışı Simülasyonu */}
           <div style={{ position: 'relative', width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
             
             {uploading && (
               <>
                 <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '1px dashed var(--purple)', animation: 'spin 4s linear infinite', opacity: 0.5 }} />
                 <div style={{ position: 'absolute', inset: -40, borderRadius: '50%', border: '1px solid var(--accent)', animation: 'spin 8s linear infinite reverse', opacity: 0.2 }} />
                 
                 {/* Uploading Particles */}
                 {[...Array(8)].map((_, i) => (
                   <div key={i} style={{ position: 'absolute', top: '50%', left: '50%', width: '4px', height: '4px', background: 'var(--purple)', borderRadius: '50%', boxShadow: '0 0 10px var(--purple)', transform: `rotate(${i * 45}deg) translateY(-100px)`, animation: 'pulseGlow 1s infinite alternate', animationDelay: `${i * 0.1}s` }} />
                 ))}
               </>
             )}

             <Brain size={120} color={uploading ? 'var(--purple)' : progress === 100 ? 'var(--success)' : 'var(--muted)'} style={{ filter: uploading ? 'drop-shadow(0 0 40px var(--purple))' : progress === 100 ? 'drop-shadow(0 0 40px var(--success))' : 'none', transition: 'all 0.5s' }} />
             
             {progress === 100 && (
                <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--success)', borderRadius: '50%', padding: '8px', color: '#fff', boxShadow: '0 0 20px var(--success)' }}>
                  <CheckCircle size={24} />
                </div>
             )}
           </div>

           <button 
             onClick={() => setUploading(true)} 
             disabled={uploading || progress === 100}
             className="btn" 
             style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '15px', background: uploading ? 'transparent' : progress === 100 ? 'var(--success)' : 'var(--purple)', color: (uploading || progress === 100) ? '#fff' : '#fff', border: uploading ? '1px solid var(--purple)' : 'none', boxShadow: uploading ? 'none' : '0 10px 25px rgba(139, 92, 246, 0.4)' }}>
              {uploading ? <><CloudUpload className="spin" size={18} /> Synapse Aktarımı: %{progress.toFixed(1)}</> : progress === 100 ? <><CheckCircle size={18} /> Veri Bulutta Güvende</> : <><CloudUpload size={18} /> Engram Upload Başlat</>}
           </button>

           {uploading && (
             <div style={{ width: '100%', height: '4px', background: 'var(--bg)', borderRadius: '2px', overflow: 'hidden', marginTop: '16px' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--purple)', boxShadow: '0 0 10px var(--purple)' }} />
             </div>
           )}
        </div>

        {/* Sağ Panel: Bulut Sunucu Analizi */}
        <div className="card gpu-accelerated animate-in delay-3" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
           
           <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Database size={20} color="var(--primary)" /> Kuantum Bulut Deposu (Storage)
           </h3>

           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              
              <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 <div style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 700, marginBottom: '8px', display: 'flex', gap: '6px' }}><Cpu size={14}/> Aktarılan Sinaps</div>
                 <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text)', fontFamily: 'monospace' }}>{(synapses / 1000000).toFixed(2)} M</div>
                 <div style={{ fontSize: '11px', color: 'var(--success)', marginTop: '4px', fontWeight: 'bold' }}>KAYIP: %0.0001</div>
              </div>

              <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 <div style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 700, marginBottom: '8px', display: 'flex', gap: '6px' }}><HardDrive size={14}/> Kapasite (Zettabyte)</div>
                 <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text)', fontFamily: 'monospace' }}>24.1 ZB</div>
                 <div style={{ fontSize: '11px', color: 'var(--warning)', marginTop: '4px', fontWeight: 'bold' }}>ŞİFRELENİYOR (AES-4096)</div>
              </div>
           </div>

           <div style={{ marginTop: 'auto', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple)', flexShrink: 0 }}>
                    <Lock size={20} />
                 </div>
                 <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>Dijital Ruh Koruması Aktif</div>
                    <p style={{ fontSize: '13px', color: 'var(--text-sub)', margin: 0, lineHeight: 1.5 }}>
                       Hastanın anıları, travmaları, yetenekleri ve genel kişilik matrisi tamamen dijital bir "Engram" kopyasına dönüştürülüyor. Beyin ölümü gerçekleşse dahi bu veri biyonik bir bedene (Sleeve) aktarılabilir.
                    </p>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
