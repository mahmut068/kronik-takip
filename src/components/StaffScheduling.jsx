import React, { useState, useMemo } from 'react';
import { Calendar, Users, Clock, CheckCircle, AlertTriangle, Plus, ChevronLeft, ChevronRight, Stethoscope, Siren } from 'lucide-react';

const STAFF = [
  { id: 1, name: 'Dr. Elif Arslan',    role: 'Doktor',   dept: 'Kardiyoloji', color: '#00e5ff' },
  { id: 2, name: 'Dr. Murat Şahin',   role: 'Doktor',   dept: 'Dahiliye',    color: '#a855f7' },
  { id: 3, name: 'Dr. Zeynep Kaya',   role: 'Doktor',   dept: 'Acil Servis', color: '#f43f5e' },
  { id: 4, name: 'Hem. Selin Doğan',  role: 'Hemşire',  dept: 'YBÜ',         color: '#10b981' },
  { id: 5, name: 'Hem. Ali Yıldız',   role: 'Hemşire',  dept: 'Dahiliye',    color: '#f59e0b' },
  { id: 6, name: 'Hem. Fatma Çelik',  role: 'Hemşire',  dept: 'Kardiyoloji', color: '#3b82f6' },
  { id: 7, name: 'Dr. Kemal Avcı',    role: 'Doktor',   dept: 'Radyoloji',   color: '#8b5cf6' },
  { id: 8, name: 'Hem. Ayşe Bulut',   role: 'Hemşire',  dept: 'Acil Servis', color: '#ec4899' },
];

