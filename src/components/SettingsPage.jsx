import React, { useState } from 'react';
import { Settings, Hospital, Bell, Shield, Save, RotateCcw } from 'lucide-react';

const SettingsPage = ({ addNotification }) => {
  const [settings, setSettings] = useState({
    hospitalName: 'Özel MediTrack Hastanesi',
    doctorName: 'Dr. Ahmet Öztürk',
    department: 'Dahiliye',
    smsEnabled: true,
    voiceEnabled: true,
    emailEnabled: false,
    alertCooldown: '30',
    autoEscalate: true,
    sessionTimeout: '60',
    twoFactor: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    addNotification('success', 'Sistem ayarları başarıyla kaydedildi.');
    setTimeout(() => setSaved(false), 2000);
  };

  const Field = ({ label, helpText, children }) => (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--text-main)' }}>{label}</label>
      {helpText && <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{helpText}</p>}
      {children}
    </div>
  );

  const Toggle = ({ value, onChange, label }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--glass-border)', marginBottom: '10px' }}>
      <span style={{ color: 'var(--text-main)' }}>{label}</span>
      <div onClick={onChange} style={{ width: '52px', height: '28px', borderRadius: '14px', background: value ? 'var(--primary-dark)' : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer', transition: 'all 0.3s', border: `2px solid ${value ? 'var(--primary)' : 'var(--glass-border)'}` }}>
        <div style={{ position: 'absolute', top: '2px', left: value ? '24px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: value ? 'var(--primary)' : '#888', transition: 'all 0.3s', boxShadow: value ? '0 0 8px var(--primary)' : 'none' }} />
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px', maxWidth: '780px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Settings size={36} color="var(--primary)" /> Sistem Ayarları
          </h1>
          <p className="text-muted">Hastane ve kişisel sistem tercihleri.</p>
        </div>
        <button className="glass-button primary" onClick={handleSave} style={{ padding: '12px 24px' }}>
          {saved ? '✓ Kaydedildi' : <><Save size={18} /> Kaydet</>}
        </button>
      </div>

      {/* Hastane Bilgileri */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '24px' }}>
          <Hospital size={22} /> Hastane Bilgileri
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <Field label="Hastane / Klinik Adı">
            <input type="text" className="glass-input" value={settings.hospitalName} onChange={e => setSettings({ ...settings, hospitalName: e.target.value })} />
          </Field>
          <Field label="Doktor Adı">
            <input type="text" className="glass-input" value={settings.doctorName} onChange={e => setSettings({ ...settings, doctorName: e.target.value })} />
          </Field>
          <Field label="Bölüm / Uzmanlık" >
            <input type="text" className="glass-input" value={settings.department} onChange={e => setSettings({ ...settings, department: e.target.value })} />
          </Field>
        </div>
      </div>

      {/* Bildirim Ayarları */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '24px' }}>
          <Bell size={22} /> Bildirim Kanalları
        </h3>
        <Toggle label="📱 SMS Bildirimleri" value={settings.smsEnabled} onChange={() => setSettings({ ...settings, smsEnabled: !settings.smsEnabled })} />
        <Toggle label="📞 Sesli Arama (Chatbot)" value={settings.voiceEnabled} onChange={() => setSettings({ ...settings, voiceEnabled: !settings.voiceEnabled })} />
        <Toggle label="📧 E-Posta Bildirimleri" value={settings.emailEnabled} onChange={() => setSettings({ ...settings, emailEnabled: !settings.emailEnabled })} />
        <Toggle label="🚨 Kritik Eşik Aşılınca Otomatik Yükselt" value={settings.autoEscalate} onChange={() => setSettings({ ...settings, autoEscalate: !settings.autoEscalate })} />

        <Field label="Uyarı Tekrarlama Süresi (dk)" helpText="Aynı hasta için kaç dakikada bir uyarı gönderileceği.">
          <input type="number" className="glass-input" value={settings.alertCooldown} onChange={e => setSettings({ ...settings, alertCooldown: e.target.value })} style={{ maxWidth: '120px' }} />
        </Field>
      </div>

      {/* Güvenlik */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '24px' }}>
          <Shield size={22} /> Güvenlik
        </h3>
        <Toggle label="🔐 İki Faktörlü Kimlik Doğrulama (2FA)" value={settings.twoFactor} onChange={() => setSettings({ ...settings, twoFactor: !settings.twoFactor })} />
        <Field label="Oturum Zaman Aşımı (dk)" helpText="İnaktif kalındığında oturumun otomatik kapanma süresi.">
          <input type="number" className="glass-input" value={settings.sessionTimeout} onChange={e => setSettings({ ...settings, sessionTimeout: e.target.value })} style={{ maxWidth: '120px' }} />
        </Field>
      </div>

      {/* Tehlike Bölgesi */}
      <div className="glass-panel" style={{ padding: '28px', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.04)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--danger)', marginBottom: '16px' }}>
          ⚠️ Tehlike Bölgesi
        </h3>
        <p className="text-muted" style={{ marginBottom: '16px', fontSize: '0.9rem' }}>Aşağıdaki işlemler geri alınamaz. Lütfen dikkatli olun.</p>
        <button className="glass-button danger" onClick={() => addNotification('danger', 'Sistem sıfırlama işlemi başlatıldı (simülasyon).')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RotateCcw size={18} /> Tüm Hasta Verilerini Sıfırla
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
