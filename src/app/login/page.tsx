'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, HeartPulse, Stethoscope, ChevronRight, Loader2, Hospital } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Basit doğrulama ve yönlendirme (Sunum Modu)
    setTimeout(() => {
      if (email && password) {
        router.push('/dashboard');
      } else {
        setLoading(false);
        alert('Lütfen e-posta ve şifre alanlarını doldurun.');
      }
    }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* ── Left Side (Branding & Visual) ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)', borderRight: '1px solid #e2e8f0', padding: '40px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Soft Background Orbs */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }} />

        <div style={{ zIndex: 1, textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ width: '80px', height: '80px', background: '#ffffff', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', boxShadow: '0 12px 32px rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.1)' }}>
            <HeartPulse size={40} color="#2563eb" />
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', letterSpacing: '-1px' }}>Klinik Zeka V11</h1>
          <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.6', fontWeight: 500, marginBottom: '40px' }}>
            Sağlık profesyonelleri için geliştirilmiş, yapay zeka destekli yeni nesil hasta takip ve yönetim asistanı.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
             {[
               { icon: Stethoscope, title: 'Kusursuz Hasta Takibi', desc: 'Recharts ve akıllı widgetlarla donatılmış profil detayları.', color: '#2563eb' },
               { icon: ShieldCheck, title: 'Uçtan Uca Güvenlik', desc: 'Uçtan uca şifreli mesajlaşma ve SGK Medula entegrasyonu.', color: '#10b981' },
             ].map((feat, i) => (
               <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '20px', background: '#ffffff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: feat.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <feat.icon size={20} color={feat.color} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>{feat.title}</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontWeight: 500, lineHeight: '1.5' }}>{feat.desc}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* ── Right Side (Login Form) ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '8px' }}>Sisteme Giriş</h2>
            <p style={{ color: '#64748b', fontSize: '15px', fontWeight: 500 }}>V11 Medikal İş İstasyonuna Bağlanın</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Kurumsal Sicil No / E-Posta</label>
              <input 
                name="email"
                type="text" 
                defaultValue="dr.admin@klinik.gov.tr" 
                disabled={loading}
                style={{ 
                  width: '100%', height: '52px', padding: '0 16px', fontSize: '15px', 
                  background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px',
                  color: '#0f172a', outline: 'none', transition: 'all 0.2s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                <span>Şifre</span>
                <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Şifremi Unuttum</a>
              </label>
              <input 
                name="password"
                type="password" 
                defaultValue="123456" 
                disabled={loading}
                style={{ 
                  width: '100%', height: '52px', padding: '0 16px', fontSize: '15px', 
                  background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px',
                  color: '#0f172a', outline: 'none', transition: 'all 0.2s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: '52px', background: loading ? '#93c5fd' : '#2563eb', color: '#ffffff',
                border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px',
                transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
              }}
            >
              {loading ? (
                <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Bağlanıyor...</>
              ) : (
                <>İş İstasyonunu Başlat <ChevronRight size={20} /></>
              )}
            </button>
            
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes spin { 100% { transform: rotate(360deg); } }
            `}} />
            
          </form>

          <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px', fontWeight: 500 }}>
            <Hospital size={16} /> Sağlık Bakanlığı Entegrasyonu Aktif
          </div>

        </div>
      </div>
    </div>
  );
}
