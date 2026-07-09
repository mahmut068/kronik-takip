'use client';

import { useState, useEffect } from 'react';
import { Truck, Map, Radio, AlertTriangle, ShieldCheck, Route, ShieldAlert, Car } from 'lucide-react';

export default function DispatchPage() {
  const [emergency, setEmergency] = useState(false);
  const [dispatched, setDispatched] = useState(false);
  const [carPos, setCarPos] = useState(0);

  useEffect(() => {
    // Rastgele bir acil durum tetikle (simülasyon)
    const timer = setTimeout(() => {
      if (!dispatched) setEmergency(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [dispatched]);

  const handleDispatch = () => {
    setEmergency(false);
    setDispatched(true);
    
    // Araç animasyonu
    let pos = 0;
    const interval = setInterval(() => {
      pos += 2;
      setCarPos(pos);
      if (pos >= 80) {
        clearInterval(interval);
      }
    }, 50);
  };

  return (
    <div className="animate-in" style={{ paddingBottom: '40px' }}>
      
      {/* ── Header ── */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="text-gradient" style={{ fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(90deg, #f43f5e, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <Truck size={30} color="#f43f5e" />
          Evde Sağlık & Ambulans Filosu
        </h1>
        <p style={{ color: '#8aafc7', marginTop: '6px', fontSize: '14px' }}>
          Saha ekiplerini harita üzerinden canlı takip edin ve acil durumlarda otonom araç yönlendirin.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* ── Live Map Simulation ── */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          <div style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Map size={20} color="#8aafc7" />
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#e2f0f9' }}>Canlı Saha Radarı</div>
            </div>
            <div className="badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', gap: '6px' }}>
              <Radio size={12} /> RADAR AKTİF
            </div>
          </div>

          <div style={{ 
            flex: 1, minHeight: '450px', background: '#0b1626', position: 'relative', overflow: 'hidden',
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px'
          }}>
             {/* Radar Sweep Effect */}
             <div style={{ 
               position: 'absolute', top: '50%', left: '50%', width: '1000px', height: '1000px', 
               marginLeft: '-500px', marginTop: '-500px', borderRadius: '50%',
               background: 'conic-gradient(from 0deg, transparent 70%, rgba(0,229,255,0.15) 100%)',
               animation: 'spin 4s linear infinite', pointerEvents: 'none'
             }} />

             {/* Emergency Trigger */}
             {emergency && (
               <div className="animate-scale" style={{ position: 'absolute', top: '25%', right: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 10 }}>
                 <div style={{ position: 'relative' }}>
                   <div style={{ position: 'absolute', inset: -15, background: 'rgba(244,63,94,0.3)', borderRadius: '50%', animation: 'pulse-ring 1s infinite' }} />
                   <div style={{ width: '30px', height: '30px', background: '#f43f5e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                     <AlertTriangle size={16} color="#fff" />
                   </div>
                 </div>
                 <div style={{ background: 'rgba(0,0,0,0.8)', padding: '6px 12px', borderRadius: '6px', border: '1px solid #f43f5e', color: '#fff', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                   KRİTİK ARİTMİ ALARMI!
                 </div>
               </div>
             )}

             {/* Ambulance Node */}
             <div style={{ 
               position: 'absolute', bottom: '20%', left: `${20 + carPos}%`, top: `${70 - (carPos * 0.55)}%`,
               transition: 'all 0.1s linear', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 5 
             }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(59,130,246,0.15)', border: '2px solid #3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(59,130,246,0.5)' }}>
                  <Car size={20} color="#3b82f6" />
                </div>
                <div style={{ background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', color: '#e2f0f9', fontSize: '10px', fontWeight: 600 }}>
                  {dispatched ? 'MÜDAHALEYE GİDİYOR (HIZ: 84km/h)' : 'AMB-01 BEKLEMEDE'}
                </div>
             </div>

             {/* Target Reached */}
             {carPos >= 80 && (
                <div className="animate-in" style={{ position: 'absolute', top: '22%', right: '15%', background: 'rgba(16,185,129,0.9)', padding: '10px 16px', borderRadius: '8px', color: '#fff', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 20 }}>
                  <ShieldCheck size={18} /> EKİP HASTAYA ULAŞTI
                </div>
             )}
          </div>
        </div>

        {/* ── Fleet Control Panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className={`card ${emergency ? 'card-danger card-animated-border' : ''}`} style={{ padding: '24px', transition: 'all 0.3s' }}>
             <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#e2f0f9', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <ShieldAlert size={20} color={emergency ? "#f43f5e" : "#00e5ff"} /> 
               Otonom Dispeç Merkezi
             </h3>

             {emergency ? (
               <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 <div style={{ padding: '12px', background: 'rgba(244,63,94,0.1)', borderRadius: '8px', border: '1px solid rgba(244,63,94,0.3)', color: '#e2f0f9', fontSize: '13px', lineHeight: '1.5' }}>
                   <strong>Ahmet Yılmaz</strong> (Hasta ID: 412) cihazından anomali algılandı. En yakın araç (AMB-01) 3.4km uzaklıkta.
                 </div>
                 <button onClick={handleDispatch} className="btn btn-danger" style={{ width: '100%', height: '48px', justifyContent: 'center', fontSize: '14px', fontWeight: 800 }}>
                   <Route size={18} /> Otomatik Yönlendir
                 </button>
               </div>
             ) : dispatched && carPos < 80 ? (
               <div className="animate-in" style={{ padding: '20px', background: 'rgba(59,130,246,0.1)', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.3)', textAlign: 'center' }}>
                 <div className="spinner" style={{ width: '30px', height: '30px', borderWidth: '3px', borderColor: '#3b82f6', borderTopColor: 'transparent', margin: '0 auto 12px' }} />
                 <div style={{ fontSize: '14px', fontWeight: 800, color: '#3b82f6' }}>Araç Yolda...</div>
                 <div style={{ fontSize: '12px', color: '#e2f0f9', marginTop: '4px' }}>Tahmini Varış: 4 Dakika</div>
               </div>
             ) : dispatched && carPos >= 80 ? (
               <div className="animate-in" style={{ padding: '20px', background: 'rgba(16,185,129,0.1)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.3)', textAlign: 'center' }}>
                 <ShieldCheck size={36} color="#10b981" style={{ margin: '0 auto 12px' }} />
                 <div style={{ fontSize: '15px', fontWeight: 800, color: '#10b981' }}>Müdahale Başarılı</div>
                 <div style={{ fontSize: '12px', color: '#e2f0f9', marginTop: '4px' }}>Ekip olay yerinde raporlama yapıyor.</div>
                 <button onClick={() => window.location.reload()} className="btn btn-ghost" style={{ marginTop: '16px', fontSize: '11px' }}>Simülasyonu Sıfırla</button>
               </div>
             ) : (
               <div style={{ padding: '30px 20px', textAlign: 'center', color: '#4d6b82', fontSize: '13px' }}>
                 Şu an bekleyen acil durum yok. <br/>Sistem bölgeyi tarıyor...
               </div>
             )}
          </div>

          <div className="card" style={{ padding: '24px', flex: 1 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#e2f0f9', marginBottom: '16px' }}>Aktif Filo Durumu</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2f0f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} /> AMB-01 (Kardiyoloji)
                </div>
                <div style={{ fontSize: '11px', color: '#3b82f6' }}>{dispatched ? 'GÖREVDE' : 'HAZIR'}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2f0f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> EVB-04 (Evde Bakım)
                </div>
                <div style={{ fontSize: '11px', color: '#10b981' }}>SAHADA</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', opacity: 0.5 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2f0f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4d6b82' }} /> AMB-02 (Genel)
                </div>
                <div style={{ fontSize: '11px', color: '#4d6b82' }}>BAKIMDA</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
