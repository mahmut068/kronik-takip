import React, { useState } from 'react';
import { User, Calendar as CalendarIcon, FileText, Pill, MessageCircle, Activity, Heart, Smartphone, Bell, ArrowLeft, ArrowRight, Video, FileCheck } from 'lucide-react';

const PatientPortal = () => {
  const [activeTab, setActiveTab] = useState('home');

  const HomeTab = () => (
    <div className="animate-slide-in">
      {/* Selamlama */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#1f2937', marginBottom: '4px' }}>Merhaba, Ahmet</h2>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Bugün nasıl hissediyorsun?</p>
      </div>

      {/* Önemli Uyarı */}
      <div style={{ padding: '16px', background: 'linear-gradient(135deg, var(--primary), #7c3aed)', borderRadius: '16px', color: '#fff', marginBottom: '24px', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <Video size={20} />
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Dr. Kaya ile Görüşme</span>
        </div>
        <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '12px' }}>Bugün 14:30'da tele-sağlık randevunuz bulunmaktadır.</p>
        <button style={{ width: '100%', padding: '10px', background: '#fff', color: 'var(--primary)', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>Görüşmeye Katıl</button>
      </div>

      {/* Menü Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {[
          { id: 'appointments', label: 'Randevularım', icon: <CalendarIcon size={24} />, color: '#3b82f6' },
          { id: 'results', label: 'Sonuçlarım', icon: <FileText size={24} />, color: '#10b981' },
          { id: 'meds', label: 'İlaçlarım', icon: <Pill size={24} />, color: '#f59e0b' },
          { id: 'messages', label: 'Mesajlar', icon: <MessageCircle size={24} />, color: '#8b5cf6' },
        ].map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)}
            style={{ padding: '20px 16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ color: item.color }}>{item.icon}</div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Günlük Ölçümler */}
      <div>
        <h3 style={{ fontSize: '1.05rem', color: '#1f2937', marginBottom: '12px' }}>Günlük Ölçümler</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: '#fee2e2', color: '#ef4444', borderRadius: '8px' }}><Heart size={18} /></div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#7f1d1d', fontWeight: 600 }}>Tansiyon</div>
                <div style={{ fontSize: '0.75rem', color: '#991b1b' }}>Son kayıt: Dün</div>
              </div>
            </div>
            <button style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>Ekle</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: '#dcfce7', color: '#22c55e', borderRadius: '8px' }}><Activity size={18} /></div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#14532d', fontWeight: 600 }}>Kan Şekeri</div>
                <div style={{ fontSize: '0.75rem', color: '#166534' }}>Bugün kaydedildi (105 mg/dL)</div>
              </div>
            </div>
            <CheckCircleIcon />
          </div>
        </div>
      </div>
    </div>
  );

  const MedsTab = () => (
    <div className="animate-slide-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: '#6b7280', padding: '4px' }}><ArrowLeft size={20} /></button>
        <h2 style={{ fontSize: '1.2rem', color: '#1f2937' }}>Günlük İlaçlarım</h2>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ padding: '16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '1.05rem' }}>Amlodipine 5mg</div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Sabah aç karnına (08:00)</div>
            </div>
            <div style={{ color: '#10b981' }}><FileCheck size={24} /></div>
          </div>
          <button style={{ width: '100%', padding: '10px', background: '#f3f4f6', color: '#9ca3af', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }} disabled>Alındı (08:15)</button>
        </div>
        
        <div style={{ padding: '16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#1f2937', fontSize: '1.05rem' }}>Metformin 500mg</div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Akşam yemekle (20:00)</div>
            </div>
            <div style={{ color: '#f59e0b' }}><ClockIcon size={24} /></div>
          </div>
          <button style={{ width: '100%', padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Şimdi Al</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px', display: 'flex', gap: '40px', justifyContent: 'center' }}>
      {/* Açıklama Alanı */}
      <div style={{ flex: 1, maxWidth: '500px', paddingTop: '40px' }}>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <Smartphone size={32} color="var(--primary)" /> Hasta Portalı (Mobil)
        </h1>
        <p className="text-muted" style={{ lineHeight: 1.6, marginBottom: '24px' }}>
          Bu arayüz, hastaların hastane sistemiyle etkileşime geçtiği mobil uygulamanın bir simülasyonudur. Hastalar bu portal üzerinden:
        </p>
        <ul style={{ color: 'var(--text-main)', lineHeight: 1.8, paddingLeft: '20px', marginBottom: '24px' }}>
          <li>Randevu alabilir ve tele-sağlık görüşmelerine katılabilir.</li>
          <li>Reçete edilen ilaçları ve günlük dozları takip edebilir.</li>
          <li>Laboratuvar sonuçlarını inceleyebilir.</li>
          <li>Doktor tarafından atanan günlük görevleri (tansiyon/şeker ölçümü vb.) sisteme girebilir.</li>
        </ul>
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px dashed var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ArrowRight size={24} color="var(--primary)" />
          <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Sağ taraftaki cihaz simülasyonu üzerinden arayüzü test edebilirsiniz.</span>
        </div>
      </div>

      {/* Telefon Mockup */}
      <div style={{ 
        width: '375px', height: '812px', background: '#ffffff', borderRadius: '40px', 
        border: '12px solid #1f2937', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column'
      }}>
        {/* Notch (Çentik) */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '150px', height: '30px', background: '#1f2937', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px', zIndex: 10 }}></div>
        
        {/* iOS Status Bar (Sahte) */}
        <div style={{ padding: '12px 24px 8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#1f2937', zIndex: 1 }}>
          <span>14:30</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span>📶</span><span>🔋</span>
          </div>
        </div>

        {/* Uygulama İçeriği (Light Mode) */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'meds' && <MedsTab />}
          {(activeTab !== 'home' && activeTab !== 'meds') && (
            <div className="animate-slide-in">
              <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: '#6b7280', padding: '4px', marginBottom: '24px' }}><ArrowLeft size={20} /></button>
              <div style={{ textAlign: 'center', color: '#6b7280', paddingTop: '40px' }}>
                <Activity size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                <p>Bu ekran yapım aşamasındadır.</p>
              </div>
            </div>
          )}
        </div>

        {/* Alt Navigasyon (Bottom Bar) */}
        <div style={{ borderTop: '1px solid #e5e7eb', padding: '16px 24px 24px', display: 'flex', justifyContent: 'space-between', background: '#fff', zIndex: 1 }}>
          {[
            { id: 'home', icon: <Activity size={24} /> },
            { id: 'calendar', icon: <CalendarIcon size={24} /> },
            { id: 'notifications', icon: <Bell size={24} /> },
            { id: 'profile', icon: <User size={24} /> },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              style={{ background: 'none', border: 'none', color: activeTab === item.id ? 'var(--primary)' : '#9ca3af', cursor: 'pointer', transition: 'color 0.2s' }}>
              {item.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper components for missing icons
const CheckCircleIcon = () => <CheckCircle size={20} color="#22c55e" />;
const ClockIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const CheckCircle = ({ size, color }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;


export default PatientPortal;
