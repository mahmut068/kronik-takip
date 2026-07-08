import React, { useState } from 'react';
import { Building2, Bed, Users, Wrench, BarChart2, CheckCircle, Clock, RefreshCw } from 'lucide-react';

const WARDS = [
  { id: 'icu',      label: 'Yoğun Bakım',    color: '#ef4444', capacity: 10 },
  { id: 'cardio',   label: 'Kardiyoloji',     color: '#f97316', capacity: 20 },
  { id: 'internal', label: 'Dahiliye',        color: '#eab308', capacity: 30 },
  { id: 'surgery',  label: 'Cerrahi',         color: '#22c55e', capacity: 25 },
  { id: 'ortho',    label: 'Ortopedi',        color: '#3b82f6', capacity: 20 },
  { id: 'neuro',    label: 'Nöroloji',        color: '#a855f7', capacity: 15 },
];

const initBeds = () => {
  const beds = {};
  WARDS.forEach(w => {
    beds[w.id] = Array.from({ length: w.capacity }, (_, i) => ({
      id: `${w.id}-${i + 1}`,
      number: i + 1,
      status: Math.random() < 0.6 ? 'occupied' : Math.random() < 0.5 ? 'available' : 'maintenance',
      patient: Math.random() < 0.6 ? ['Ahmet Y.', 'Fatma K.', 'Mehmet D.', 'Zeynep A.', 'Ali B.', 'Ayşe C.'][Math.floor(Math.random() * 6)] : null,
      since: Math.random() < 0.6 ? `${Math.floor(Math.random() * 5) + 1} gün` : null,
    }));
  });
  return beds;
};

const EQUIPMENT = [
  { id: 1, name: 'MRI Cihazı',        ward: 'Radyoloji', status: 'active',      lastMaint: '2026-06-15', nextMaint: '2026-09-15' },
  { id: 2, name: 'CT Tarayıcı',       ward: 'Radyoloji', status: 'active',      lastMaint: '2026-05-20', nextMaint: '2026-08-20' },
  { id: 3, name: 'Ventilatör #3',     ward: 'YBÜ',       status: 'maintenance', lastMaint: '2026-07-01', nextMaint: '2026-07-08' },
  { id: 4, name: 'EKG Cihazı #2',     ward: 'Kardiyoloji', status: 'active',   lastMaint: '2026-06-01', nextMaint: '2026-09-01' },
  { id: 5, name: 'Defibrülatör #1',   ward: 'Acil',      status: 'active',      lastMaint: '2026-07-02', nextMaint: '2026-10-02' },
  { id: 6, name: 'USG Cihazı',        ward: 'Dahiliye',  status: 'inactive',    lastMaint: '2026-04-10', nextMaint: '2026-07-10' },
  { id: 7, name: 'Ameliyat Masası #2', ward: 'Cerrahi',  status: 'active',      lastMaint: '2026-06-28', nextMaint: '2026-09-28' },
];

const OR_SCHEDULE = [
  { id: 1, patient: 'Ayşe Yıldız',  op: 'Apendektomi',      or: 'ODA 1', surgeon: 'Dr. Kaya',   start: '08:00', end: '09:30', status: 'completed' },
  { id: 2, patient: 'Hasan Şahin',  op: 'Diz Protezi',      or: 'ODA 2', surgeon: 'Dr. Öz',    start: '09:00', end: '12:00', status: 'inProgress' },
  { id: 3, patient: 'Emine Arslan', op: 'Kolostomi Kapatma', or: 'ODA 1', surgeon: 'Dr. Kaya',   start: '11:00', end: '13:30', status: 'scheduled' },
  { id: 4, patient: 'Burak Demir',  op: 'Herniorafi',        or: 'ODA 3', surgeon: 'Dr. Yıldız', start: '13:00', end: '14:30', status: 'scheduled' },
  { id: 5, patient: 'Leyla Can',    op: 'Tiroidektomi',      or: 'ODA 2', surgeon: 'Dr. Öz',    start: '14:00', end: '16:00', status: 'scheduled' },
];

