'use client';

import { useState, useEffect } from 'react';
import { Shield, Lock, Search, AlertOctagon, Terminal, Activity, Key, CheckCircle, Database } from 'lucide-react';

const MOCK_LOGS = [
  { id: 1, time: '14:32:05', user: 'Dr. Ayşe Yılmaz', ip: '192.168.1.45', action: 'DATA_EXPORT', target: 'Hastalar Raporu', status: 'SUCCESS', severity: 'low' },
  { id: 2, time: '14:28:12', user: 'Sistem Yöneticisi', ip: '10.0.0.5', action: 'CONFIG_CHANGE', target: 'Eşik Değerleri', status: 'SUCCESS', severity: 'medium' },
  { id: 3, time: '14:15:44', user: 'Bilinmeyen Kullanıcı', ip: '85.105.X.X', action: 'LOGIN_ATTEMPT', target: 'Admin Paneli', status: 'FAILED', severity: 'high' },
  { id: 4, time: '14:05:01', user: 'Dr. Mehmet Demir', ip: '192.168.1.12', action: 'PATIENT_VIEW', target: 'Hasta #1042', status: 'SUCCESS', severity: 'low' },
  { id: 5, time: '13:52:30', user: 'YZ Modülü', ip: 'localhost', action: 'RISK_ANALYSIS', target: 'Tüm Hastalar', status: 'SUCCESS', severity: 'low' },
  { id: 6, time: '13:40:15', user: 'Dr. Ayşe Yılmaz', ip: '192.168.1.45', action: 'SECURE_CHAT', target: 'Hasta #2055', status: 'SUCCESS', severity: 'medium' },
  { id: 7, time: '13:10:05', user: 'Sistem Yöneticisi', ip: '10.0.0.5', action: 'BACKUP_CREATE', target: 'Database', status: 'SUCCESS', severity: 'low' },
];

export default function AuditPage() {
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [searchTerm, setSearchTerm] = useState('');

  // Simulate incoming logs
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.7) {
        const newLog = {
          id: Date.now(),
          time: new Date().toLocaleTimeString('tr-TR'),
          user: 'Sistem Botu',
          ip: '127.0.0.1',
          action: 'HEALTH_CHECK',
          target: 'API Gateway',
          status: 'SUCCESS',
          severity: 'low'
        };
        setLogs(prev => [newLog, ...prev].slice(0, 50));
      }
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const filteredLogs = logs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in" style={{ paddingBottom: '40px' }}>
      
      {/* ── Header ── */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f0f9ff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={30} color="#10b981" />
          Siber Güvenlik & Denetim İzleri
        </h1>
        <p style={{ color: '#8aafc7', marginTop: '6px', fontSize: '14px' }}>
          KVKK ve ISO 27001 kapsamında sistemdeki tüm hareketlerin değişmez denetim kayıtları.
        </p>
      </div>

      {/* ── Security KPIs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Son 24 Saatte İşlem', val: '14.285', icon: Terminal, color: '#00e5ff' },
          { label: 'Engellenen Tehdit', val: '24', icon: AlertOctagon, color: '#f43f5e' },
          { label: 'Aktif Şifreleme', val: 'AES-256', icon: Lock, color: '#10b981' },
          { label: 'KVKK İhlali', val: '0', icon: Database, color: '#a78bfa' },
        ].map((k, i) => (
          <div key={i} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${k.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${k.color}30` }}>
              <k.icon size={20} color={k.color} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#e2f0f9', lineHeight: 1 }}>{k.val}</div>
              <div style={{ fontSize: '11px', color: '#4d6b82', marginTop: '4px', fontWeight: 600 }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Logs Table ── */}
      <div className="card" style={{ overflow: 'hidden' }}>
        
        {/* Table Toolbar */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#10b981" />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#e2f0f9' }}>Canlı Denetim Akışı</span>
            <div className="badge badge-success" style={{ display: 'flex', gap: '4px', padding: '2px 8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'pulseRing 2s infinite' }} />
              Live
            </div>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={14} color="#4d6b82" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="input" 
              placeholder="Kullanıcı veya İşlem Ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '34px', height: '36px', fontSize: '13px', background: 'rgba(0,0,0,0.2)' }}
            />
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '14px 20px', color: '#4d6b82', fontWeight: 600 }}>ZAMAN</th>
                <th style={{ padding: '14px 20px', color: '#4d6b82', fontWeight: 600 }}>KULLANICI</th>
                <th style={{ padding: '14px 20px', color: '#4d6b82', fontWeight: 600 }}>IP ADRESİ</th>
                <th style={{ padding: '14px 20px', color: '#4d6b82', fontWeight: 600 }}>İŞLEM (EVENT)</th>
                <th style={{ padding: '14px 20px', color: '#4d6b82', fontWeight: 600 }}>HEDEF</th>
                <th style={{ padding: '14px 20px', color: '#4d6b82', fontWeight: 600, textAlign: 'right' }}>DURUM</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s', animation: idx === 0 ? 'slideRight 0.5s ease-out' : 'none' }} className="hover:bg-white/5">
                  <td style={{ padding: '14px 20px', color: '#8aafc7', fontFamily: 'monospace' }}>{log.time}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#e2f0f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Key size={13} color="#4d6b82" /> {log.user}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#4d6b82', fontFamily: 'monospace' }}>{log.ip}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, fontFamily: 'monospace',
                      background: log.severity === 'high' ? 'rgba(244,63,94,0.1)' : log.severity === 'medium' ? 'rgba(245,158,11,0.1)' : 'rgba(0,229,255,0.1)',
                      color: log.severity === 'high' ? '#f43f5e' : log.severity === 'medium' ? '#f59e0b' : '#00e5ff',
                      border: `1px solid ${log.severity === 'high' ? 'rgba(244,63,94,0.2)' : log.severity === 'medium' ? 'rgba(245,158,11,0.2)' : 'rgba(0,229,255,0.2)'}`
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#8aafc7' }}>{log.target}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    {log.status === 'SUCCESS' ? (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '11px', fontWeight: 700 }}>
                        <CheckCircle size={12} /> BAŞARILI
                      </div>
                    ) : (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f43f5e', fontSize: '11px', fontWeight: 700 }}>
                        <AlertOctagon size={12} /> ENGELLENDİ
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#4d6b82' }}>
              Kayıt bulunamadı.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
