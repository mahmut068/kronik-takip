'use client';

import { useState } from 'react';
import { Settings, Shield, Globe, Bell, Smartphone, Database, ShieldCheck, UserCog } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('integration');
  
  const [integrations, setIntegrations] = useState([
    { id: 'enabiz', name: 'E-Nabız Çift Yönlü Veri Aktarımı', desc: 'Hastaların e-nabız verilerini çekip, kronik takip raporlarını gönderir.', active: true, icon: Database, color: '#ef4444' },
    { id: 'medula', name: 'SGK Medula Reçete Sistemi', desc: 'Akıllı E-Reçete modülünün doğrudan SGK sistemine fatura/reçete işlemesi.', active: true, icon: ShieldCheck, color: '#10b981' },
    { id: 'hys', name: 'Halk Sağlığı Yönetim Sistemi (HSYS)', desc: 'İl sağlık müdürlüğü filyasyon ve kronik hastalık bildirim ağı.', active: false, icon: Globe, color: '#3b82f6' },
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, active: !i.active } : i));
  };

  return (
    <div className="animate-in" style={{ paddingBottom: '60px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* ── Header ── */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px', color: '#0f172a', letterSpacing: '-0.5px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={24} color="#475569" />
          </div>
          Sistem Kontrol Merkezi
        </h1>
        <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', fontWeight: 500 }}>
          Bakanlık entegrasyonlarını, API anahtarlarını ve profil ayarlarınızı yapılandırın.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }}>
        
        {/* ── Left Navigation ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
           {[
             { id: 'integration', icon: Globe, label: 'Entegrasyonlar' },
             { id: 'security',    icon: Shield, label: 'Güvenlik & Rol' },
             { id: 'profile',     icon: UserCog, label: 'Klinik Profili' },
             { id: 'notification',icon: Bell, label: 'Bildirim Tercihleri' },
             { id: 'devices',     icon: Smartphone, label: 'Bağlı Cihazlar' },
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               style={{
                 display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px',
                 background: activeTab === tab.id ? '#eff6ff' : 'transparent',
                 border: 'none', borderRadius: '12px', cursor: 'pointer',
                 color: activeTab === tab.id ? '#2563eb' : '#64748b',
                 fontWeight: activeTab === tab.id ? 800 : 600,
                 fontSize: '14px', textAlign: 'left', transition: 'all 0.2s'
               }}
             >
               <tab.icon size={18} color={activeTab === tab.id ? '#2563eb' : '#94a3b8'} />
               {tab.label}
             </button>
           ))}
        </div>

        {/* ── Content Area ── */}
        <div>
          {activeTab === 'integration' && (
            <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card" style={{ padding: '32px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Dış Sistem Bağlantıları</h2>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', fontWeight: 500 }}>
                  Resmi kurum ağları ile kronik takip verilerinin eşzamanlanması.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {integrations.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', background: '#fafafa', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: item.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <item.icon size={24} color={item.color} />
                        </div>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{item.name}</div>
                          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, maxWidth: '400px', lineHeight: '1.5' }}>{item.desc}</div>
                        </div>
                      </div>

                      {/* Apple style toggle button */}
                      <button 
                        onClick={() => toggleIntegration(item.id)}
                        style={{
                          width: '52px', height: '28px', borderRadius: '14px',
                          background: item.active ? '#10b981' : '#cbd5e1',
                          position: 'relative', border: 'none', cursor: 'pointer', transition: 'background 0.3s'
                        }}
                      >
                        <div style={{
                          width: '24px', height: '24px', borderRadius: '50%', background: '#ffffff',
                          position: 'absolute', top: '2px', left: item.active ? '26px' : '2px',
                          transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'integration' && (
            <div className="card animate-in" style={{ padding: '60px', textAlign: 'center', background: '#ffffff', border: '1px dashed #cbd5e1' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <Settings size={32} color="#94a3b8" />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Yakında Eklenecek</h2>
              <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
                Bu ayar menüsü henüz yapılandırma aşamasındadır.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
