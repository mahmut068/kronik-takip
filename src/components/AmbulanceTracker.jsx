import React, { useState, useEffect, useCallback } from 'react';
import { Truck, MapPin, Radio, Clock, AlertTriangle, CheckCircle, Phone, Navigation, Activity, Users } from 'lucide-react';

const INITIAL_AMBULANCES = [
  { id: 'AMB-01', driver: 'Murat Çelik', paramedic: 'Selin Arslan', status: 'available', lat: 41.015, lng: 28.979, location: 'Merkez Garaj', mission: null, fuel: 87, lastUpdate: '18:45' },
  { id: 'AMB-02', driver: 'Hakan Yıldız', paramedic: 'Deniz Kaya', status: 'onMission', lat: 41.021, lng: 28.992, location: 'Bağcılar Cad.', mission: { patient: 'Acil Vaka #1', type: 'Kardiyak', eta: '4 dk', priority: 'critical' }, fuel: 62, lastUpdate: '18:52' },
  { id: 'AMB-03', driver: 'Emre Doğan', paramedic: 'Aylin Kurt', status: 'returning', lat: 41.009, lng: 28.965, location: 'E-5 Karayolu', mission: null, fuel: 45, lastUpdate: '18:50' },
  { id: 'AMB-04', driver: 'Tolga Şahin', paramedic: 'Burcu Ak', status: 'onMission', lat: 41.031, lng: 28.988, location: 'Güneşli Mh.', mission: { patient: 'Acil Vaka #2', type: 'Travma', eta: '7 dk', priority: 'high' }, fuel: 78, lastUpdate: '18:49' },
  { id: 'AMB-05', driver: 'Serkan Koç', paramedic: 'Merve Yılmaz', status: 'maintenance', lat: 41.013, lng: 28.971, location: 'Servis', mission: null, fuel: 100, lastUpdate: '17:30' },
];

const CALLS = [
  { id: 'C001', time: '18:52', caller: 'Ahmet B.', address: 'Bağcılar, Fatih Cad. 14/2', complaint: 'Göğüs ağrısı, nefes darlığı', priority: 'critical', status: 'dispatched', assignedTo: 'AMB-02' },
  { id: 'C002', time: '18:49', caller: 'Fatma H.', address: 'Güneşli, Atatürk Blv. 88', complaint: 'Trafik kazası, bilinç kaybı', priority: 'high', status: 'dispatched', assignedTo: 'AMB-04' },
  { id: 'C003', time: '18:41', caller: '112 Yönlendirme', address: 'Bağcılar Devlet Hastanesi', complaint: 'Hasta transferi — YBÜ', priority: 'medium', status: 'completed', assignedTo: 'AMB-03' },
  { id: 'C004', time: '18:35', caller: 'İbrahim K.', address: 'Gaziosmanpaşa, Millet Sk. 3', complaint: 'Yüksek ateş, kramp', priority: 'medium', status: 'completed', assignedTo: 'AMB-01' },
];

const STATUS_CFG = {
  available:   { label: 'Müsait',    color: '#10b981', bg: 'rgba(16,185,129,0.15)',  icon: '🟢' },
  onMission:   { label: 'Görevde',   color: '#f59e0b', bg: 'rgba(245,158,11,0.15)',  icon: '🟡' },
  returning:   { label: 'Dönüyor',   color: '#3b82f6', bg: 'rgba(59,130,246,0.15)',  icon: '🔵' },
  maintenance: { label: 'Bakımda',   color: '#94a3b8', bg: 'rgba(148,163,184,0.15)', icon: '⚫' },
};

