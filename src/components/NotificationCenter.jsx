import React, { useState } from 'react';
import { Bell, Info, AlertTriangle, CheckCircle, Trash2, X, BellOff, CheckCheck, Filter } from 'lucide-react';

const NotificationCenter = ({ notifications, setNotifications }) => {
  const [filter, setFilter] = useState('all'); // all | danger | success | info

  const getIcon = (type) => {
    switch(type) {
      case 'danger':  return <AlertTriangle size={22} color="var(--danger)" />;
      case 'success': return <CheckCircle size={22} color="var(--success)" />;
      default:        return <Info size={22} color="var(--primary)" />;
    }
  };

  const getBorderColor = (type) => {
    if (type === 'danger')  return 'var(--danger)';
    if (type === 'success') return 'var(--success)';
    return 'var(--primary)';
  };

  const getBg = (type) => {
    if (type === 'danger')  return 'rgba(239,68,68,0.06)';
    if (type === 'success') return 'rgba(16,185,129,0.06)';
    return 'rgba(0,229,255,0.04)';
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteOne = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);

  const dangerCount  = notifications.filter(n => n.type === 'danger').length;
  const successCount = notifications.filter(n => n.type === 'success').length;
  const infoCount    = notifications.filter(n => n.type === 'info').length;
  const unread       = notifications.filter(n => !n.read).length;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px', maxWidth: '860px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex-between mb-4">
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
            <Bell size={32} color="var(--primary)" /> Bildirim Merkezi
            {unread > 0 && (
              <span style={{ background: 'var(--danger)', color: '#fff', padding: '2px 10px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600 }}>
                {unread} yeni
              </span>
            )}
          </h1>
          <p className="text-muted">Sistemdeki tüm uyarıları ve aktivite loglarını takip edin.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {unread > 0 && (
            <button className="glass-button" onClick={markAllRead} style={{ background: 'rgba(0,229,255,0.1)', borderColor: 'var(--primary)', color: '#fff', padding: '10px 16px' }}>
              <CheckCheck size={16} /> Tümünü Okundu Say
            </button>
          )}
          <button className="glass-button danger" onClick={() => setNotifications([])} disabled={notifications.length === 0} style={{ padding: '10px 16px' }}>
            <Trash2 size={16} /> Tümünü Temizle
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Toplam',   count: notifications.length, color: 'var(--primary)',  icon: <Bell size={22} /> },
          { label: 'Kritik',   count: dangerCount,          color: 'var(--danger)',   icon: <AlertTriangle size={22} /> },
          { label: 'Başarılı', count: successCount,         color: 'var(--success)',  icon: <CheckCircle size={22} /> },
          { label: 'Bilgi',    count: infoCount,            color: 'var(--secondary)',icon: <Info size={22} /> },
        ].map(kpi => (
          <div key={kpi.label} className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ color: kpi.color }}>{kpi.icon}</div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{kpi.label}</p>
              <h3 style={{ fontSize: '1.8rem', color: kpi.color, fontWeight: 700 }}>{kpi.count}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
        <Filter size={16} color="var(--text-muted)" />
        {[
          { key: 'all',     label: 'Tümü',    count: notifications.length },
          { key: 'danger',  label: '🚨 Kritik', count: dangerCount },
          { key: 'success', label: '✅ Başarılı', count: successCount },
          { key: 'info',    label: 'ℹ️ Bilgi',  count: infoCount },
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            style={{ padding: '8px 16px', border: '1px solid', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif',
              borderColor: filter === tab.key ? 'var(--primary)' : 'var(--glass-border)',
              background: filter === tab.key ? 'rgba(0,229,255,0.1)' : 'transparent',
              color: filter === tab.key ? 'var(--primary)' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: '6px' }}>
            {tab.label}
            <span style={{ padding: '1px 7px', borderRadius: '10px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)' }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.length === 0 ? (
          <div className="glass-panel flex-center" style={{ padding: '60px', flexDirection: 'column', gap: '16px', color: 'var(--text-muted)' }}>
            <BellOff size={48} style={{ opacity: 0.3 }} />
            <p>Bu kategoride henüz bildirim yok.</p>
          </div>
        ) : (
          filtered.map(notif => (
            <div key={notif.id} className="glass-panel animate-slide-in"
              style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px',
                borderLeft: `4px solid ${getBorderColor(notif.type)}`,
                background: getBg(notif.type),
                opacity: notif.read ? 0.65 : 1,
                transition: 'all 0.3s' }}>
              <div style={{ flexShrink: 0 }}>{getIcon(notif.type)}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '1rem', marginBottom: '4px', color: 'var(--text-main)', fontWeight: notif.read ? 400 : 600 }}>
                  {notif.message}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <small className="text-muted">{notif.time}</small>
                  {!notif.read && (
                    <span style={{ padding: '1px 8px', borderRadius: '10px', fontSize: '0.7rem', background: 'var(--primary)', color: '#000', fontWeight: 700 }}>
                      YENİ
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => deleteOne(notif.id)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.2s', flexShrink: 0 }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <X size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
