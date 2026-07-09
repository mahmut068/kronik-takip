'use client';

import { useEffect } from 'react';
import { ShieldAlert, RefreshCcw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // İzole edilen hatayı log sistemine veya Sentry gibi harici bir araca gönderebiliriz.
    console.error('SentryHealth Koruması: Kritik Sistem Hatası İzole Edildi', error);
  }, [error]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#020617', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px', textAlign: 'center' }}>
      
      <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', animation: 'pulse 2s infinite' }}>
        <ShieldAlert size={40} color="#ef4444" />
      </div>
      
      <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.5px' }}>
        Bağlantı Kesintisi (Fail-Safe Aktif)
      </h2>
      
      <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0 auto 32px auto', lineHeight: '1.6', fontSize: '15px' }}>
        Sunucuyla aranızdaki iletişimde anlık bir kopma veya yapısal bir hata oluştu. Panik yapmayın, sistem şu an kendini onarmaya çalışıyor.
      </p>
      
      <button 
        onClick={() => reset()} 
        style={{ 
          padding: '14px 28px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', 
          color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer',
          fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)', transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <RefreshCcw size={18} /> Sistemi Yeniden Başlat
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}} />
    </div>
  );
}
