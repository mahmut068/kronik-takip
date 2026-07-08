'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X, HeartPulse } from 'lucide-react';

export default function ToastSimulation() {
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({ title: '', desc: '', type: 'danger' });

  useEffect(() => {
    // Show a random toast every 30-45 seconds
    const interval = setInterval(() => {
      const isCritical = Math.random() > 0.5;
      if (isCritical) {
        setToastData({
          title: 'Kritik Eşik Aşıldı!',
          desc: 'Ahmet Yılmaz (Diyabet) - Şeker: 240 mg/dL',
          type: 'danger'
        });
      } else {
        setToastData({
          title: 'Yeni Ölçüm Alındı',
          desc: 'Ayşe Kaya (Hipertansiyon) sisteme giriş yaptı.',
          type: 'success'
        });
      }
      setShowToast(true);

      // Auto hide after 6 seconds
      setTimeout(() => setShowToast(false), 6000);
    }, 35000);

    return () => clearInterval(interval);
  }, []);

  if (!showToast) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      background: 'rgba(8,14,26,0.95)',
      border: `1px solid ${toastData.type === 'danger' ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)'}`,
      borderRadius: '12px',
      padding: '16px',
      boxShadow: `0 10px 40px ${toastData.type === 'danger' ? 'rgba(244,63,94,0.15)' : 'rgba(16,185,129,0.15)'}`,
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      zIndex: 9999,
      minWidth: '300px',
      animation: 'slideUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards'
    }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px',
        background: toastData.type === 'danger' ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        {toastData.type === 'danger' ? <AlertTriangle size={16} color="#f43f5e" /> : <HeartPulse size={16} color="#10b981" />}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: toastData.type === 'danger' ? '#f43f5e' : '#10b981', marginBottom: '4px' }}>
          {toastData.title}
        </div>
        <div style={{ fontSize: '12px', color: '#e2f0f9', lineHeight: '1.4' }}>
          {toastData.desc}
        </div>
      </div>

      <button onClick={() => setShowToast(false)} style={{ background: 'none', border: 'none', color: '#4d6b82', cursor: 'pointer', padding: '4px' }}>
        <X size={14} />
      </button>
    </div>
  );
}
