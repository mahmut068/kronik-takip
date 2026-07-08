'use client';

import { useState, useEffect } from 'react';
import { Watch, HeartPulse, Activity, Wifi, BatteryMedium, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function IoTPage() {
  const [pulse, setPulse] = useState(72);
  
  useEffect(() => {
    // Nabız değerinin her 2 saniyede bir hafif oynaması
    const interval = setInterval(() => {
      setPulse(prev => {
        const diff = Math.floor(Math.random() * 5) - 2; // -2 to +2
        let newPulse = prev + diff;
        if (newPulse < 60) newPulse = 60;
        if (newPulse > 110) newPulse = 110;
        return newPulse;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-in" style={{ paddingBottom: '40px' }}>
      
      {/* ── Header ── */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f0f9ff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Watch size={30} color="#00e5ff" />
          IoT & Giyilebilir Teknoloji Merkezi
        </h1>
        <p style={{ color: '#8aafc7', marginTop: '6px', fontSize: '14px' }}>
          Hastaların akıllı saat ve tıbbi cihazlarından gelen anlık telemetri verileri (Gerçek Zamanlı).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* ── Live EKG Simulator ── */}
        <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#e2f0f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HeartPulse size={20} color="#f43f5e" /> Anlık EKG / Nabız (Ahmet Yılmaz)
            </h2>
            <div className="badge" style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f43f5e', animation: 'pulseRing 1s infinite' }} />
              Canlı Takip
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
             <div style={{ fontSize: '64px', fontWeight: 800, color: '#e2f0f9', textShadow: '0 0 20px rgba(244,63,94,0.4)', lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: '8px' }}>
               {pulse} <span style={{ fontSize: '16px', color: '#f43f5e', fontWeight: 600 }}>BPM</span>
             </div>
             <div style={{ width: '100%', height: '60px', position: 'relative', overflow: 'hidden' }}>
                {/* Fake EKG Wave Animation with CSS */}
                <div style={{ 
                  position: 'absolute', top: '50%', left: 0, width: '200%', height: '2px', background: 'rgba(244,63,94,0.3)',
                  display: 'flex', alignItems: 'center', animation: 'slideLeft 3s linear infinite'
                 }}>
                   {Array.from({ length: 10 }).map((_, i) => (
                     <div key={i} style={{ width: '20%', display: 'flex', alignItems: 'center' }}>
                       <div style={{ width: '60%', height: '2px', background: '#f43f5e' }} />
                       <div style={{ width: '10%', height: '40px', borderLeft: '2px solid #f43f5e', transform: 'rotate(20deg)', transformOrigin: 'bottom' }} />
                       <div style={{ width: '10%', height: '60px', borderLeft: '2px solid #f43f5e', transform: 'rotate(-20deg)', transformOrigin: 'top', marginTop: '-20px' }} />
                       <div style={{ width: '20%', height: '2px', background: '#f43f5e' }} />
                     </div>
                   ))}
                </div>
             </div>
          </div>
          
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, padding: '12px', background: 'rgba(16,185,129,0.1)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center' }}>
               <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>Ritim Durumu</div>
               <div style={{ fontSize: '14px', color: '#e2f0f9', fontWeight: 700, marginTop: '4px' }}>Sinüs Ritmi (Normal)</div>
            </div>
            <div style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
               <div style={{ fontSize: '11px', color: '#8aafc7', fontWeight: 600 }}>Son Senkronizasyon</div>
               <div style={{ fontSize: '14px', color: '#e2f0f9', fontWeight: 700, marginTop: '4px' }}>2 sn önce</div>
            </div>
          </div>
        </div>

        {/* ── Connected Devices List ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '28px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#e2f0f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={20} color="#00e5ff" /> Senkronize Cihazlar
              </h2>
              <button className="btn btn-ghost" style={{ padding: '6px' }}><RefreshCw size={14} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Apple Watch */}
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Watch size={20} color="#e2f0f9" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2f0f9' }}>Apple Watch Series 9</div>
                    <div style={{ fontSize: '11px', color: '#8aafc7', marginTop: '4px' }}>Hasta: Ahmet Yılmaz</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10b981', fontWeight: 600 }}>
                     <Wifi size={12} /> Bağlı
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#8aafc7' }}>
                     <BatteryMedium size={12} /> %82
                   </div>
                </div>
              </div>

              {/* Omron */}
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity size={20} color="#3b82f6" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2f0f9' }}>Omron X7 Smart</div>
                    <div style={{ fontSize: '11px', color: '#8aafc7', marginTop: '4px' }}>Hasta: Ayşe Kaya (Tansiyon)</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10b981', fontWeight: 600 }}>
                     <Wifi size={12} /> Bağlı
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#f59e0b' }}>
                     <BatteryMedium size={12} /> %15
                   </div>
                </div>
              </div>

              {/* Xiaomi Band (Disconnected) */}
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(244,63,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Watch size={20} color="#f43f5e" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2f0f9' }}>Xiaomi Smart Band 8</div>
                    <div style={{ fontSize: '11px', color: '#f43f5e', marginTop: '4px' }}>Hasta: Mehmet Demir</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#f43f5e', fontWeight: 600 }}>
                     <AlertTriangle size={12} /> Bağlantı Yok
                   </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
