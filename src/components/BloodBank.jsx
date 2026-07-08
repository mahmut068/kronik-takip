import React, { useState, useEffect } from 'react';
import { Droplets, AlertTriangle, CheckCircle, Clock, Plus, TrendingDown, TrendingUp, RefreshCw } from 'lucide-react';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const initStock = () => ({
  'A+':  { units: 42, min: 20, daily: 8,  color: '#f43f5e' },
  'A-':  { units: 12, min: 10, daily: 3,  color: '#fb7185' },
  'B+':  { units: 28, min: 15, daily: 5,  color: '#f59e0b' },
  'B-':  { units: 6,  min: 8,  daily: 2,  color: '#fbbf24' },
  'AB+': { units: 18, min: 10, daily: 4,  color: '#a855f7' },
  'AB-': { units: 4,  min: 6,  daily: 1,  color: '#c084fc' },
  'O+':  { units: 55, min: 25, daily: 10, color: '#10b981' },
  'O-':  { units: 9,  min: 15, daily: 4,  color: '#34d399' },
});

const REQUESTS = [
  { id: 'REQ-001', patient: 'Kemal Aydın',    type: 'O-', units: 2, dept: 'YBÜ',         priority: 'critical', status: 'pending',   time: '18:05' },
  { id: 'REQ-002', patient: 'Fatma Şahin',    type: 'A+', units: 1, dept: 'Kardiyoloji',  priority: 'urgent',   status: 'approved',  time: '17:45' },
  { id: 'REQ-003', patient: 'Ahmet Yılmaz',   type: 'B+', units: 3, dept: 'Cerrahi',      priority: 'normal',   status: 'delivered', time: '16:30' },
  { id: 'REQ-004', patient: 'Selin Demirci',  type: 'AB+',units: 2, dept: 'Ameliyathane', priority: 'urgent',   status: 'pending',   time: '18:12' },
  { id: 'REQ-005', patient: 'Mert Özcan',     type: 'O+', units: 4, dept: 'Acil Servis',  priority: 'critical', status: 'approved',  time: '18:18' },
];

const DONORS = [
  { id: 1, name: 'Haluk Demir',   type: 'O-',  date: '2026-07-06', status: 'completed' },
  { id: 2, name: 'Esra Yıldız',   type: 'A+',  date: '2026-07-06', status: 'completed' },
  { id: 3, name: 'Caner Kara',    type: 'B+',  date: '2026-07-05', status: 'completed' },
  { id: 4, name: 'Nilüfer Ak',    type: 'AB-', date: '2026-07-04', status: 'completed' },
];

const PRIORITY_CFG = {
  critical: { label: 'KRİTİK', color: 'var(--danger)',  bg: 'rgba(244,63,94,0.12)' },
  urgent:   { label: 'ACİL',   color: '#f59e0b',        bg: 'rgba(245,158,11,0.12)' },
  normal:   { label: 'Normal', color: 'var(--success)', bg: 'rgba(16,185,129,0.1)'  },
};

const STATUS_CFG = {
  pending:   { label: 'Bekliyor',  icon: <Clock size={12}/>,        color: '#f59e0b' },
  approved:  { label: 'Onaylandı', icon: <CheckCircle size={12}/>,  color: 'var(--success)' },
  delivered: { label: 'Teslim',    icon: <CheckCircle size={12}/>,  color: 'var(--primary)' },
};

