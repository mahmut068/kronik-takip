import React, { useState } from 'react';
import { Scissors, Clock, User, CheckCircle, AlertTriangle, Plus, X, Calendar, Activity } from 'lucide-react';

const OR_ROOMS = [
  { id: 1, name: 'Ameliyathane 1', type: 'Genel Cerrahi' },
  { id: 2, name: 'Ameliyathane 2', type: 'Kardiyovasküler' },
  { id: 3, name: 'Ameliyathane 3', type: 'Ortopedi' },
];

const INITIAL_OPS = [
  { id: 1, roomId: 1, patient: 'Selin Demirci',  procedure: 'Laparoskopik Kolesistektomi', surgeon: 'Prof. Dr. Ahmet Kaya',    start: '08:00', duration: 90,  status: 'completed', priority: 'elective',  blood: 'A+',  asa: 2 },
  { id: 2, roomId: 1, patient: 'Mehmet Öz',       procedure: 'Apendektomi',                surgeon: 'Dr. Elif Arslan',         start: '10:30', duration: 60,  status: 'in-progress',priority: 'urgent',   blood: 'B+',  asa: 1 },
  { id: 3, roomId: 1, patient: 'Hande Yıldız',    procedure: 'Inguinal Herni Onarımı',     surgeon: 'Prof. Dr. Ahmet Kaya',    start: '14:00', duration: 75,  status: 'scheduled', priority: 'elective', blood: 'O+',  asa: 1 },
  { id: 4, roomId: 2, patient: 'Kemal Aydın',     procedure: 'CABG × 3',                  surgeon: 'Prof. Dr. Murat Şahin',   start: '07:30', duration: 240, status: 'completed', priority: 'urgent',   blood: 'O-',  asa: 4 },
  { id: 5, roomId: 2, patient: 'Aysel Kara',      procedure: 'Mitral Kapak Tamiri',        surgeon: 'Prof. Dr. Murat Şahin',   start: '13:00', duration: 180, status: 'scheduled', priority: 'elective', blood: 'AB+', asa: 3 },
  { id: 6, roomId: 3, patient: 'Turhan Bozkurt',  procedure: 'Total Diz Artroplastisi',    surgeon: 'Dr. Zeynep Kaya',         start: '09:00', duration: 120, status: 'completed', priority: 'elective', blood: 'A-',  asa: 2 },
  { id: 7, roomId: 3, patient: 'Nesrin Çetin',    procedure: 'Lumbar Disk Hernisi',        surgeon: 'Dr. Zeynep Kaya',         start: '12:00', duration: 90,  status: 'in-progress',priority: 'urgent',   blood: 'B-',  asa: 2 },
];

const STATUS_CFG = {
  'completed':    { label: 'Tamamlandı',    color: 'var(--success)', bg: 'rgba(16,185,129,0.12)',  icon: <CheckCircle size={13}/> },
  'in-progress':  { label: 'Devam Ediyor', color: 'var(--primary)', bg: 'rgba(0,229,255,0.12)',   icon: <Activity size={13}/> },
  'scheduled':    { label: 'Planlandı',    color: '#f59e0b',        bg: 'rgba(245,158,11,0.12)',  icon: <Clock size={13}/> },
  'cancelled':    { label: 'İptal',        color: 'var(--danger)',  bg: 'rgba(244,63,94,0.12)',   icon: <X size={13}/> },
};

const PRIORITY_CFG = {
  'elective': { label: 'Elektif',  color: '#94a3b8' },
  'urgent':   { label: 'Acil',    color: '#f59e0b' },
  'emergency':{ label: 'Emerjan', color: 'var(--danger)' },
};

const ASA_COLOR = { 1: 'var(--success)', 2: '#10b981', 3: '#f59e0b', 4: 'var(--danger)', 5: '#7f1d1d' };

const timeToMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const minToTime = (m) => `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;

function TimelineBar({ ops, roomId }) {
  const roomOps = ops.filter(o => o.roomId === roomId);
  const dayStart = 7 * 60;  // 07:00
  const dayEnd   = 20 * 60; // 20:00
  const dayLen   = dayEnd - dayStart;

  return (
    <div style={{ position: 'relative', height: 40, background: 'rgba(255,255,255,0.03)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
      {/* Hour markers */}
      {[7,9,11,13,15,17,19].map(h => (
        <div key={h} style={{ position: 'absolute', left: `${((h*60-dayStart)/dayLen)*100}%`, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.07)' }}>
          <span style={{ position: 'absolute', top: 2, left: 3, fontSize: '0.58rem', color: 'var(--text-muted)' }}>{h}:00</span>
        </div>
      ))}
      {roomOps.map(op => {
        const startMin = timeToMin(op.start) - dayStart;
        const left = Math.max(0, (startMin / dayLen) * 100);
        const width = Math.min(100 - left, (op.duration / dayLen) * 100);
        const sc = STATUS_CFG[op.status];
        return (
          <div key={op.id} title={`${op.patient} — ${op.procedure}\n${op.start} (${op.duration} dk)`}
            style={{ position: 'absolute', left: `${left}%`, width: `${width}%`, top: 4, bottom: 4,
              background: sc.color, opacity: 0.8, borderRadius: 4, display: 'flex', alignItems: 'center',
              paddingLeft: 4, overflow: 'hidden', cursor: 'pointer' }}>
            <span style={{ fontSize: '0.62rem', color: '#fff', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {op.patient}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function SurgeryScheduler({ addNotification }) {
  const [ops, setOps] = useState(INITIAL_OPS);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedOp, setSelectedOp]   = useState(null);
  const [showForm, setShowForm]        = useState(false);
  const [tab, setTab]                  = useState('timeline');
  const [newOp, setNewOp] = useState({
    roomId: 1, patient: '', procedure: '', surgeon: '', start: '09:00', duration: 60, priority: 'elective', blood: 'A+', asa: 1,
  });

  const addOp = () => {
    if (!newOp.patient || !newOp.procedure || !newOp.surgeon) return;
    const op = { ...newOp, id: Date.now(), status: 'scheduled' };
    setOps(prev => [...prev, op]);
    addNotification?.('success', `Ameliyat planlandı: ${newOp.patient} — ${newOp.procedure}`);
    setShowForm(false);
    setNewOp({ roomId: 1, patient: '', procedure: '', surgeon: '', start: '09:00', duration: 60, priority: 'elective', blood: 'A+', asa: 1 });
  };

  const updateStatus = (id, status) => {
    setOps(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    addNotification?.('info', `Ameliyat durumu güncellendi.`);
    setSelectedOp(null);
  };

  const visibleOps = selectedRoom ? ops.filter(o => o.roomId === selectedRoom) : ops;
  const selOp = selectedOp ? ops.find(o => o.id === selectedOp) : null;

  const statsToday = {
    total:      ops.length,
    completed:  ops.filter(o => o.status === 'completed').length,
    active:     ops.filter(o => o.status === 'in-progress').length,
    scheduled:  ops.filter(o => o.status === 'scheduled').length,
  };

  return (
    <div className="animate-fade-in" style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Scissors size={26} color="#8b5cf6" /> Ameliyat Planlayıcı
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            Günlük operasyon takvimi, ameliyathane yönetimi
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className={`glass-button ${!selectedRoom ? 'primary' : ''}`} onClick={() => setSelectedRoom(null)} style={{ fontSize: '0.82rem' }}>Tüm Salonlar</button>
            {OR_ROOMS.map(r => (
              <button key={r.id} className={`glass-button ${selectedRoom === r.id ? 'primary' : ''}`}
                onClick={() => setSelectedRoom(selectedRoom === r.id ? null : r.id)} style={{ fontSize: '0.82rem' }}>
                {r.name}
              </button>
            ))}
          </div>
          <button className="glass-button primary" onClick={() => setShowForm(true)} style={{ gap: 8 }}>
            <Plus size={15}/> Ameliyat Ekle
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {[
          { label: 'Toplam Operasyon', value: statsToday.total,    color: 'var(--primary)', icon: <Scissors size={18}/> },
          { label: 'Tamamlanan',       value: statsToday.completed, color: 'var(--success)', icon: <CheckCircle size={18}/> },
          { label: 'Devam Eden',       value: statsToday.active,    color: 'var(--primary)', icon: <Activity size={18}/> },
          { label: 'Planlanmış',       value: statsToday.scheduled, color: '#f59e0b',        icon: <Clock size={18}/> },
        ].map((s, i) => (
          <div key={i} className="glass-panel" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[{ key: 'timeline', label: 'Zaman Çizelgesi' }, { key: 'list', label: 'Liste Görünümü' }].map(t => (
          <button key={t.key} className={`glass-button ${tab === t.key ? 'primary' : ''}`} onClick={() => setTab(t.key)} style={{ fontSize: '0.85rem' }}>{t.label}</button>
        ))}
      </div>

      {/* New Op Form */}
      {showForm && (
        <div className="glass-panel" style={{ padding: 20, border: '1px solid #8b5cf6' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 14, display: 'flex', justifyContent: 'space-between' }}>
            <span>Yeni Ameliyat Planla</span>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={16}/></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {[
              { label: 'Hasta Adı', key: 'patient', placeholder: 'Hasta adı...' },
              { label: 'Prosedür',  key: 'procedure', placeholder: 'Ameliyat adı...' },
              { label: 'Cerrah',    key: 'surgeon',  placeholder: 'Dr. ...' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>{f.label}</div>
                <input value={newOp[f.key]} onChange={e => setNewOp(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-main)', fontSize: '0.88rem', boxSizing: 'border-box', fontFamily: 'Outfit, sans-serif', outline: 'none' }}/>
              </div>
            ))}
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Ameliyathane</div>
              <select value={newOp.roomId} onChange={e => setNewOp(p => ({ ...p, roomId: Number(e.target.value) }))}
                style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-main)', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none' }}>
                {OR_ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Başlangıç</div>
              <input type="time" value={newOp.start} onChange={e => setNewOp(p => ({ ...p, start: e.target.value }))}
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-main)', fontSize: '0.88rem', boxSizing: 'border-box', fontFamily: 'Outfit, sans-serif', outline: 'none' }}/>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Süre (dk)</div>
              <input type="number" min={15} max={480} step={15} value={newOp.duration} onChange={e => setNewOp(p => ({ ...p, duration: Number(e.target.value) }))}
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-main)', fontSize: '0.88rem', boxSizing: 'border-box', fontFamily: 'Outfit, sans-serif', outline: 'none' }}/>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Öncelik</div>
              <select value={newOp.priority} onChange={e => setNewOp(p => ({ ...p, priority: e.target.value }))}
                style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-main)', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none' }}>
                <option value="elective">Elektif</option>
                <option value="urgent">Acil</option>
                <option value="emergency">Emerjan</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Kan Grubu</div>
              <select value={newOp.blood} onChange={e => setNewOp(p => ({ ...p, blood: e.target.value }))}
                style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-main)', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none' }}>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <button className="glass-button primary" style={{ flex: 1, gap: 6 }} onClick={addOp}><CheckCircle size={14}/> Planla</button>
              <button className="glass-button" onClick={() => setShowForm(false)}>İptal</button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline View */}
      {tab === 'timeline' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0, overflowY: 'auto' }}>
          {OR_ROOMS.filter(r => !selectedRoom || r.id === selectedRoom).map(room => (
            <div key={room.id} className="glass-panel" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{room.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{room.type} · {ops.filter(o=>o.roomId===room.id).length} operasyon</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['completed','in-progress','scheduled'].map(s => {
                    const cnt = ops.filter(o => o.roomId === room.id && o.status === s).length;
                    if (!cnt) return null;
                    const sc = STATUS_CFG[s];
                    return <span key={s} style={{ padding: '3px 10px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 700, color: sc.color, background: sc.bg }}>{cnt} {sc.label}</span>;
                  })}
                </div>
              </div>
              <TimelineBar ops={ops} roomId={room.id}/>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {tab === 'list' && (
        <div style={{ flex: 1, display: 'flex', gap: 16, minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visibleOps.sort((a,b) => timeToMin(a.start) - timeToMin(b.start)).map(op => {
              const sc = STATUS_CFG[op.status];
              const pc = PRIORITY_CFG[op.priority];
              const endTime = minToTime(timeToMin(op.start) + op.duration);
              const room = OR_ROOMS.find(r => r.id === op.roomId);
              return (
                <div key={op.id} className="glass-panel surgery-slot" onClick={() => setSelectedOp(selectedOp === op.id ? null : op.id)}
                  style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
                    border: selectedOp === op.id ? '1px solid #8b5cf6' : op.status === 'in-progress' ? '1px solid rgba(0,229,255,0.3)' : '1px solid var(--glass-border)' }}>
                  {/* Time */}
                  <div style={{ textAlign: 'center', flex: '0 0 70px' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{op.start}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{endTime}</div>
                  </div>
                  {/* Main info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{op.patient}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: pc.color }}>● {pc.label}</span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ASA {op.asa}</span>
                      <span style={{ padding: '1px 6px', borderRadius: 5, background: 'rgba(244,63,94,0.1)', color: '#f43f5e', fontSize: '0.7rem', fontWeight: 700 }}>{op.blood}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{op.procedure}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      <User size={10} style={{ marginRight: 4 }}/>{op.surgeon} · {room?.name} · {op.duration} dk
                    </div>
                  </div>
                  {/* Status */}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, color: sc.color, background: sc.bg }}>
                    {sc.icon} {sc.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Detail Panel */}
          {selOp && (
            <div style={{ flex: '0 0 260px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="glass-panel" style={{ padding: 20 }}>
                <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>{selOp.patient}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 14 }}>{selOp.procedure}</div>
                {[
                  { label: 'Cerrah',    value: selOp.surgeon },
                  { label: 'Başlangıç', value: `${selOp.start} (${selOp.duration} dk)` },
                  { label: 'Bitiş',     value: minToTime(timeToMin(selOp.start) + selOp.duration) },
                  { label: 'Salon',     value: OR_ROOMS.find(r => r.id === selOp.roomId)?.name },
                  { label: 'Kan Grubu', value: selOp.blood, color: '#f43f5e' },
                  { label: 'ASA Skoru', value: `${selOp.asa}`, color: ASA_COLOR[selOp.asa] },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.83rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                    <span style={{ color: row.color || 'var(--text-main)', fontWeight: 700 }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="glass-panel" style={{ padding: 16 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 10 }}>Durum Güncelle</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {Object.entries(STATUS_CFG).map(([key, val]) => (
                    <button key={key} className="glass-button" style={{ width: '100%', fontSize: '0.8rem', gap: 6, color: val.color, background: val.bg }}
                      onClick={() => updateStatus(selOp.id, key)}>
                      {val.icon} {val.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
