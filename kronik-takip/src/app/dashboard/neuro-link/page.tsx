'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Brain, Radio, Wifi, Zap, Eye, Battery, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function NeuroLinkPage() {
  const [eegData, setEegData] = useState<number[]>([]);
  const [status, setStatus] = useState('SYNCING');
  
  // Fake EEG dalgası oluşturucu
  useEffect(() => {
    setTimeout(() => setStatus('CONNECTED'), 2500);
    const interval = setInterval(() => {
      if (status !== 'SYNCING') {
        const newData = Array.from({length: 40}, () => Math.floor(Math.random() * 100));
        setEegData(newData);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="gpu-accelerated fast-render" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1px', color: '#0f172a', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Brain size={36} color="#a855f7" /> Brain-Computer Interface
            <span style={{ fontSize: '12px', background: 'linear-gradient(90deg, #a855f7, #6366f1)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontWeight: 800 }}>NEUROLINK V14</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px', fontWeight: 500, margin: 0 }}>
            Felçli (ALS, Quadriplegia) hastalar için gerçek zamanlı EEG nöro-bağlantı paneli.
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-ghost">Panere Dön</Link>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
        
        {/* Sol: EEG Dalga Monitörü */}
        <div className="card gpu-accelerated animate-in delay-2" style={{ background: '#0f172a', border: '1px solid rgba(168,85,247,0.3)', padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ color: '#fff', fontSize: '18px', fontWeight: 800 }}>Canlı Korteks Dalgaları</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: status === 'SYNCING' ? '#facc15' : '#10b981', fontSize: '14px', fontWeight: 700 }}>
              {status === 'SYNCING' ? <Radio size={16} className="spin" /> : <Activity size={16} />} 
              {status === 'SYNCING' ? 'Cihaz Eşitleniyor...' : 'Tam Bağlantı (12ms Ping)'}
            </div>
          </div>
          
          <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '4px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {status === 'SYNCING' ? (
               <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '16px' }}>EEG Sinyali Bekleniyor...</div>
            ) : (
               eegData.map((val, i) => (
                 <div key={i} style={{ 
                   flex: 1, 
                   background: `linear-gradient(0deg, rgba(168,85,247,0.2) 0%, rgba(99,102,241,0.8) 100%)`, 
                   height: `${val}%`,
                   borderRadius: '4px 4px 0 0',
                   transition: 'height 0.4s ease-in-out'
                 }} />
               ))
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '12px', marginTop: '12px', fontWeight: 600 }}>
             <span>Delta (0.5-4Hz)</span>
             <span>Theta (4-8Hz)</span>
             <span>Alpha (8-12Hz)</span>
             <span>Beta (12-30Hz)</span>
             <span>Gamma (30+Hz)</span>
          </div>
        </div>

        {/* Sağ: Zihinsel Komut Algılayıcı */}
        <div className="card gpu-accelerated animate-in delay-3" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
           <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={20} color="#f59e0b" /> Algılanan Nöro-Komut
           </h3>
           
           <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1', padding: '24px' }}>
              {status === 'SYNCING' ? (
                <>
                  <Eye size={48} color="#94a3b8" style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <div style={{ color: '#64748b', fontWeight: 600 }}>Kalibrasyon Bekleniyor</div>
                </>
              ) : (
                <>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', animation: 'pulseGlow 2s infinite' }}>
                    <Activity size={40} color="#10b981" />
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>"Su İstiyorum"</div>
                  <div style={{ fontSize: '13px', color: '#10b981', fontWeight: 700, marginTop: '8px' }}>%98 Doğruluk (Motor Korteks)</div>
                </>
              )}
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f1f5f9', borderRadius: '8px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#475569' }}><Battery size={16}/> İmplant Şarjı</div>
                 <div style={{ fontWeight: 800, color: '#10b981' }}>%84</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f1f5f9', borderRadius: '8px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#475569' }}><ShieldAlert size={16}/> Nöbet Riski</div>
                 <div style={{ fontWeight: 800, color: '#3b82f6' }}>Düşük</div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
