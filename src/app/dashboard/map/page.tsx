'use client';

import { Map as MapIcon, MapPin, AlertCircle, Users, Activity } from 'lucide-react';

export default function MapPage() {
  const regions = [
    { name: 'İç Anadolu Bölgesi', risk: 'high', patients: 450, issue: 'Tip 2 Diyabet yoğunluğu (%35)' },
    { name: 'Marmara Bölgesi', risk: 'medium', patients: 520, issue: 'Hipertansiyon artışı' },
    { name: 'Ege Bölgesi', risk: 'low', patients: 180, issue: 'Obezite stabil' },
    { name: 'Güneydoğu Anadolu', risk: 'high', patients: 310, issue: 'Kardiyovasküler risk yüksek' },
  ];

  return (
    <div className="animate-in" style={{ paddingBottom: '40px' }}>
      
      {/* ── Header ── */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f0f9ff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MapIcon size={30} color="#a78bfa" />
          Bölgesel Hastalık Isı Haritası
        </h1>
        <p style={{ color: '#8aafc7', marginTop: '6px', fontSize: '14px' }}>
          Kronik hastalıkların coğrafi dağılımı ve bölgesel risk analizleri.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* ── Map Visualization Panel ── */}
        <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#e2f0f9', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="#10b981" /> Türkiye Geneli Risk Dağılımı
          </h2>
          
          {/* Fake Map UI / Grid Simulation */}
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#8aafc7' }}><div style={{ width: '12px', height: '12px', background: 'rgba(244,63,94,0.4)' }} /> Yüksek Risk</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#8aafc7' }}><div style={{ width: '12px', height: '12px', background: 'rgba(245,158,11,0.4)' }} /> Orta Risk</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#8aafc7' }}><div style={{ width: '12px', height: '12px', background: 'rgba(16,185,129,0.4)' }} /> Düşük Risk</div>
            </div>

            {/* Simüle Edilmiş Harita Noktaları */}
            <div style={{ position: 'absolute', top: '40%', left: '45%', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(244,63,94,0.3) 0%, transparent 70%)', borderRadius: '50%', animation: 'pulseRing 3s infinite' }} />
            <MapPin size={24} color="#f43f5e" style={{ position: 'absolute', top: '45%', left: '48%', zIndex: 5 }} />

            <div style={{ position: 'absolute', top: '30%', left: '20%', width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
            <MapPin size={20} color="#f59e0b" style={{ position: 'absolute', top: '35%', left: '23%', zIndex: 5 }} />

            <div style={{ position: 'absolute', bottom: '30%', right: '30%', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(244,63,94,0.3) 0%, transparent 70%)', borderRadius: '50%', animation: 'pulseRing 4s infinite' }} />
            <MapPin size={24} color="#f43f5e" style={{ position: 'absolute', bottom: '38%', right: '35%', zIndex: 5 }} />

            <div style={{ color: 'rgba(255,255,255,0.05)', fontSize: '100px', fontWeight: 900, letterSpacing: '10px' }}>TÜRKİYE</div>
          </div>
        </div>

        {/* ── Regional Stats List ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="card" style={{ padding: '24px', flex: 1 }}>
             <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#e2f0f9', marginBottom: '20px' }}>Bölgesel Analiz Raporu</h3>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {regions.map((region, i) => (
                 <div key={i} style={{ padding: '16px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                     <div>
                       <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2f0f9' }}>{region.name}</div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#8aafc7', marginTop: '4px' }}>
                         <Users size={12} /> {region.patients} Kayıtlı Hasta
                       </div>
                     </div>
                     <div className="badge" style={{ 
                       background: region.risk === 'high' ? 'rgba(244,63,94,0.1)' : region.risk === 'medium' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                       color: region.risk === 'high' ? '#f43f5e' : region.risk === 'medium' ? '#f59e0b' : '#10b981',
                     }}>
                       {region.risk === 'high' ? 'Kritik' : region.risk === 'medium' ? 'Uyarı' : 'Normal'}
                     </div>
                   </div>
                   
                   <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#e2f0f9' }}>
                     <AlertCircle size={14} color="#00e5ff" /> {region.issue}
                   </div>
                 </div>
               ))}
             </div>
          </div>

        </div>

      </div>

    </div>
  );
}