export default function BloodBank({ addNotification }) {
  const [stock, setStock] = useState(initStock);
  const [requests, setRequests] = useState(REQUESTS);
  const [tab, setTab] = useState('stock');
  const [newReq, setNewReq] = useState({ patient: '', type: 'A+', units: 1, dept: '', priority: 'normal' });
  const [showForm, setShowForm] = useState(false);

  // Simulate slight stock changes
  useEffect(() => {
    const iv = setInterval(() => {
      setStock(prev => {
        const next = { ...prev };
        const t = BLOOD_TYPES[Math.floor(Math.random() * BLOOD_TYPES.length)];
        const delta = Math.random() < 0.4 ? -1 : 1;
        next[t] = { ...next[t], units: Math.max(0, next[t].units + delta) };
        return next;
      });
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const criticalTypes = BLOOD_TYPES.filter(t => stock[t].units < stock[t].min);
  const totalUnits    = BLOOD_TYPES.reduce((s, t) => s + stock[t].units, 0);
  const pendingCount  = requests.filter(r => r.status === 'pending').length;

  const approveReq = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    const req = requests.find(r => r.id === id);
    if (req) {
      setStock(prev => ({
        ...prev,
        [req.type]: { ...prev[req.type], units: Math.max(0, prev[req.type].units - req.units) }
      }));
      addNotification?.('success', `Kan talebi onaylandı: ${req.patient} — ${req.type} x${req.units}`);
    }
  };

  const submitRequest = () => {
    if (!newReq.patient || !newReq.dept) return;
    const id = `REQ-${String(requests.length + 1).padStart(3, '0')}`;
    setRequests(prev => [{ ...newReq, id, status: 'pending', time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) }, ...prev]);
    addNotification?.('info', `Yeni kan talebi oluşturuldu: ${newReq.patient}`);
    setShowForm(false);
    setNewReq({ patient: '', type: 'A+', units: 1, dept: '', priority: 'normal' });
  };

  return (
    <div className="animate-fade-in" style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Droplets size={28} color="#f43f5e" /> Kan Bankası
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            Kan grubu stokları, talep yönetimi ve donör takibi
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {criticalTypes.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', padding: '8px 14px', borderRadius: 10, color: 'var(--danger)', fontSize: '0.82rem', fontWeight: 700 }}>
              <AlertTriangle size={14}/> {criticalTypes.join(', ')} kritik seviyede!
            </div>
          )}
          <button className="glass-button primary" onClick={() => { setShowForm(true); setTab('requests'); }} style={{ gap: 8 }}>
            <Plus size={15}/> Kan Talebi
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {[
          { label: 'Toplam Ünite',   value: totalUnits,              color: 'var(--primary)', icon: <Droplets size={20}/> },
          { label: 'Kritik Stok',    value: criticalTypes.length,    color: 'var(--danger)',  icon: <AlertTriangle size={20}/> },
          { label: 'Bekleyen Talep', value: pendingCount,            color: '#f59e0b',        icon: <Clock size={20}/> },
          { label: 'Bugünkü Donör',  value: DONORS.filter(d=>d.date==='2026-07-06').length, color: 'var(--success)', icon: <CheckCircle size={20}/> },
        ].map((s, i) => (
          <div key={i} className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${s.color}22`, color: s.color }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { key: 'stock',    label: 'Stok Durumu' },
          { key: 'requests', label: `Talepler (${requests.length})` },
          { key: 'donors',   label: 'Donörler' },
        ].map(t => (
          <button key={t.key} className={`glass-button ${tab === t.key ? 'primary' : ''}`} onClick={() => setTab(t.key)} style={{ fontSize: '0.85rem' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Stock Tab */}
      {tab === 'stock' && (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, alignContent: 'start', overflowY: 'auto' }}>
          {BLOOD_TYPES.map(type => {
            const s = stock[type];
            const pct = Math.min(100, Math.round((s.units / (s.min * 3)) * 100));
            const isCritical = s.units < s.min;
            const isLow = s.units < s.min * 1.5;
            const barColor = isCritical ? 'var(--danger)' : isLow ? '#f59e0b' : 'var(--success)';
            return (
              <div key={type} className="glass-panel" style={{ padding: 20, border: isCritical ? '1px solid rgba(244,63,94,0.4)' : '1px solid var(--glass-border)', background: isCritical ? 'rgba(244,63,94,0.03)' : undefined }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: s.color }}>{type}</span>
                  </div>
                  {isCritical
                    ? <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--danger)', fontSize: '0.72rem', fontWeight: 700 }}><AlertTriangle size={12}/> KRİTİK</div>
                    : <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--success)', fontSize: '0.72rem' }}><CheckCircle size={12}/> Normal</div>
                  }
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: barColor, lineHeight: 1 }}>{s.units}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 10 }}>ünite mevcut</div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 4, marginBottom: 8 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 4, transition: 'width 0.6s ease' }}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span>Min: {s.min} ünite</span>
                  <span>Günlük: ~{s.daily}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <button className="glass-button" style={{ flex: 1, fontSize: '0.75rem', padding: '6px 0', gap: 4 }}
                    onClick={() => { setStock(p => ({ ...p, [type]: { ...p[type], units: p[type].units + 5 } })); addNotification?.('success', `${type} stoku güncellendi (+5 ünite)`); }}>
                    <TrendingUp size={11}/> +5
                  </button>
                  <button className="glass-button" style={{ flex: 1, fontSize: '0.75rem', padding: '6px 0', gap: 4 }}
                    onClick={() => addNotification?.('info', `${type} için tedarik talebi oluşturuldu.`)}>
                    <RefreshCw size={11}/> Talep
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Requests Tab */}
      {tab === 'requests' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          {showForm && (
            <div className="glass-panel" style={{ padding: 20, border: '1px solid var(--primary)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 14 }}>Yeni Kan Talebi</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
                {[
                  { label: 'Hasta Adı', key: 'patient', type: 'text', placeholder: 'Hasta adı...' },
                  { label: 'Bölüm',     key: 'dept',    type: 'text', placeholder: 'Bölüm...' },
                ].map(f => (
                  <div key={f.key} style={{ gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>{f.label}</div>
                    <input value={newReq[f.key]} onChange={e => setNewReq(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-main)', fontSize: '0.88rem', boxSizing: 'border-box', fontFamily: 'Outfit, sans-serif', outline: 'none' }}/>
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Kan Grubu</div>
                  <select value={newReq.type} onChange={e => setNewReq(p => ({ ...p, type: e.target.value }))}
                    style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-main)', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none' }}>
                    {BLOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Ünite</div>
                  <input type="number" min={1} max={10} value={newReq.units} onChange={e => setNewReq(p => ({ ...p, units: parseInt(e.target.value)||1 }))}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-main)', fontSize: '0.88rem', boxSizing: 'border-box', fontFamily: 'Outfit, sans-serif', outline: 'none' }}/>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Öncelik</div>
                  <select value={newReq.priority} onChange={e => setNewReq(p => ({ ...p, priority: e.target.value }))}
                    style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-main)', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none' }}>
                    <option value="normal">Normal</option>
                    <option value="urgent">Acil</option>
                    <option value="critical">Kritik</option>
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                  <button className="glass-button primary" style={{ flex: 1, gap: 6 }} onClick={submitRequest}><CheckCircle size={14}/> Oluştur</button>
                  <button className="glass-button" style={{ flex: 1 }} onClick={() => setShowForm(false)}>İptal</button>
                </div>
              </div>
            </div>
          )}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {requests.map(req => {
              const pc = PRIORITY_CFG[req.priority];
              const sc = STATUS_CFG[req.status];
              const stockOk = (stock[req.type]?.units || 0) >= req.units;
              return (
                <div key={req.id} className="glass-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
                  border: req.priority === 'critical' ? '1px solid rgba(244,63,94,0.3)' : '1px solid var(--glass-border)' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${pc.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: pc.color }}>{req.type}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem' }}>{req.patient}</span>
                      <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 700, color: pc.color, background: pc.bg }}>{pc.label}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{req.dept} · {req.units} ünite · {req.id} · {req.time}</div>
                    {!stockOk && req.status === 'pending' && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--danger)', marginTop: 3 }}>⚠ Stok yetersiz ({stock[req.type]?.units || 0} ünite mevcut)</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: sc.color, fontSize: '0.8rem', fontWeight: 700 }}>
                    {sc.icon} {sc.label}
                  </div>
                  {req.status === 'pending' && (
                    <button className="glass-button primary" style={{ fontSize: '0.8rem', gap: 6 }} onClick={() => approveReq(req.id)}>
                      <CheckCircle size={13}/> Onayla
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Donors Tab */}
      {tab === 'donors' && (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DONORS.map(d => (
            <div key={d.id} className="glass-panel" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(244,63,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e', fontWeight: 800 }}>
                {d.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>{d.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.date}</div>
              </div>
              <span style={{ padding: '4px 12px', borderRadius: 8, background: 'rgba(244,63,94,0.12)', color: '#f43f5e', fontWeight: 900, fontSize: '0.9rem' }}>{d.type}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--success)', fontSize: '0.8rem', fontWeight: 700 }}>
                <CheckCircle size={13}/> Tamamlandı
              </span>
            </div>
          ))}
          <button className="glass-button" style={{ width: '100%', gap: 8, marginTop: 4 }}
            onClick={() => addNotification?.('info', 'Yeni donör kaydı formu açıldı.')}>
            <Plus size={14}/> Yeni Donör Kaydı
          </button>
        </div>
      )}
    </div>
  );
}
