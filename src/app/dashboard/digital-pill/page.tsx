'use client';

import React, { useState } from 'react';
import { Pill, Search, ShieldCheck, Clock, MapPin, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function DigitalPillPage() {
  const [sensorFound, setSensorFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const scanStomach = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSensorFound(true);
    }, 2000);
  };

  return (
    <div className="gpu-accelerated fast-render" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1px', color: '#0f172a', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Pill size={36} color="#06b6d4" /> Yutulabilir Sensör (Smart Pill)
            <span style={{ fontSize: '12px', background: 'linear-gradient(90deg, #06b6d4, #3b82f6)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontWeight: 800 }}>V14 PROTEUS</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px', fontWeight: 500, margin: 0 }}>
            İlaç mide asidine temas ettiği an Bluetooth ile doktor paneline "Yutuldu" onayı gönderir.
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-ghost">Panele Dön</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
         
         {/* Sol: Cihaz Eşleştirme ve Tarama */}
         <div className="card gpu-accelerated animate-in delay-2" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ textAlign: 'center', padding: '32px 16px', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '16px' }}>
               <div style={{ width: '80px', height: '80px', margin: '0 auto 16px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', animation: loading ? 'pulseGlow 1.5s infinite' : 'none' }}>
                  <Pill size={40} color={sensorFound ? '#10b981' : '#06b6d4'} />
               </div>
               <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                 {sensorFound ? 'Sensör Aktif (Midede)' : 'Sensör Bekleniyor'}
               </h3>
               <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                 Abilify MyCite® veya Proteus akıllı patch bağlantısı.
               </p>
            </div>

            <button 
              className="btn btn-primary" 
              onClick={scanStomach} 
              disabled={loading || sensorFound}
              style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '16px', background: sensorFound ? '#10b981' : 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
            >
              {loading ? <><Activity className="spin" size={20} /> Patch Taranıyor...</> : sensorFound ? <><CheckCircle size={20} /> İlaç Yutuldu & Onaylandı</> : <><Search size={20} /> Hastanın Yamasını Tara</>}
            </button>
         </div>

         {/* Sağ: İlaç Verileri */}
         <div className="card gpu-accelerated animate-in delay-3" style={{ padding: '24px', opacity: sensorFound ? 1 : 0.4, transition: 'opacity 0.5s ease', pointerEvents: sensorFound ? 'auto' : 'none' }}>
             <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 24px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>Sensör Telemetri Verileri</h3>
             
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                   <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><Clock size={14}/> Yutulma Zamanı</div>
                   <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{new Date().toLocaleTimeString('tr-TR')}</div>
                   <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>Tam vaktinde alındı</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                   <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><MapPin size={14}/> Sindirim Konumu</div>
                   <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Gastrik Antrum</div>
                   <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 700, marginTop: '4px' }}>Mide asidiyle tam temas (pH 1.5)</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                   <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><Activity size={14}/> Adımsayar (Patch)</div>
                   <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>4,120 Adım</div>
                   <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700, marginTop: '4px' }}>Günlük hedefin %41'i</div>
                </div>

                <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '12px', border: '1px solid #fecdd3' }}>
                   <div style={{ fontSize: '13px', color: '#e11d48', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><ShieldCheck size={14}/> Biyobelirteç Durumu</div>
                   <div style={{ fontSize: '20px', fontWeight: 800, color: '#9f1239' }}>Doz Aşımı Yok</div>
                   <div style={{ fontSize: '12px', color: '#e11d48', fontWeight: 700, marginTop: '4px' }}>24 saat içinde 1 adet tablet</div>
                </div>
             </div>

             <div style={{ marginTop: '24px', padding: '16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', display: 'flex', gap: '12px' }}>
                <AlertTriangle size={24} color="#2563eb" style={{ flexShrink: 0 }} />
                <div>
                   <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>Psikiyatri / Şizofreni Modülü Uyarısı</div>
                   <div style={{ fontSize: '13px', color: '#1e40af', fontWeight: 500 }}>Hasta ilacı sorunsuz yuttu. Hastanın yalan söyleme veya ilacı dil altına saklama ihtimali %0 olarak teyit edildi. Sensör midede eriyerek vücuttan doğal yollarla atılacaktır.</div>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
}
