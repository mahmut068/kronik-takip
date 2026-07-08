import React, { useState, useEffect, useRef } from 'react';
import { Activity, AlertTriangle, Heart, Wind, Thermometer, Droplets, Plus, ClipboardList, CheckCircle, User, Moon } from 'lucide-react';

const INITIAL_BEDS = [
  { id: 1, patient: 'Ahmet Yılmaz', age: 62, dx: 'Akut MI + Kardiyojenik Şok', status: 'critical', admitted: '2026-07-04', vent: true, ventParams: { PEEP: 8, FiO2: 60, TV: 480, RR: 14 }, nurse: 'Elif K.', note: 'Norepinefrin 0.2 mcg/kg/dk infüzyon devam.' },
  { id: 2, patient: 'Fatma Şahin', age: 74, dx: 'KOAH Alevlenmesi', status: 'stable', admitted: '2026-07-05', vent: true, ventParams: { PEEP: 6, FiO2: 40, TV: 420, RR: 12 }, nurse: 'Murat S.', note: 'Steroid ve bronkodilatör tedavisi sürüyor.' },
  { id: 3, patient: 'Kemal Aydın', age: 55, dx: 'Septik Şok', status: 'critical', admitted: '2026-07-05', vent: true, ventParams: { PEEP: 10, FiO2: 80, TV: 500, RR: 16 }, nurse: 'Zeynep A.', note: 'Geniş spektrumlu antibiyotik. Laktat takibi.' },
  { id: 4, patient: 'Selin Demirci', age: 41, dx: 'Post-op İzlem (Hepatektomi)', status: 'stable', admitted: '2026-07-06', vent: false, ventParams: null, nurse: 'Elif K.', note: 'Post-op 1. gün. Drenaj takibi normal.' },
  { id: 5, patient: null, dx: null, status: 'empty', admitted: null, vent: false, ventParams: null, nurse: null, note: null },
  { id: 6, patient: null, dx: null, status: 'empty', admitted: null, vent: false, ventParams: null, nurse: null, note: null },
];

const generateVitals = (status) => ({
  hr: status === 'critical' ? 110 + Math.floor(Math.random() * 30) : 72 + Math.floor(Math.random() * 16),
  spo2: status === 'critical' ? 88 + Math.floor(Math.random() * 6) : 95 + Math.floor(Math.random() * 5),
  sbp: status === 'critical' ? 80 + Math.floor(Math.random() * 30) : 110 + Math.floor(Math.random() * 20),
  dbp: status === 'critical' ? 50 + Math.floor(Math.random() * 20) : 70 + Math.floor(Math.random() * 10),
  temp: status === 'critical' ? 38.2 + Math.random() * 1.5 : 36.5 + Math.random() * 0.8,
  etco2: status === 'critical' ? 28 + Math.floor(Math.random() * 10) : 35 + Math.floor(Math.random() * 8),
});

const ECGLine = ({ status }) => {
  const [points, setPoints] = useState([]);
  const frameRef = useRef(0);

  useEffect(() => {
    const w = 200, h = 50;
    const hr = status === 'critical' ? 120 : 72;
    const period = (60 / hr) * 60; // frames per beat
    let t = 0;
    const iv = setInterval(() => {
      t++;
      const phase = (t % period) / period;
      let y = h / 2;
      if (phase < 0.05) y = h / 2;
      else if (phase < 0.08) y = h / 2 - 2;
      else if (phase < 0.12) y = h / 2 + 4;
      else if (phase < 0.16) y = h * 0.05;
      else if (phase < 0.20) y = h / 2 - 3;
      else y = h / 2;
      setPoints(prev => {
        const next = [...prev, { x: (t % (w + 1)), y }];
        return next.filter(p => p.x <= w).slice(-w);
      });
    }, 16);
    return () => clearInterval(iv);
  }, [status]);

  const color = status === 'critical' ? '#f43f5e' : '#10b981';
  const sortedPts = [...points].sort((a, b) => a.x - b.x);

  return (
    <svg width="100%" height="50" viewBox="0 0 200 50" style={{ display: 'block' }}>
      <polyline points={sortedPts.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
};

const VitalBadge = ({ icon, label, value, unit, alarm }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 12px', background: alarm ? 'rgba(244,63,94,0.12)' : 'rgba(255,255,255,0.04)', borderRadius: 8, border: alarm ? '1px solid rgba(244,63,94,0.4)' : '1px solid transparent', minWidth: 64 }}>
    <div style={{ color: alarm ? 'var(--danger)' : 'var(--text-muted)', marginBottom: 2 }}>{icon}</div>
    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: alarm ? 'var(--danger)' : 'var(--text-main)', animation: alarm ? 'pulse 1s infinite' : 'none' }}>{value}</div>
    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{unit}</div>
  </div>
);

