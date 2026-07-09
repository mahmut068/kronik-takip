'use client';

import { useEffect } from 'react';
import { ShieldAlert, RefreshCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Layout ve Document seviyesindeki en temel çökme (Root Crash)
    console.error('SentryHealth ROOT Koruması: Çekirdek Çökme Hatası Engellendi', error);
  }, [error]);

  return (
    <html lang="tr">
      <body style={{ margin: 0, padding: 0 }}>
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#020617', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px', textAlign: 'center' }}>
          
          <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <ShieldAlert size={40} color="#ef4444" />
          </div>
          
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.5px' }}>
            Çekirdek Sistem Kesintisi
          </h2>
          
          <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0 auto 32px auto', lineHeight: '1.6', fontSize: '15px' }}>
            Uygulama omurgasında kritik bir kopma yaşandı. Lütfen sayfayı güvenli bir şekilde yeniden yükleyin.
          </p>
          
          <button 
            onClick={() => reset()} 
            style={{ 
              padding: '14px 28px', background: '#ef4444', 
              color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer',
              fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <RefreshCcw size={18} /> Arayüzü Kurtar
          </button>
        </div>
      </body>
    </html>
  );
}
