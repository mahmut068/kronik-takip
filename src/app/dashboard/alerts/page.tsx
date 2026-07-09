'use client';
import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/alerts').then(r => r.json()).then(d => { setAlerts(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const resolveAlert = async (id: string) => {
    setResolvingId(id);
    await fetch('/api/alerts', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, resolvedNote: 'Doktor tarafından incelendi.' }) });
    
    // Animasyon için kısa süre bekle
    setTimeout(() => {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolvedAt: new Date().toISOString() } : a));
      setResolvingId(null);
    }, 400);
  };

  const open   = alerts.filter(a => !a.resolvedAt);
  const closed = alerts.filter(a => a.resolvedAt);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '60px' }}>
      <div className="animate-in" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px', marginBottom: '6px' }}>Klinik Alarm Haritası</h1>
        <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Kritik eşik aşım olayları ve müdahale geçmişi (Kanban Görünümü)</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', borderColor: '#2563eb', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Sol Kolon: Açık Alarmlar */}
          <div className="card" style={{ padding: '24px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(225,29,72,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={22} color="#e11d48" />
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#e11d48' }}>Müdahale Bekleyenler</h2>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{open.length} aktif kayıt</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {open.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '14px', fontWeight: 500, background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>Açık alarm yok. Harika! Tüm hastalar stabil.</div>
              ) : (
                open.map((a: any) => (
                  <div key={a.id} className="card" style={{ 
                    padding: '16px 20px', 
                    border: resolvingId === a.id ? '1px solid #059669' : '1px solid rgba(225,29,72,0.2)', 
                    background: resolvingId === a.id ? '#ecfdf5' : '#fff1f2',
                    display: 'flex', flexDirection: 'column', gap: '12px',
                    transition: 'all 0.3s ease',
                    transform: resolvingId === a.id ? 'scale(0.98)' : 'none',
                    opacity: resolvingId === a.id ? 0.5 : 1,
                    boxShadow: '0 4px 12px rgba(225,29,72,0.05)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{a.patient?.name}</div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#e11d48', background: 'rgba(225,29,72,0.1)', padding: '4px 10px', borderRadius: '12px' }}>KRİTİK EŞİK AŞILDI</div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#475569', fontWeight: 500, lineHeight: '1.5' }}>{a.message}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                        <Clock size={12} /> {new Date(a.createdAt).toLocaleString('tr-TR')}
                      </div>
                      <button onClick={() => resolveAlert(a.id)} disabled={resolvingId === a.id} className="btn btn-sm" style={{ background: '#059669', color: '#fff', border: 'none', padding: '6px 14px', fontWeight: 700 }}>
                        {resolvingId === a.id ? 'Sisteme İşleniyor...' : <><CheckCircle size={14} /> Durumu İnceledim</>}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sağ Kolon: Çözülmüş Alarmlar */}
          <div className="card" style={{ padding: '24px', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(5,150,105,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={22} color="#059669" />
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#059669' }}>Son Çözülen Olaylar</h2>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{closed.length} kapatılmış alarm</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {closed.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '14px', fontWeight: 500, background: '#ffffff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>Henüz çözülen alarm bulunmuyor.</div>
              ) : (
                closed.map((a: any) => (
                  <div key={a.id} className="card animate-in" style={{ padding: '16px 20px', border: '1px solid rgba(0,0,0,0.04)', background: '#ffffff', opacity: 0.85 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#475569', textDecoration: 'line-through' }}>{a.patient?.name}</div>
                      <CheckCircle size={16} color="#059669" />
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', fontWeight: 500 }}>{a.message}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '12px', fontWeight: 500 }}>
                      Müdahale Zamanı: {new Date(a.resolvedAt).toLocaleString('tr-TR')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