const BedCard = ({ bed, vitals, onClick, selected }) => {
  if (bed.status === 'empty') return (
    <div className="glass-panel" style={{ padding: 20, border: selected ? '1px solid var(--primary)' : '1px dashed rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, color: 'var(--text-muted)', minHeight: 180 }} onClick={onClick}>
      <Plus size={24} style={{ opacity: 0.3 }} />
      <span style={{ fontSize: '0.85rem' }}>Yatak {bed.id} — Boş</span>
    </div>
  );

  const alarms = { hr: vitals.hr > 130 || vitals.hr < 50, spo2: vitals.spo2 < 90, sbp: vitals.sbp < 90, temp: vitals.temp > 39 };
  const hasAlarm = Object.values(alarms).some(Boolean);

  return (
    <div className="glass-panel" onClick={onClick} style={{ padding: '14px 16px', cursor: 'pointer', border: `1px solid ${selected ? 'var(--primary)' : hasAlarm ? 'rgba(244,63,94,0.4)' : 'var(--glass-border)'}`, transition: 'all 0.2s', background: hasAlarm ? 'rgba(244,63,94,0.04)' : undefined }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            {hasAlarm && <AlertTriangle size={14} color="var(--danger)" />}
            <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>Yatak {bed.id} — {bed.patient}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{bed.dx}</div>
        </div>
        <span style={{ padding: '3px 10px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700, background: bed.status === 'critical' ? 'rgba(244,63,94,0.2)' : 'rgba(16,185,129,0.15)', color: bed.status === 'critical' ? 'var(--danger)' : 'var(--success)' }}>
          {bed.status === 'critical' ? 'KRİTİK' : 'STABIL'}
        </span>
      </div>

      {/* ECG */}
      <div style={{ background: '#000', borderRadius: 6, marginBottom: 10, overflow: 'hidden' }}>
        <ECGLine status={bed.status} />
      </div>

      {/* Vitals */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <VitalBadge icon={<Heart size={12} />} label="HR" value={vitals.hr} unit="bpm" alarm={alarms.hr} />
        <VitalBadge icon={<Droplets size={12} />} label="SpO2" value={vitals.spo2} unit="%" alarm={alarms.spo2} />
        <VitalBadge icon={<Activity size={12} />} label="KB" value={`${vitals.sbp}/${vitals.dbp}`} unit="mmHg" alarm={alarms.sbp} />
        <VitalBadge icon={<Thermometer size={12} />} label="Isı" value={vitals.temp.toFixed(1)} unit="°C" alarm={alarms.temp} />
        {bed.vent && <VitalBadge icon={<Wind size={12} />} label="EtCO2" value={vitals.etco2} unit="mmHg" alarm={false} />}
      </div>
    </div>
  );
};

export default function ICUMonitor() {
  const [beds] = useState(INITIAL_BEDS);
  const [vitals, setVitals] = useState(() => {
    const v = {};
    INITIAL_BEDS.forEach(b => { if (b.patient) v[b.id] = generateVitals(b.status); });
    return v;
  });
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('monitor');
  const [shiftNote, setShiftNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [alarmLog, setAlarmLog] = useState([]);

  // Live vitals update
  useEffect(() => {
    const iv = setInterval(() => {
      setVitals(prev => {
        const next = { ...prev };
        beds.forEach(b => {
          if (!b.patient) return;
          const v = prev[b.id] || generateVitals(b.status);
          next[b.id] = {
            hr: Math.max(40, Math.min(180, v.hr + (Math.random() - 0.5) * 4)),
            spo2: Math.max(82, Math.min(100, v.spo2 + (Math.random() - 0.5) * 1.5)),
            sbp: Math.max(60, Math.min(200, v.sbp + (Math.random() - 0.5) * 4)),
            dbp: Math.max(40, Math.min(130, v.dbp + (Math.random() - 0.5) * 3)),
            temp: Math.max(35, Math.min(41, v.temp + (Math.random() - 0.5) * 0.1)),
            etco2: Math.max(20, Math.min(60, v.etco2 + (Math.random() - 0.5) * 2)),
          };
          // Check for new alarms
          const nv = next[b.id];
          if (nv.spo2 < 90) {
            setAlarmLog(prev => {
              if (prev.length && prev[0].msg.includes(b.patient) && Date.now() - prev[0].ts < 10000) return prev;
              return [{ id: Date.now(), msg: `${b.patient} — SpO2 kritik: ${Math.round(nv.spo2)}%`, ts: Date.now() }, ...prev.slice(0, 9)];
            });
          }
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(iv);
  }, [beds]);

  const activeBeds = beds.filter(b => b.patient);
  const criticalCount = activeBeds.filter(b => b.status === 'critical').length;
  const selectedBed = selected !== null ? beds.find(b => b.id === selected) : null;

  return (
    <div className="animate-fade-in" style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Activity size={28} color="var(--danger)" /> Yoğun Bakım Ünitesi
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>Canlı vital takibi, ventilatör parametreleri ve shift yönetimi</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'Aktif Hasta', value: activeBeds.length, color: 'var(--primary)' },
            { label: 'Kritik', value: criticalCount, color: 'var(--danger)' },
            { label: 'Boş Yatak', value: beds.length - activeBeds.length, color: 'var(--success)' },
          ].map((s, i) => (
            <div key={i} className="glass-panel" style={{ padding: '10px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[{ key: 'monitor', label: 'Yatak İzleme', icon: <Activity size={15} /> },
          { key: 'ventilator', label: 'Ventilatörler', icon: <Wind size={15} /> },
          { key: 'alarms', label: `Alarm Logu (${alarmLog.length})`, icon: <AlertTriangle size={15} /> },
          { key: 'shift', label: 'Devir Teslim', icon: <Moon size={15} /> },
        ].map(t => (
          <button key={t.key} className={`glass-button ${tab === t.key ? 'primary' : ''}`} onClick={() => setTab(t.key)} style={{ gap: 6, fontSize: '0.85rem' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Monitor */}
      {tab === 'monitor' && (
        <div style={{ flex: 1, display: 'flex', gap: 20, minHeight: 0 }}>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, overflowY: 'auto', alignContent: 'start' }}>
            {beds.map(bed => (
              <BedCard key={bed.id} bed={bed} vitals={vitals[bed.id] || {}} onClick={() => setSelected(bed.id === selected ? null : bed.id)} selected={selected === bed.id} />
            ))}
          </div>

          {selectedBed && selectedBed.patient && (
            <div style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="glass-panel" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <User size={18} color="var(--primary)" />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{selectedBed.patient}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedBed.age} yaş · Yatış: {selectedBed.admitted}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 10 }}>{selectedBed.dx}</div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 12px', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  📝 {selectedBed.note}
                </div>
                <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>👩‍⚕️ Sorumlu Hemşire: {selectedBed.nurse}</div>
              </div>

              {selectedBed.vent && selectedBed.ventParams && (
                <div className="glass-panel" style={{ padding: 20 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Wind size={16} color="var(--primary)" /> Ventilatör Parametreleri
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {Object.entries(selectedBed.ventParams).map(([k, v]) => (
                      <div key={k} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>{v}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Real-time vitals detail */}
              <div className="glass-panel" style={{ padding: 20 }}>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 14 }}>Anlık Değerler</div>
                {vitals[selectedBed.id] && Object.entries({
                  'Kalp Hızı': [vitals[selectedBed.id].hr, 'bpm'],
                  'SpO2': [vitals[selectedBed.id].spo2.toFixed(0), '%'],
                  'Sistolik KB': [vitals[selectedBed.id].sbp.toFixed(0), 'mmHg'],
                  'Diyastolik KB': [vitals[selectedBed.id].dbp.toFixed(0), 'mmHg'],
                  'Vücut Isısı': [vitals[selectedBed.id].temp.toFixed(1), '°C'],
                  'EtCO2': [vitals[selectedBed.id].etco2.toFixed(0), 'mmHg'],
                }).map(([label, [val, unit]]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{val} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{unit}</span></span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ventilator tab */}
      {tab === 'ventilator' && (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, overflowY: 'auto', alignContent: 'start' }}>
          {beds.filter(b => b.vent).map(bed => (
            <div key={bed.id} className="glass-panel" style={{ padding: 20 }}>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>Yatak {bed.id} — {bed.patient}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 16 }}>{bed.dx}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {Object.entries(bed.ventParams || {}).map(([k, v]) => (
                  <div key={k} style={{ background: 'rgba(0,229,255,0.06)', borderRadius: 8, padding: '12px', textAlign: 'center', border: '1px solid rgba(0,229,255,0.1)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{v}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{k}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, padding: '8px 12px', background: 'rgba(16,185,129,0.08)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={12} /> Ventilatör aktif — Bağlantı normal
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alarm Log */}
      {tab === 'alarms' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
          {alarmLog.length === 0 ? (
            <div className="glass-panel" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
              <p>Aktif alarm yok. Tüm parametreler normal.</p>
            </div>
          ) : alarmLog.map(a => (
            <div key={a.id} className="glass-panel" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.05)' }}>
              <AlertTriangle size={18} color="var(--danger)" />
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '0.9rem' }}>{a.msg}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 2 }}>{new Date(a.ts).toLocaleTimeString('tr-TR')}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shift Handover */}
      {tab === 'shift' && (
        <div style={{ flex: 1, display: 'flex', gap: 20, minHeight: 0 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="glass-panel" style={{ padding: 20 }}>
              <h3 style={{ color: 'var(--text-main)', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ClipboardList size={16} color="var(--primary)" /> Shift Devir Teslim Notu
              </h3>
              <textarea value={shiftNote} onChange={e => setShiftNote(e.target.value)}
                placeholder="Gece/gündüz shift devir notlarını buraya girin..."
                style={{ width: '100%', height: 120, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: 12, color: 'var(--text-main)', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Outfit, sans-serif' }} />
              <button className="glass-button primary" style={{ marginTop: 10, gap: 8 }} onClick={() => { if (!shiftNote.trim()) return; setNotes(p => [{ id: Date.now(), text: shiftNote, time: new Date().toLocaleTimeString('tr-TR') }, ...p]); setShiftNote(''); }}>
                <CheckCircle size={14} /> Notu Kaydet
              </button>
            </div>
            {notes.map(n => (
              <div key={n.id} className="glass-panel" style={{ padding: '14px 18px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>🕐 {n.time}</div>
                <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6 }}>{n.text}</p>
              </div>
            ))}
          </div>
          <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="glass-panel" style={{ padding: 20 }}>
              <h4 style={{ color: 'var(--text-main)', fontWeight: 700, marginBottom: 14 }}>Hasta Özeti</h4>
              {activeBeds.map(b => (
                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>Yatak {b.id} — {b.patient}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{b.nurse}</div>
                  </div>
                  <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, background: b.status === 'critical' ? 'rgba(244,63,94,0.2)' : 'rgba(16,185,129,0.15)', color: b.status === 'critical' ? 'var(--danger)' : 'var(--success)' }}>
                    {b.status === 'critical' ? 'KRİTİK' : 'STABİL'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