const PRIORITY_CFG = {
  critical: { label: 'KRİTİK', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  high:     { label: 'YÜKSEK', color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
  medium:   { label: 'ORTA',   color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  low:      { label: 'DÜŞÜK',  color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
};

export default function AmbulanceTracker({ addNotification }) {
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);
  const [calls] = useState(CALLS);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('fleet');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => t + 1);
      // Simulate live location updates
      setAmbulances(prev => prev.map(a => {
        if (a.status === 'onMission' || a.status === 'returning') {
          return { ...a, lat: a.lat + (Math.random() - 0.5) * 0.001, lng: a.lng + (Math.random() - 0.5) * 0.001, lastUpdate: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) };
        }
        return a;
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const dispatchAmbulance = useCallback((ambId) => {
    setAmbulances(prev => prev.map(a => a.id === ambId ? { ...a, status: 'onMission', mission: { patient: 'Yeni Çağrı', type: 'Genel', eta: `${Math.floor(Math.random()*8)+3} dk`, priority: 'medium' } } : a));
    addNotification?.('info', `${ambId} göreve gönderildi.`);
  }, [addNotification]);

  const completeReturn = useCallback((ambId) => {
    setAmbulances(prev => prev.map(a => a.id === ambId ? { ...a, status: 'available', mission: null, lastUpdate: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) } : a));
    addNotification?.('success', `${ambId} görevi tamamladı, müsait.`);
  }, [addNotification]);

  const available = ambulances.filter(a => a.status === 'available').length;
  const onMission = ambulances.filter(a => a.status === 'onMission').length;
  const activeCalls = calls.filter(c => c.status === 'dispatched').length;

  const selectedAmb = ambulances.find(a => a.id === selected);

  return (
    <div className="animate-fade-in" style={{ padding: '0 0 60px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Truck size={30} color="var(--primary)" /> Ambulans Takip Sistemi
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
            Filo yönetimi · Çağrı koordinasyonu · Gerçek zamanlı konum
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 600 }}>CANLI İZLEME AKTİF</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Toplam Ambulans', value: ambulances.length, icon: <Truck size={20}/>, color: 'var(--primary)' },
          { label: 'Müsait', value: available, icon: <CheckCircle size={20}/>, color: '#10b981' },
          { label: 'Görevde', value: onMission, icon: <Navigation size={20}/>, color: '#f59e0b' },
          { label: 'Aktif Çağrı', value: activeCalls, icon: <Radio size={20}/>, color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {[{ k: 'fleet', l: '🚑 Filo Durumu' }, { k: 'calls', l: `📡 Çağrı Merkezi (${calls.length})` }, { k: 'map', l: '🗺️ Harita Görünümü' }].map(t => (
          <button key={t.k} className={`glass-button ${tab === t.k ? 'primary' : ''}`} onClick={() => setTab(t.k)} style={{ fontSize: '0.85rem' }}>{t.l}</button>
        ))}
      </div>

      {/* FLEET TAB */}
      {tab === 'fleet' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedAmb ? '1fr 340px' : '1fr', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ambulances.map(amb => {
              const sc = STATUS_CFG[amb.status];
              const isSelected = selected === amb.id;
              return (
                <div key={amb.id} className="glass-panel" onClick={() => setSelected(isSelected ? null : amb.id)}
                  style={{ padding: '16px 20px', cursor: 'pointer', border: isSelected ? `1px solid var(--primary)` : `1px solid var(--glass-border)`, transition: 'all 0.2s', background: isSelected ? 'rgba(0,229,255,0.05)' : 'var(--glass-bg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: sc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{sc.icon}</div>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1.05rem' }}>{amb.id}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{amb.driver} · {amb.paramedic}</div>
                        <div style={{ fontSize: '0.72rem', color: sc.color, marginTop: 2 }}><MapPin size={10} style={{ display: 'inline', marginRight: 3 }}/>{amb.location}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                      <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, color: sc.color, background: sc.bg }}>{sc.label}</span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        ⛽ <span style={{ color: amb.fuel < 30 ? '#ef4444' : amb.fuel < 50 ? '#f59e0b' : '#10b981' }}>{amb.fuel}%</span> · {amb.lastUpdate}
                      </div>
                      {amb.status === 'onMission' && amb.mission && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: 6, background: PRIORITY_CFG[amb.mission.priority].bg, color: PRIORITY_CFG[amb.mission.priority].color, fontWeight: 700 }}>{PRIORITY_CFG[amb.mission.priority].label}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--primary)' }}><Clock size={10} style={{ display: 'inline' }}/> {amb.mission.eta}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {amb.status === 'onMission' && amb.mission && (
                    <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <Activity size={12} style={{ display: 'inline', color: '#f59e0b', marginRight: 4 }}/>
                      {amb.mission.patient} — {amb.mission.type}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detail Panel */}
          {selectedAmb && (
            <div className="glass-panel" style={{ padding: 20, height: 'fit-content', position: 'sticky', top: 0 }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Truck size={18}/> {selectedAmb.id} Detayı
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6 }}>SÜRÜCÜ & PARAMEDİK</div>
                  <div style={{ fontWeight: 700 }}>{selectedAmb.driver}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{selectedAmb.paramedic}</div>
                </div>
                <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6 }}>MEVCUT KONUM</div>
                  <div style={{ fontWeight: 700 }}>{selectedAmb.location}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>{selectedAmb.lat.toFixed(4)}N, {selectedAmb.lng.toFixed(4)}E</div>
                </div>
                <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6 }}>YAKIT</div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${selectedAmb.fuel}%`, background: selectedAmb.fuel < 30 ? '#ef4444' : '#10b981', borderRadius: 4, transition: 'width 0.5s' }}/>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>%{selectedAmb.fuel}</div>
                </div>
                {selectedAmb.status === 'available' && (
                  <button className="glass-button primary" onClick={() => dispatchAmbulance(selectedAmb.id)} style={{ width: '100%', justifyContent: 'center', gap: 8 }}>
                    <Navigation size={16}/> Göreve Gönder
                  </button>
                )}
                {selectedAmb.status === 'returning' && (
                  <button className="glass-button" onClick={() => completeReturn(selectedAmb.id)} style={{ width: '100%', justifyContent: 'center', gap: 8, borderColor: '#10b981', color: '#10b981' }}>
                    <CheckCircle size={16}/> Müsaite Al
                  </button>
                )}
                <button className="glass-button" onClick={() => addNotification?.('info', `${selectedAmb.id} ile iletişim kuruluyor...`)} style={{ width: '100%', justifyContent: 'center', gap: 8 }}>
                  <Phone size={16}/> Telsiz Bağlantısı
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CALLS TAB */}
      {tab === 'calls' && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ color: 'var(--text-main)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Radio size={20} color="var(--primary)"/> Çağrı Kayıtları
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {calls.map(call => {
              const pc = PRIORITY_CFG[call.priority];
              return (
                <div key={call.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: call.status === 'dispatched' ? `1px solid ${pc.color}44` : '1px solid var(--glass-border)' }}>
                  <div style={{ width: 48, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{call.time}</div>
                    <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--primary)' }}>{call.id}</div>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700, color: pc.color, background: pc.bg, flexShrink: 0 }}>{pc.label}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>{call.complaint}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}><MapPin size={10} style={{ display: 'inline' }}/> {call.address} · {call.caller}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: call.status === 'dispatched' ? '#f59e0b' : '#10b981' }}>
                      {call.status === 'dispatched' ? '🚑 ' + call.assignedTo : '✅ Tamamlandı'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{call.assignedTo}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MAP TAB */}
      {tab === 'map' && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={20} color="var(--primary)"/> Canlı Filo Haritası</h3>
          {/* Simulated Map Grid */}
          <div style={{ position: 'relative', background: 'rgba(0,229,255,0.03)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 16, height: 420, overflow: 'hidden' }}>
            {/* Grid lines */}
            {[...Array(8)].map((_, i) => (
              <div key={`h${i}`} style={{ position: 'absolute', left: 0, right: 0, top: `${i * 14.28}%`, borderTop: '1px solid rgba(255,255,255,0.04)' }}/>
            ))}
            {[...Array(10)].map((_, i) => (
              <div key={`v${i}`} style={{ position: 'absolute', top: 0, bottom: 0, left: `${i * 11.11}%`, borderLeft: '1px solid rgba(255,255,255,0.04)' }}/>
            ))}
            {/* Hospital marker */}
            <div style={{ position: 'absolute', top: '48%', left: '48%', transform: 'translate(-50%,-50%)', textAlign: 'center', zIndex: 2 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,229,255,0.2)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏥</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--primary)', marginTop: 3, fontWeight: 700 }}>MediTrack</div>
            </div>
            {/* Ambulance markers */}
            {ambulances.map((amb, idx) => {
              const sc = STATUS_CFG[amb.status];
              const positions = [{ top: '20%', left: '72%' }, { top: '35%', left: '30%' }, { top: '65%', left: '60%' }, { top: '25%', left: '55%' }, { top: '75%', left: '25%' }];
              const pos = positions[idx] || { top: '50%', left: '50%' };
              return (
                <div key={amb.id} style={{ position: 'absolute', ...pos, transform: 'translate(-50%,-50%)', textAlign: 'center', cursor: 'pointer', zIndex: 3 }}
                  onClick={() => setSelected(selected === amb.id ? null : amb.id)}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: sc.bg, border: `2px solid ${sc.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: selected === amb.id ? `0 0 16px ${sc.color}` : 'none', transition: 'all 0.3s' }}>🚑</div>
                  <div style={{ fontSize: '0.6rem', color: sc.color, marginTop: 2, fontWeight: 700, background: 'rgba(0,0,0,0.7)', padding: '1px 4px', borderRadius: 4 }}>{amb.id}</div>
                </div>
              );
            })}
            {/* Legend */}
            <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 5, background: 'rgba(0,0,0,0.6)', padding: '10px 14px', borderRadius: 10 }}>
              {Object.entries(STATUS_CFG).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: v.color }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: v.color }}/> {v.label}
                </div>
              ))}
            </div>
            <div style={{ position: 'absolute', top: 12, left: 12, fontSize: '0.72rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.6)', padding: '6px 10px', borderRadius: 8 }}>
              📍 İstanbul Merkez · Simüle Harita
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {ambulances.map(amb => {
              const sc = STATUS_CFG[amb.status];
              return (
                <div key={amb.id} style={{ padding: '8px 14px', borderRadius: 8, background: sc.bg, border: `1px solid ${sc.color}44`, fontSize: '0.78rem', color: sc.color, fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => setSelected(selected === amb.id ? null : amb.id)}>
                  {amb.id} · {sc.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
