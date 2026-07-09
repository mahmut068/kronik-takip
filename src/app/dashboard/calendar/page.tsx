'use client';

import { Calendar as CalendarIcon, Clock, Video, User, Plus, Search, MapPin, ChevronRight, Mic } from 'lucide-react';

export default function CalendarPage() {
  const appointments = [
    { id: 1, patient: 'Ahmet Yılmaz', time: '09:00 - 09:30', type: 'Online Kontrol', status: 'upcoming', isTele: true },
    { id: 2, patient: 'Ayşe Demir', time: '10:15 - 10:45', type: 'Klinik Muayene', status: 'upcoming', isTele: false },
    { id: 3, patient: 'Mehmet Kaya', time: '11:00 - 11:30', type: 'Online Görüşme', status: 'upcoming', isTele: true },
    { id: 4, patient: 'Fatma Şahin', time: '13:30 - 14:00', type: 'Tahlil Sonuç', status: 'upcoming', isTele: false },
  ];

  return (
    <div className="animate-in" style={{ paddingBottom: '60px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* ── Header ── */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px', color: '#0f172a', letterSpacing: '-0.5px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarIcon size={24} color="#9333ea" />
            </div>
            Akıllı Takvim & Randevu Yönetimi
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', fontWeight: 500 }}>
            Günlük programınızı takip edin ve AI asistan ile hastalarınızı otomatik olarak yönlendirin.
          </p>
        </div>
        <button className="btn btn-primary" style={{ height: '44px', padding: '0 20px', fontSize: '14px', background: '#9333ea' }}>
          <Plus size={18} /> Yeni Randevu
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* ── LEFT: Appointments ── */}
        <div className="card" style={{ padding: '32px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Bugünün Programı</h2>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#9333ea', background: '#f3e8ff', padding: '6px 16px', borderRadius: '20px' }}>
              8 Temmuz 2026, Çarşamba
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {appointments.map((app) => (
              <div key={app.id} style={{ display: 'flex', alignItems: 'center', padding: '20px', borderRadius: '16px', background: '#fafafa', border: '1px solid #e5e5e5', gap: '20px' }}>
                <div style={{ flexShrink: 0, width: '120px', borderRight: '1px solid #e2e8f0', paddingRight: '20px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={16} color="#64748b" /> {app.time.split(' - ')[0]}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>{app.time.split(' - ')[1]}</div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} color="#64748b" /> {app.patient}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {app.isTele ? (
                      <span style={{ fontSize: '13px', color: '#2563eb', background: '#eff6ff', padding: '4px 10px', borderRadius: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Video size={14} /> {app.type}
                      </span>
                    ) : (
                      <span style={{ fontSize: '13px', color: '#059669', background: '#ecfdf5', padding: '4px 10px', borderRadius: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} /> {app.type}
                      </span>
                    )}
                  </div>
                </div>

                <button className="btn btn-ghost" style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%', background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569' }}>
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: AI Assistant ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '32px', background: 'linear-gradient(135deg, #f8fafc 0%, #f3e8ff 100%)', border: '1px solid #e9d5ff' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 8px 16px rgba(147,51,234,0.3)' }}>
              <Mic size={24} color="#ffffff" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Sesli Asistan (AI)</h2>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '24px', fontWeight: 500 }}>
              Randevularınızı sesle yönetin. Hastaları arayıp hatırlatma yapması veya yeni randevu ayarlaması için asistana komut verin.
            </p>
            <button className="btn" style={{ width: '100%', height: '48px', justifyContent: 'center', background: '#ffffff', color: '#9333ea', border: '1px solid #d8b4fe', fontSize: '15px', fontWeight: 800 }}>
              Asistanı Dinle
            </button>
          </div>

          <div className="card" style={{ padding: '24px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
             <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#64748b', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Özet</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ fontSize: '14px', color: '#475569', fontWeight: 600 }}>Toplam Randevu</span>
                 <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>12</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ fontSize: '14px', color: '#475569', fontWeight: 600 }}>Online Görüşme</span>
                 <span style={{ fontSize: '16px', fontWeight: 800, color: '#2563eb' }}>5</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ fontSize: '14px', color: '#475569', fontWeight: 600 }}>Yüz Yüze</span>
                 <span style={{ fontSize: '16px', fontWeight: 800, color: '#059669' }}>7</span>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
