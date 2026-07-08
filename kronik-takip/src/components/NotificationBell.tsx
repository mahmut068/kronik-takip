'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, AlertTriangle, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    let active = false;
    if (open && alerts.length === 0) {
      active = true;
      fetch('/api/alerts')
        .then(res => res.json())
        .then(data => {
          if (!active) return;
          const activeAlerts = data.filter((a: any) => !a.resolvedAt).slice(0, 5);
          setAlerts(activeAlerts);
          setLoading(false);
          setHasUnread(activeAlerts.length > 0);
        })
        .catch(() => {
          if (active) setLoading(false);
        });
    }
    return () => { active = false; };
  }, [open, alerts.length]);

  useEffect(() => {
    fetch('/api/alerts').then(res => res.json()).then(data => {
      const activeAlerts = data.filter((a: any) => !a.resolvedAt);
      setHasUnread(activeAlerts.length > 0);
    }).catch(() => {});
  }, []);

  const handleToggle = () => {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen && alerts.length === 0) {
      setLoading(true); // Set loading when user initiates action
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <div 
        onClick={handleToggle}
        style={{
          position: 'relative', width: '38px', height: '38px',
          borderRadius: '10px', 
          background: open ? 'rgba(0,229,255,0.1)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${open ? 'rgba(0,229,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s ease',
        }}
      >
        <Bell size={17} color={open ? '#00e5ff' : '#8aafc7'} />
        {hasUnread && (
          <div style={{
            position: 'absolute', top: '6px', right: '6px',
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#f43f5e', border: '1.5px solid #0b1626',
            boxShadow: '0 0 8px rgba(244,63,94,0.6)',
          }} />
        )}
      </div>

      {open && (
        <div className="card animate-scale" style={{
          position: 'absolute', top: '50px', right: '0',
          width: '320px', zIndex: 100, padding: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          border: '1px solid rgba(0,229,255,0.15)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
            <div style={{ fontWeight: 700, color: '#e2f0f9', fontSize: '14px' }}>Bildirim Merkezi</div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#4d6b82', cursor: 'pointer' }}><X size={15} /></button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#8aafc7', fontSize: '12px' }}>Yükleniyor...</div>
            ) : alerts.length === 0 ? (
              <div style={{ padding: '30px 10px', textAlign: 'center' }}>
                <CheckCircle size={30} color="#10b981" style={{ marginBottom: '8px', opacity: 0.8 }} />
                <div style={{ color: '#8aafc7', fontSize: '12px' }}>Harika! Tüm hastalarınız stabil. Yeni bildirim yok.</div>
              </div>
            ) : (
              alerts.map((a: any) => (
                <div key={a.id} style={{
                  padding: '10px', borderRadius: '8px',
                  background: 'rgba(244,63,94,0.06)',
                  border: '1px solid rgba(244,63,94,0.15)',
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                }}>
                  <div style={{ marginTop: '2px' }}><AlertTriangle size={14} color="#f43f5e" /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#e2f0f9' }}>{a.patient?.name || 'Bilinmeyen Hasta'}</div>
                    <div style={{ fontSize: '11px', color: '#8aafc7', marginTop: '2px' }}>{a.reason}</div>
                    <div style={{ fontSize: '9px', color: '#4d6b82', marginTop: '4px' }}>{new Date(a.createdAt).toLocaleString('tr-TR')}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link href="/dashboard/alerts" onClick={() => setOpen(false)} style={{
            display: 'block', textAlign: 'center', marginTop: '12px',
            paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)',
            fontSize: '11px', color: '#00e5ff', textDecoration: 'none', fontWeight: 600
          }}>
            Tüm Alarmları Gör
          </Link>
        </div>
      )}
    </div>
  );
}
