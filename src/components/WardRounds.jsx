import React, { useState } from 'react';
import { Stethoscope, User, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Plus, Edit3, Save, ClipboardList } from 'lucide-react';

const DOCTORS = [
  { id: 1, name: 'Dr. Ahmet Kaya', title: 'Dahiliye Uzmanı', avatar: 'AK', color: '#00e5ff' },
  { id: 2, name: 'Dr. Fatma Özdemir', title: 'Kardiyoloji Uzmanı', avatar: 'FÖ', color: '#a855f7' },
  { id: 3, name: 'Dr. Mehmet Arslan', title: 'Nöroloji Uzmanı', avatar: 'MA', color: '#f59e0b' },
];

const INITIAL_ROUNDS = [
  {
    id: 1, ward: 'Dahiliye', date: '2026-07-06', doctor: 'Dr. Ahmet Kaya', doctorColor: '#00e5ff',
    status: 'completed', startTime: '08:30', endTime: '10:15',
    patients: [
      { id: 'p1', name: 'Halil Şen', room: '102A', bed: 1, diagnosis: 'Diyabet Tip 2', vitals: { bp: '128/82', hr: 76, temp: 36.8, spo2: 98 }, notes: 'Kan şekeri regülasyonu iyi. Metformin dozu devam.', status: 'stable', tasks: ['Sabah açlık şekeri kontrol', 'Diyetisyen konsültasyonu'], done: true },
      { id: 'p2', name: 'Zeynep Avcı', room: '104B', bed: 2, diagnosis: 'KOAH', vitals: { bp: '135/88', hr: 88, temp: 37.2, spo2: 94 }, notes: 'SpO2 düşük izleniyor. Nebulizasyon tedavisi başlandı.', status: 'warning', tasks: ['Nebulizasyon 3x1', 'Solunum fizyoterapisi'], done: true },
      { id: 'p3', name: 'Ali Rıza Kurt', room: '106A', bed: 1, diagnosis: 'Hipertansiyon', vitals: { bp: '162/98', hr: 92, temp: 36.5, spo2: 99 }, notes: 'Tansiyon yüksek. Antihipertansif ilaç ayarlaması yapıldı.', status: 'danger', tasks: ['Saatlik TA takibi', 'Nefroloji konsültasyonu'], done: false },
    ]
  },
  {
    id: 2, ward: 'Kardiyoloji', date: '2026-07-06', doctor: 'Dr. Fatma Özdemir', doctorColor: '#a855f7',
    status: 'inProgress', startTime: '09:00', endTime: null,
    patients: [
      { id: 'p4', name: 'Mustafa Demir', room: '201A', bed: 1, diagnosis: 'Akut Miyokard Enfarktüsü', vitals: { bp: '110/70', hr: 68, temp: 36.7, spo2: 97 }, notes: 'Post-PTCA 2. gün. Antikoagülan tedavi devam.', status: 'warning', tasks: ['EKG çek', 'Kardiyak enzim tekrarla'], done: false },
      { id: 'p5', name: 'Bahar Kılıç', room: '203B', bed: 2, diagnosis: 'Kalp Yetmezliği', vitals: { bp: '118/76', hr: 82, temp: 36.9, spo2: 96 }, notes: 'Diüretik cevabı iyi. Kilo günlük takip edilecek.', status: 'stable', tasks: ['Günlük tartı', 'Sıvı kısıtlaması 1500ml'], done: false },
    ]
  },
  {
    id: 3, ward: 'Nöroloji', date: '2026-07-06', doctor: 'Dr. Mehmet Arslan', doctorColor: '#f59e0b',
    status: 'pending', startTime: '11:00', endTime: null,
    patients: [
      { id: 'p6', name: 'Hüseyin Polat', room: '301A', bed: 1, diagnosis: 'İskemik İnme', vitals: { bp: '148/90', hr: 74, temp: 37.0, spo2: 98 }, notes: 'Sağ hemiparezi devam. Fizyoterapi 2. gün.', status: 'warning', tasks: ['Nörolojik muayene', 'FTR konsültasyonu'], done: false },
    ]
  },
];

const STATUS_CFG = {
  stable:  { label: 'Stabil',   color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: '🟢' },
  warning: { label: 'Dikkat',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: '🟡' },
  danger:  { label: 'Kritik',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   icon: '🔴' },
};