const SHIFT_TYPES = {
  morning: { label: 'Sabah (07-15)',  short: 'S', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  evening: { label: 'Akşam (15-23)', short: 'A', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  night:   { label: 'Gece (23-07)',  short: 'G', color: '#a855f7', bg: 'rgba(168,85,247,0.15)'  },
  off:     { label: 'İzin',          short: 'İ', color: '#64748b', bg: 'rgba(100,116,139,0.1)'  },
};

// Generate a week of shifts
const generateSchedule = () => {
  const schedule = {};
  const shifts = ['morning', 'evening', 'night', 'off'];
  STAFF.forEach(s => {
    schedule[s.id] = {};
    for (let d = 0; d < 7; d++) {
      // Ensure no more than 5 working days
      const rnd = Math.random();
      schedule[s.id][d] = rnd < 0.14 ? 'off' : shifts[d % 3];
    }
  });
  return schedule;
};

const getDayLabel = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return { short: d.toLocaleDateString('tr-TR', { weekday: 'short' }), date: d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' }) };
};

export default function StaffScheduling({ addNotification }) {
  const [schedule, setSchedule] = useState(generateSchedule);
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterRole, setFilterRole] = useState('all');
  const [editCell, setEditCell] = useState(null); // {staffId, day}
  const [selectedStaff, setSelectedStaff] = useState(null);

  const days = Array.from({ length: 7 }, (_, i) => getDayLabel(weekOffset * 7 + i));

  const filtered = useMemo(() => filterRole === 'all' ? STAFF : STAFF.filter(s => s.role === filterRole), [filterRole]);

  const totalShifts = (staffId) => Object.values(schedule[staffId] || {}).filter(v => v !== 'off').length;

  const dayCoverage = (day) => STAFF.filter(s => schedule[s.id]?.[day] !== 'off').length;

  const changeShift = (staffId, day, type) => {
    setSchedule(prev => ({ ...prev, [staffId]: { ...prev[staffId], [day]: type } }));
    setEditCell(null);
    addNotification?.('success', `Vardiya güncellendi: ${STAFF.find(s=>s.id===staffId)?.name}`);
  };

  const sel = selectedStaff ? STAFF.find(s => s.id === selectedStaff) : null;

  return (
    <div className="animate-fade-in" style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calendar size={28} color="var(--primary)" /> Personel Çizelgesi
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>Haftalık vardiya planlaması ve izin yönetimi</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['all','Doktor','Hemşire'].map(r => (
              <button key={r} className={`glass-button ${filterRole === r ? 'primary' : ''}`}
                onClick={() => setFilterRole(r)} style={{ fontSize: '0.82rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                {r === 'Doktor' ? <Stethoscope size={13}/> : r === 'Hemşire' ? <Siren size={13}/> : <Users size={13}/>}
                {r === 'all' ? 'Tümü' : r}
              </button>
            ))}
          </div>
          <button className="glass-button primary" style={{ gap: 6 }} onClick={() => addNotification?.('success', 'Çizelge PDF olarak dışa aktarıldı.')}>
            <Plus size={15}/> Dışa Aktar
          </button>
        </div>
      </div>

      {/* Week navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="glass-button" onClick={() => setWeekOffset(w => w-1)} style={{ padding: '8px 12px' }}><ChevronLeft size={16}/></button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
          {days[0].date} — {days[6].date}
          {weekOffset === 0 && <span style={{ marginLeft: 10, fontSize: '0.75rem', color: 'var(--primary)', background: 'rgba(0,229,255,0.1)', padding: '2px 8px', borderRadius: 6 }}>Bu Hafta</span>}
        </div>
        <button className="glass-button" onClick={() => setWeekOffset(w => w+1)} style={{ padding: '8px 12px' }}><ChevronRight size={16}/></button>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 8 }}>
        {days.map((d, i) => {
          const cov = dayCoverage(i);
          const isLow = cov < 4;
          return (
            <div key={i} className="glass-panel" style={{ padding: '10px 12px', textAlign: 'center', border: isLow ? '1px solid rgba(244,63,94,0.3)' : '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 2 }}>{d.short}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>{d.date}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: isLow ? 'var(--danger)' : 'var(--success)' }}>{cov}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>aktif</div>
              {isLow && <AlertTriangle size={10} color="var(--danger)" style={{ marginTop: 4 }}/>}
            </div>
          );
        })}
      </div>

      {/* Schedule Grid */}
      <div style={{ flex: 1, display: 'flex', gap: 16, minHeight: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px repeat(7,1fr)', gap: 4, minWidth: 700 }}>
            {/* Header row */}
            <div style={{ padding: '10px 14px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>PERSONEL</div>
            {days.map((d, i) => (
              <div key={i} style={{ padding: '10px 8px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                <div>{d.short}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{d.date}</div>
              </div>
            ))}

            {/* Staff rows */}
            {filtered.map(staff => (
              <React.Fragment key={staff.id}>
                <div className="glass-panel" onClick={() => setSelectedStaff(selectedStaff === staff.id ? null : staff.id)}
                  style={{ padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                    border: selectedStaff === staff.id ? `1px solid ${staff.color}` : '1px solid var(--glass-border)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: staff.color, flexShrink: 0 }}/>
                  <div>
                    <div style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--text-main)' }}>{staff.name}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{staff.dept} · {totalShifts(staff.id)}/7 vardiya</div>
                  </div>
                </div>
                {days.map((_, dayIdx) => {
                  const shiftKey = schedule[staff.id]?.[dayIdx] || 'off';
                  const sc = SHIFT_TYPES[shiftKey];
                  const isEdit = editCell?.staffId === staff.id && editCell?.day === dayIdx;
                  return (
                    <div key={dayIdx} style={{ position: 'relative' }}>
                      <div onClick={() => setEditCell(isEdit ? null : { staffId: staff.id, day: dayIdx })}
                        className="glass-panel"
                        style={{ padding: '12px 8px', textAlign: 'center', cursor: 'pointer',
                          background: sc.bg, border: `1px solid ${isEdit ? staff.color : 'transparent'}`,
                          transition: 'all 0.15s' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: sc.color }}>{sc.short}</div>
                        <div style={{ fontSize: '0.6rem', color: sc.color, opacity: 0.8, marginTop: 2 }}>
                          {shiftKey === 'morning' ? '07-15' : shiftKey === 'evening' ? '15-23' : shiftKey === 'night' ? '23-07' : 'İzin'}
                        </div>
                      </div>
                      {isEdit && (
                        <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 100, minWidth: 160, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 10, padding: 8, backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                          {Object.entries(SHIFT_TYPES).map(([key, val]) => (
                            <button key={key} onClick={() => changeShift(staff.id, dayIdx, key)}
                              style={{ width: '100%', padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: val.color, fontWeight: 700, fontSize: '0.82rem', fontFamily: 'Outfit, sans-serif', borderRadius: 6, transition: 'background 0.12s' }}
                              onMouseEnter={e => e.currentTarget.style.background = val.bg}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                              {val.short} — {val.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Side panel */}
        {sel && (
          <div style={{ flex: '0 0 240px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="glass-panel" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${sel.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: sel.color, fontWeight: 900, fontSize: '1rem' }}>
                  {sel.name.split(' ').pop()[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>{sel.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{sel.role} · {sel.dept}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {Object.entries(SHIFT_TYPES).map(([key, val]) => {
                  const cnt = Object.values(schedule[sel.id] || {}).filter(v => v === key).length;
                  return (
                    <div key={key} style={{ flex: 1, textAlign: 'center', background: val.bg, borderRadius: 8, padding: '8px 4px' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: val.color }}>{cnt}</div>
                      <div style={{ fontSize: '0.62rem', color: val.color, opacity: 0.8 }}>{val.short}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ padding: '10px 12px', background: 'rgba(0,229,255,0.06)', borderRadius: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <div style={{ color: 'var(--text-main)', fontWeight: 700, marginBottom: 4 }}>Bu Hafta</div>
                <div>Toplam vardiya: <strong style={{ color: 'var(--primary)' }}>{totalShifts(sel.id)}</strong></div>
                <div>İzin günü: <strong style={{ color: '#64748b' }}>{7 - totalShifts(sel.id)}</strong></div>
              </div>
            </div>
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 10 }}>İşlemler</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button className="glass-button" style={{ width: '100%', fontSize: '0.8rem', gap: 6 }}
                  onClick={() => addNotification?.('info', `${sel.name} için izin talebi oluşturuldu.`)}>
                  <Clock size={13}/> İzin Talebi
                </button>
                <button className="glass-button" style={{ width: '100%', fontSize: '0.8rem', gap: 6 }}
                  onClick={() => addNotification?.('success', `${sel.name} mesai raporu hazırlandı.`)}>
                  <CheckCircle size={13}/> Mesai Raporu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        {Object.entries(SHIFT_TYPES).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: val.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: val.color, fontWeight: 800, fontSize: '0.7rem' }}>{val.short}</div>
            <span style={{ color: 'var(--text-muted)' }}>{val.label}</span>
          </div>
        ))}
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 'auto' }}>
          💡 Hücreye tıklayarak vardiyayı değiştirebilirsiniz
        </span>
      </div>
    </div>
  );
}