const statusConfig = {
  occupied:     { label: 'Dolu',      color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  available:    { label: 'Boş',       color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  maintenance:  { label: 'Bakımda',   color: '#eab308', bg: 'rgba(234,179,8,0.15)' },
};

const eqStatus = {
  active:      { label: 'Aktif',    color: 'var(--success)' },
  maintenance: { label: 'Bakımda', color: 'var(--warning)' },
  inactive:    { label: 'Pasif',   color: 'var(--danger)' },
};

const orStatus = {
  completed:  { label: 'Tamamlandı', color: 'var(--success)' },
  inProgress: { label: 'Devam Ediyor', color: 'var(--primary)' },
  scheduled:  { label: 'Planlandı', color: 'var(--text-muted)' },
};

const OperationsCenter = ({ addNotification }) => {
  const [beds, setBeds] = useState(initBeds);
  const [activeWard, setActiveWard] = useState('icu');
  const [activeTab, setActiveTab] = useState('beds');
  const [equipment, setEquipment] = useState(EQUIPMENT);
  const [orSchedule] = useState(OR_SCHEDULE);

  const ward = WARDS.find(w => w.id === activeWard);
  const wardBeds = beds[activeWard] || [];
  const occupied = wardBeds.filter(b => b.status === 'occupied').length;
  const available = wardBeds.filter(b => b.status === 'available').length;
  const maintenance = wardBeds.filter(b => b.status === 'maintenance').length;
  const occupancyRate = Math.round((occupied / wardBeds.length) * 100);

  const totalBeds = Object.values(beds).flat();
  const globalOccupied = totalBeds.filter(b => b.status === 'occupied').length;
  const globalAvailable = totalBeds.filter(b => b.status === 'available').length;
  const globalRate = Math.round((globalOccupied / totalBeds.length) * 100);

  const cycleBedStatus = (wardId, bedId) => {
    const cycle = ['available', 'occupied', 'maintenance'];
    setBeds(prev => ({
      ...prev,
      [wardId]: prev[wardId].map(b => {
        if (b.id !== bedId) return b;
        const next = cycle[(cycle.indexOf(b.status) + 1) % 3];
        return { ...b, status: next, patient: next === 'occupied' ? 'Yeni Hasta' : null };
      }),
    }));
  };

  const toggleEquipmentStatus = (id) => {
    setEquipment(prev => prev.map(e => {
      if (e.id !== id) return e;
      const next = e.status === 'active' ? 'maintenance' : e.status === 'maintenance' ? 'inactive' : 'active';
      addNotification('info', `${e.name} durumu güncellendi: ${eqStatus[next].label}`);
      return { ...e, status: next };
    }));
  };

  const TABS = [
    { key: 'beds', label: '🛏️ Yatak Yönetimi' },
    { key: 'equipment', label: '🔧 Ekipman' },
    { key: 'or', label: '🏥 Ameliyathane' },
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Building2 size={32} color="var(--primary)" /> Operasyon Merkezi
          </h1>
          <p className="text-muted">Yatak doluluk, ekipman ve ameliyathane takvimi.</p>
        </div>
        <button className="glass-button" onClick={() => { setBeds(initBeds()); addNotification('info', 'Yatak durumu yenilendi.'); }} style={{ padding: '10px 18px' }}>
          <RefreshCw size={16} /> Yenile
        </button>
      </div>

      {/* Özet Kartlar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Toplam Yatak', value: totalBeds.length, icon: <Bed size={20} />, color: 'var(--primary)' },
          { label: 'Dolu Yatak',   value: globalOccupied,   icon: <Users size={20} />, color: 'var(--danger)' },
          { label: 'Boş Yatak',    value: globalAvailable,  icon: <CheckCircle size={20} />, color: 'var(--success)' },
          { label: 'Doluluk Oranı', value: `%${globalRate}`, icon: <BarChart2 size={20} />, color: globalRate > 85 ? 'var(--danger)' : globalRate > 60 ? 'var(--warning)' : 'var(--success)' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '10px', background: `${color}22`, borderRadius: '10px', color }}>{icon}</div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--glass-bg)', padding: '4px', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '24px', width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={activeTab === t.key ? 'glass-button primary' : 'glass-button'}
            style={{ padding: '10px 22px', fontSize: '0.9rem', border: 'none' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ──────── TAB: YATAK ──────── */}
      {activeTab === 'beds' && (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px' }}>
          {/* Servis Listesi */}
          <div className="glass-panel" style={{ padding: '16px', height: 'fit-content' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Servisler</h4>
            {WARDS.map(w => {
              const wb = beds[w.id] || [];
              const occ = wb.filter(b => b.status === 'occupied').length;
              const rate = Math.round((occ / wb.length) * 100);
              return (
                <button key={w.id} onClick={() => setActiveWard(w.id)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', border: 'none', background: activeWard === w.id ? 'rgba(0,229,255,0.1)' : 'transparent', cursor: 'pointer', marginBottom: '4px', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: w.color }} />
                    <span style={{ fontSize: '0.88rem', color: activeWard === w.id ? 'var(--primary)' : 'var(--text-main)' }}>{w.label}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: rate > 85 ? 'var(--danger)' : rate > 60 ? 'var(--warning)' : 'var(--success)', fontWeight: 600 }}>%{rate}</span>
                </button>
              );
            })}
          </div>

          {/* Yatak Grid */}
          <div>
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ color: ward?.color, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bed size={20} /> {ward?.label} Servisi
                </h3>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem' }}>
                  {[['Dolu', occupied, '#ef4444'], ['Boş', available, '#22c55e'], ['Bakım', maintenance, '#eab308']].map(([l, v, c]) => (
                    <span key={l} style={{ color: c, fontWeight: 600 }}>{l}: {v}</span>
                  ))}
                </div>
              </div>
              {/* Doluluk Çubuğu */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>Doluluk</span><span>%{occupancyRate}</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${occupancyRate}%`, background: occupancyRate > 85 ? 'var(--danger)' : occupancyRate > 60 ? 'var(--warning)' : 'var(--success)', borderRadius: '4px', transition: 'width 0.5s' }} />
                </div>
              </div>
              {/* Yatak Izgara */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '8px' }}>
                {wardBeds.map(bed => {
                  const sc = statusConfig[bed.status];
                  return (
                    <div key={bed.id} title={`${bed.patient || sc.label} ${bed.since ? `— ${bed.since}` : ''}`}
                      onClick={() => cycleBedStatus(activeWard, bed.id)}
                      style={{ padding: '10px', borderRadius: '10px', background: sc.bg, border: `1px solid ${sc.color}44`, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                      <Bed size={18} color={sc.color} style={{ marginBottom: '4px' }} />
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: sc.color }}>#{bed.number}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {bed.patient || sc.label}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '12px' }}>💡 Yatak kutucuklarına tıklayarak durumu döngüsel olarak değiştirebilirsiniz.</p>
            </div>
          </div>
        </div>
      )}

      {/* ──────── TAB: EKİPMAN ──────── */}
      {activeTab === 'equipment' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench size={20} color="var(--primary)" /> Tıbbi Ekipman Takibi
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {equipment.map(eq => {
              const sc = eqStatus[eq.status];
              const nextDate = new Date(eq.nextMaint);
              const daysLeft = Math.ceil((nextDate - new Date()) / (1000 * 60 * 60 * 24));
              const overdue = daysLeft < 0;
              return (
                <div key={eq.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${overdue ? 'rgba(239,68,68,0.3)' : 'var(--glass-border)'}` }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: sc.color, flexShrink: 0, boxShadow: `0 0 8px ${sc.color}` }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>{eq.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{eq.ward} · Son bakım: {eq.lastMaint}</div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '120px' }}>
                    <div style={{ fontSize: '0.78rem', color: overdue ? 'var(--danger)' : daysLeft < 14 ? 'var(--warning)' : 'var(--text-muted)', marginBottom: '2px' }}>
                      {overdue ? `${Math.abs(daysLeft)} gün gecikmiş` : `${daysLeft} gün kaldı`}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Bakım: {eq.nextMaint}</div>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '0.78rem', background: `${sc.color}22`, color: sc.color, fontWeight: 600 }}>{sc.label}</span>
                  <button className="glass-button" onClick={() => toggleEquipmentStatus(eq.id)} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                    Durum Değiştir
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ──────── TAB: AMELİYATHANE ──────── */}
      {activeTab === 'or' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="var(--primary)" /> Günlük Ameliyat Programı
          </h3>
          {/* Zaman Çizelgesi */}
          <div style={{ position: 'relative', paddingLeft: '80px', marginBottom: '24px' }}>
            {['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00'].map(h => (
              <div key={h} style={{ height: '48px', borderTop: '1px solid var(--glass-border)', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '-74px', top: '-10px', fontSize: '0.72rem', color: 'var(--text-muted)', width: '64px', textAlign: 'right' }}>{h}</span>
              </div>
            ))}
            {/* Ameliyat Blokları */}
            {orSchedule.map(op => {
              const startH = parseInt(op.start.split(':')[0]) - 7;
              const startM = parseInt(op.start.split(':')[1]);
              const endH = parseInt(op.end.split(':')[0]) - 7;
              const endM = parseInt(op.end.split(':')[1]);
              const top = (startH * 60 + startM) * (48 / 60);
              const height = ((endH - startH) * 60 + (endM - startM)) * (48 / 60);
              const leftMap = { 'ODA 1': '0%', 'ODA 2': '34%', 'ODA 3': '68%' };
              const sc = orStatus[op.status];
              return (
                <div key={op.id} style={{ position: 'absolute', top: `${top}px`, left: leftMap[op.or], width: '32%', height: `${height}px`, background: `${sc.color}22`, border: `1px solid ${sc.color}66`, borderRadius: '8px', padding: '6px 10px', overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: sc.color }}>{op.or}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-main)', marginTop: '2px' }}>{op.patient}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{op.op}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{op.surgeon}</div>
                </div>
              );
            })}
          </div>
          {/* Tablo Listesi */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {orSchedule.map(op => {
              const sc = orStatus[op.status];
              return (
                <div key={op.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 18px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)' }}>
                  <span style={{ width: '72px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>{op.start}–{op.end}</span>
                  <span style={{ width: '72px', fontSize: '0.78rem', padding: '3px 10px', borderRadius: '8px', background: 'rgba(0,229,255,0.1)', color: 'var(--primary)', textAlign: 'center' }}>{op.or}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{op.patient}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{op.op} · {op.surgeon}</div>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '0.78rem', background: `${sc.color}22`, color: sc.color, fontWeight: 600 }}>{sc.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationsCenter;