const ROUND_STATUS = {
  completed:  { label: 'Tamamlandı', color: '#10b981' },
  inProgress: { label: 'Devam Ediyor', color: '#00e5ff' },
  pending:    { label: 'Bekliyor', color: '#94a3b8' },
};

export default function WardRounds({ addNotification }) {
  const [rounds, setRounds] = useState(INITIAL_ROUNDS);
  const [expandedRound, setExpandedRound] = useState(1);
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [tab, setTab] = useState('today');

  const totalPatients = rounds.reduce((s, r) => s + r.patients.length, 0);
  const completedPatients = rounds.reduce((s, r) => s + r.patients.filter(p => p.done).length, 0);
  const criticalCount = rounds.reduce((s, r) => s + r.patients.filter(p => p.status === 'danger').length, 0);

  const toggleTaskDone = (roundId, patientId) => {
    setRounds(prev => prev.map(r => {
      if (r.id !== roundId) return r;
      return { ...r, patients: r.patients.map(p => p.id === patientId ? { ...p, done: !p.done } : p) };
    }));
    addNotification?.('success', 'Vizit durumu güncellendi.');
  };

  const saveNote = (roundId, patientId) => {
    setRounds(prev => prev.map(r => {
      if (r.id !== roundId) return r;
      return { ...r, patients: r.patients.map(p => p.id === patientId ? { ...p, notes: noteText } : p) };
    }));
    setEditingNote(null);
    addNotification?.('success', 'Vizit notu kaydedildi.');
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 0 60px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Stethoscope size={30} color="var(--primary)"/> Vizit Yönetimi
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
            Günlük doktor vizitleri · Hasta değerlendirme · Klinik notlar
          </p>
        </div>
        <button className="glass-button primary" onClick={() => addNotification?.('info', 'Yeni vizit turu oluşturuldu.')} style={{ gap: 8 }}>
          <Plus size={16}/> Yeni Tur Oluştur
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Toplam Tur', value: rounds.length, color: 'var(--primary)', icon: <ClipboardList size={20}/> },
          { label: 'Toplam Hasta', value: totalPatients, color: '#a855f7', icon: <User size={20}/> },
          { label: 'Vizit Tamamlanan', value: completedPatients, color: '#10b981', icon: <CheckCircle size={20}/> },
          { label: 'Kritik Hasta', value: criticalCount, color: '#ef4444', icon: <AlertCircle size={20}/> },
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
        {[{ k: 'today', l: '📋 Bugünkü Vizitler' }, { k: 'doctors', l: '👨‍⚕️ Doktor Dağılımı' }].map(t => (
          <button key={t.k} className={`glass-button ${tab === t.k ? 'primary' : ''}`} onClick={() => setTab(t.k)} style={{ fontSize: '0.85rem' }}>{t.l}</button>
        ))}
      </div>

      {tab === 'today' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {rounds.map(round => {
            const rsConfig = ROUND_STATUS[round.status];
            const isExpanded = expandedRound === round.id;
            return (
              <div key={round.id} className="glass-panel" style={{ overflow: 'hidden', border: round.status === 'inProgress' ? '1px solid rgba(0,229,255,0.3)' : '1px solid var(--glass-border)' }}>
                {/* Round Header */}
                <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: round.status === 'inProgress' ? 'rgba(0,229,255,0.04)' : 'transparent' }}
                  onClick={() => setExpandedRound(isExpanded ? null : round.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${round.doctorColor}22`, border: `2px solid ${round.doctorColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: round.doctorColor }}>
                      {round.doctor.split(' ').slice(-1)[0][0]}{round.doctor.split(' ').slice(-2,-1)[0]?.[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1rem' }}>{round.ward} Viziti</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{round.doctor} · <Clock size={11} style={{ display: 'inline' }}/> {round.startTime}{round.endTime ? ` – ${round.endTime}` : ' (devam ediyor)'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: rsConfig.color, padding: '4px 12px', borderRadius: 20, background: `${rsConfig.color}18` }}>{rsConfig.label}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{round.patients.length} Hasta</span>
                    {isExpanded ? <ChevronUp size={18} color="var(--text-muted)"/> : <ChevronDown size={18} color="var(--text-muted)"/>}
                  </div>
                </div>

                {/* Patient List */}
                {isExpanded && (
                  <div style={{ padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {round.patients.map(patient => {
                      const sc = STATUS_CFG[patient.status];
                      const isPatExpanded = expandedPatient === patient.id;
                      const isEditing = editingNote === patient.id;
                      return (
                        <div key={patient.id} style={{ borderRadius: 12, border: `1px solid ${sc.color}33`, background: `${sc.color}08`, overflow: 'hidden' }}>
                          <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                            onClick={() => setExpandedPatient(isPatExpanded ? null : patient.id)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ fontSize: '1rem' }}>{sc.icon}</span>
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem' }}>{patient.name}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Oda {patient.room} · {patient.diagnosis}</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ display: 'flex', gap: 12, fontSize: '0.75rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>TA: <strong style={{ color: 'var(--text-main)' }}>{patient.vitals.bp}</strong></span>
                                <span style={{ color: 'var(--text-muted)' }}>SpO₂: <strong style={{ color: patient.vitals.spo2 < 95 ? '#ef4444' : '#10b981' }}>{patient.vitals.spo2}%</strong></span>
                                <span style={{ color: 'var(--text-muted)' }}>KA: <strong style={{ color: 'var(--text-main)' }}>{patient.vitals.hr}</strong></span>
                              </div>
                              {isPatExpanded ? <ChevronUp size={16} color="var(--text-muted)"/> : <ChevronDown size={16} color="var(--text-muted)"/>}
                            </div>
                          </div>
                          {isPatExpanded && (
                            <div style={{ padding: '0 16px 14px 16px', borderTop: `1px solid ${sc.color}22` }}>
                              {/* Note */}
                              <div style={{ margin: '12px 0', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>VİZİT NOTU</div>
                                  {!isEditing ? (
                                    <button onClick={() => { setEditingNote(patient.id); setNoteText(patient.notes); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem' }}>
                                      <Edit3 size={12}/> Düzenle
                                    </button>
                                  ) : (
                                    <button onClick={() => saveNote(round.id, patient.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#10b981', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem' }}>
                                      <Save size={12}/> Kaydet
                                    </button>
                                  )}
                                </div>
                                {isEditing ? (
                                  <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3}
                                    style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: 6, padding: '8px', color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem', resize: 'vertical', outline: 'none' }}/>
                                ) : (
                                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6 }}>{patient.notes}</p>
                                )}
                              </div>
                              {/* Tasks */}
                              <div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6 }}>GÖREVLER</div>
                                {patient.tasks.map((task, ti) => (
                                  <div key={ti} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: '0.82rem', color: 'var(--text-main)' }}>
                                    <CheckCircle size={14} color={patient.done ? '#10b981' : 'var(--text-muted)'}/>
                                    <span style={{ textDecoration: patient.done ? 'line-through' : 'none', opacity: patient.done ? 0.5 : 1 }}>{task}</span>
                                  </div>
                                ))}
                                <button className="glass-button" onClick={() => toggleTaskDone(round.id, patient.id)}
                                  style={{ marginTop: 10, fontSize: '0.78rem', padding: '6px 14px', color: patient.done ? '#ef4444' : '#10b981', borderColor: patient.done ? '#ef4444' : '#10b981', gap: 6 }}>
                                  {patient.done ? <><AlertCircle size={13}/> Viziti Geri Al</> : <><CheckCircle size={13}/> Viziti Tamamla</>}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'doctors' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {DOCTORS.map(doc => {
            const docRounds = rounds.filter(r => r.doctor === doc.name);
            const docPatients = docRounds.reduce((s, r) => s + r.patients.length, 0);
            const completed = docRounds.reduce((s, r) => s + r.patients.filter(p => p.done).length, 0);
            return (
              <div key={doc.id} className="glass-panel" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${doc.color}22`, border: `2px solid ${doc.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: doc.color }}>{doc.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{doc.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.title}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[{ l: 'Tur Sayısı', v: docRounds.length, c: doc.color }, { l: 'Toplam Hasta', v: docPatients, c: doc.color }, { l: 'Tamamlanan', v: completed, c: '#10b981' }, { l: 'Bekleyen', v: docPatients - completed, c: '#f59e0b' }].map((stat, i) => (
                    <div key={i} style={{ padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stat.c }}>{stat.v}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{stat.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
