import React, { useState } from 'react';
import { Pill, Plus, Edit2, Trash2, Clock, AlertTriangle, CheckCircle, X, Search, Printer } from 'lucide-react';

const FREQUENCIES = ['Günde 1', 'Günde 2', 'Günde 3', 'Sabah-Akşam', 'Haftada 1', 'Gerektiğinde'];
const CATEGORIES  = ['Kardiyovasküler', 'Antidiyabetik', 'Diüretik', 'Bronkodilatatör', 'Antihipertansif', 'Ağrı Kesici', 'Diğer'];
const TIMES       = ['07:00', '08:00', '12:00', '13:00', '18:00', '20:00', '22:00'];

// Genişletilmiş etkileşim kuralları (20+ kural)
const INTERACTIONS = [
  { drugs: ['Warfarin', 'Aspirin'],        severity: 'high',   msg: 'Ciddi kanama riski: Warfarin + Aspirin birlikte kullanımından kaçının.' },
  { drugs: ['Warfarin', 'NSAID'],          severity: 'high',   msg: 'NSAID grubu ilaçlar Warfarin etkisini artırarak ölümcül kanama riskine yol açabilir.' },
  { drugs: ['Warfarin', 'Antibiyotik'],    severity: 'medium', msg: 'Geniş spektrumlu antibiyotikler Warfarin INR değerini etkileyebilir.' },
  { drugs: ['Metformin', 'Furosemid'],     severity: 'medium', msg: 'Furosemid, Metformin renal atılımını azaltarak laktik asidoz riskini artırabilir.' },
  { drugs: ['Metformin', 'Alkol'],         severity: 'high',   msg: 'Alkol + Metformin kombinasyonu laktik asidoz riskini önemli ölçüde artırır.' },
  { drugs: ['Amlodipine', 'Digoksin'],     severity: 'low',    msg: 'Amlodipine, Digoksin plazma düzeyini hafifçe artırabilir; doz ayarı gerekebilir.' },
  { drugs: ['Amlodipine', 'Siklosporin'], severity: 'medium', msg: 'Siklosporin + Amlodipine kombinasyonu siklosporin konsantrasyonunu artırabilir.' },
  { drugs: ['Lisinopril', 'Potasyum'],     severity: 'high',   msg: 'ACE İnhibitörü + Potasyum takviyesi ciddi hiperkalemi riskine yol açar.' },
  { drugs: ['Lisinopril', 'NSAID'],        severity: 'medium', msg: 'NSAID ACE İnhibitörünün antihipertansif etkisini azaltabilir.' },
  { drugs: ['Atorvastatin', 'Eritromisin'],severity: 'high',   msg: 'Eritromisin, Atorvastatin metabolizmasını inhibe ederek miyopati riskini artırır.' },
  { drugs: ['Atorvastatin', 'Siklosporin'],severity:'high',   msg: 'Statin + Siklosporin kombinasyonu ciddi kas hasarına yol açabilir.' },
  { drugs: ['Omeprazol', 'Klopidogrel'],   severity: 'medium', msg: 'Omeprazol, Klopidogrelin antiplatelet aktivasyonunu azaltabilir.' },
  { drugs: ['Furosemid', 'Digoksin'],      severity: 'high',   msg: 'Furosemid kaynaklı hipokalemi Digoksin toksisitesini önemli ölçüde artırır.' },
  { drugs: ['Furosemid', 'NSAID'],         severity: 'medium', msg: 'NSAID Furosemid diüretik etkisini azaltabilir ve böbrek yetmezliğine zemin hazırlayabilir.' },
  { drugs: ['Aspirin', 'NSAID'],           severity: 'medium', msg: 'NSAID Aspirin antiplatelet etkisini antagonize edebilir; GIS kanama riski artar.' },
  { drugs: ['Lisinopril', 'Spironolakton'],severity: 'high',  msg: 'ACE İnhibitörü + Spironolakton kombinasyonu ciddi hiperkalemi riskine yol açabilir.' },
  { drugs: ['Metoprolol', 'Verapamil'],    severity: 'high',   msg: 'Beta-bloker + Verapamil kombinasyonu ciddi bradikardi ve kalp bloğuna neden olabilir.' },
  { drugs: ['Tramadol', 'SSRI'],           severity: 'high',   msg: 'Tramadol + SSRI kombinasyonu serotonin sendromu riskini artırır.' },
  { drugs: ['Klaritromisin', 'Statin'],    severity: 'high',   msg: 'Makrolid antibiyotikler statin metabolizmasını inhibe ederek miyopati riskini artırır.' },
  { drugs: ['Sildenafil', 'Nitrat'],       severity: 'high',   msg: 'PDE5 inhibitörü + Nitrat: Ölümcül hipotansiyon riski! Bu kombinasyon kontrendikedir.' },
];

const checkInteractions = (meds) => {
  const names = meds.map(m => m.name);
  return INTERACTIONS.filter(rule =>
    rule.drugs.every(d => names.some(n => n.toLowerCase().includes(d.toLowerCase())))
  );
};

const emptyMed = {
  patientId: '', name: '', dosage: '', frequency: 'Günde 1',
  category: 'Kardiyovasküler', times: ['08:00'], startDate: '',
  endDate: '', prescriber: 'Dr. Ahmet Öztürk', note: '',
};

const MedicationManager = ({ patients, addNotification }) => {
  const [meds, setMeds] = useState([
    { id: 1, patientId: 1, name: 'Amlodipine', dosage: '5mg', frequency: 'Günde 1', category: 'Antihipertansif', times: ['08:00'], startDate: '2026-06-01', endDate: '', prescriber: 'Dr. Ahmet Öztürk', note: 'Sabah aç karnına alınacak.', taken: {} },
    { id: 2, patientId: 1, name: 'Aspirin',    dosage: '100mg', frequency: 'Günde 1', category: 'Kardiyovasküler', times: ['08:00'], startDate: '2026-06-01', endDate: '', prescriber: 'Dr. Ahmet Öztürk', note: '', taken: {} },
    { id: 3, patientId: 2, name: 'Metformin',  dosage: '500mg', frequency: 'Günde 2', category: 'Antidiyabetik', times: ['08:00', '20:00'], startDate: '2026-05-15', endDate: '', prescriber: 'Dr. Ahmet Öztürk', note: 'Yemekle birlikte.', taken: {} },
    { id: 4, patientId: 3, name: 'Furosemid',  dosage: '40mg', frequency: 'Günde 1', category: 'Diüretik', times: ['07:00'], startDate: '2026-06-10', endDate: '', prescriber: 'Dr. Ahmet Öztürk', note: '', taken: {} },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(emptyMed);
  const [selectedPatient, setSelectedPatient] = useState('all');
  const [search, setSearch]     = useState('');
  const [showPrint, setShowPrint] = useState(false);
  const [printPatient, setPrintPatient] = useState(null);
  const [liveInteractions, setLiveInteractions] = useState([]);
  const [showInteractionConfirm, setShowInteractionConfirm] = useState(false);

  // Canlı etkileşim kontrolü: form değişikliğinde tetiklenir
  const checkLive = (fieldName, value, currentForm) => {
    const pid  = fieldName === 'patientId' ? parseInt(value) : parseInt(currentForm.patientId);
    const name = fieldName === 'name'      ? value           : currentForm.name;
    if (pid && name && name.length >= 3) {
      const existingMeds = meds.filter(m => m.patientId === pid && m.id !== (editId || -1));
      const hypothetical = [...existingMeds, { name }];
      setLiveInteractions(checkInteractions(hypothetical));
    } else {
      setLiveInteractions([]);
    }
    setShowInteractionConfirm(false);
  };

  const update = (f, v) => {
    const next = { ...form, [f]: v };
    setForm(next);
    if (f === 'name' || f === 'patientId') checkLive(f, v, form);
  };

  const toggleTime = (t) => {
    update('times', form.times.includes(t)
      ? form.times.filter(x => x !== t)
      : [...form.times, t].sort());
  };

  const openAdd = () => {
    setForm(emptyMed);
    setEditId(null);
    setLiveInteractions([]);
    setShowInteractionConfirm(false);
    setShowForm(true);
  };

  const openEdit = (med) => {
    setForm({ ...med });
    setEditId(med.id);
    setLiveInteractions([]);
    setShowInteractionConfirm(false);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.dosage || !form.patientId) {
      addNotification('danger', 'Lütfen hasta, ilaç adı ve doz alanlarını doldurun.');
      return;
    }
    // Yüksek ciddiyet etkileşimi varsa onay iste
    const highRisk = liveInteractions.filter(i => i.severity === 'high');
    if (highRisk.length > 0 && !showInteractionConfirm) {
      setShowInteractionConfirm(true);
      return;
    }
    setShowInteractionConfirm(false);
    if (editId) {
      setMeds(prev => prev.map(m => m.id === editId ? { ...form, id: editId, taken: m.taken } : m));
      addNotification('success', `${form.name} güncellendi.`);
    } else {
      const newMed = { ...form, id: Date.now(), patientId: parseInt(form.patientId), taken: {} };
      setMeds(prev => [...prev, newMed]);
      addNotification('success', `${form.name} ilaç listesine eklendi.`);
    }
    setShowForm(false);
    setEditId(null);
    setLiveInteractions([]);
  };

  const deleteMed = (id) => {
    const med = meds.find(m => m.id === id);
    setMeds(prev => prev.filter(m => m.id !== id));
    addNotification('info', `${med?.name} silindi.`);
  };

  const toggleTaken = (medId, dateKey) => {
    setMeds(prev => prev.map(m =>
      m.id === medId ? { ...m, taken: { ...m.taken, [dateKey]: !m.taken[dateKey] } } : m
    ));
  };

  // Filtrele
  const filtered = meds.filter(m => {
    const matchP = selectedPatient === 'all' || m.patientId === parseInt(selectedPatient);
    const matchS = m.name.toLowerCase().includes(search.toLowerCase()) ||
      (patients.find(p => p.id === m.patientId)?.name || '').toLowerCase().includes(search.toLowerCase());
    return matchP && matchS;
  });

  // Etkileşim kontrolü
  const patientMedMap = {};
  meds.forEach(m => {
    if (!patientMedMap[m.patientId]) patientMedMap[m.patientId] = [];
    patientMedMap[m.patientId].push(m);
  });
  const allInteractions = Object.entries(patientMedMap).flatMap(([pid, pmeds]) =>
    checkInteractions(pmeds).map(i => ({ ...i, patientId: parseInt(pid) }))
  );

  // Haftalık takvim (son 7 gün)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const getPatientName = (id) => patients.find(p => p.id === id)?.name || `Hasta #${id}`;

  const sev = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--primary)' };
  const sevLabel = { high: '🔴 Ciddi', medium: '🟡 Orta', low: '🔵 Düşük' };

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--glass-border)', borderRadius: '10px',
    color: 'var(--text-main)', fontSize: '0.9rem', fontFamily: 'Outfit, sans-serif', outline: 'none',
  };
  const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Pill size={32} color="var(--primary)" /> İlaç & Doz Yönetimi
          </h1>
          <p className="text-muted">Hasta ilaçları, doz saatleri ve uyum takibi.</p>
        </div>
        <button className="glass-button primary" onClick={openAdd} style={{ padding: '12px 24px' }}>
          <Plus size={18} /> İlaç Ekle
        </button>
      </div>

      {/* Etkileşim Uyarıları */}
      {allInteractions.length > 0 && (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.04)' }}>
          <h3 style={{ color: 'var(--danger)', marginBottom: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <AlertTriangle size={20} /> İlaç Etkileşim Uyarıları
          </h3>
          {allInteractions.map((ix, i) => (
            <div key={i} style={{ padding: '12px 16px', borderRadius: '8px', background: `${sev[ix.severity]}15`, border: `1px solid ${sev[ix.severity]}44`, marginBottom: '8px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: sev[ix.severity], fontSize: '0.82rem', fontWeight: 700, flexShrink: 0 }}>{sevLabel[ix.severity]}</span>
              <div>
                <div style={{ color: 'var(--text-main)', fontSize: '0.88rem', fontWeight: 600 }}>{getPatientName(ix.patientId)}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>{ix.msg}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filtreler */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input style={{ ...inputStyle, paddingLeft: '36px' }} value={search}
            onChange={e => setSearch(e.target.value)} placeholder="İlaç veya hasta ara..." />
        </div>
        <select style={{ ...inputStyle, width: '200px' }} value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
          <option value="all">Tüm Hastalar</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* İlaç Listesi */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '36px' }}>
        {filtered.length === 0 ? (
          <div className="glass-panel" style={{ gridColumn: '1/-1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Kayıtlı ilaç bulunamadı.
          </div>
        ) : filtered.map(med => {
          const patient = patients.find(p => p.id === med.patientId);
          const todayKey = new Date().toISOString().split('T')[0];
          const isTakenToday = med.taken[todayKey];
          return (
            <div key={med.id} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Pill size={18} color="var(--primary)" />
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{med.name}</h3>
                    <span style={{ padding: '2px 8px', borderRadius: '10px', background: 'rgba(0,229,255,0.1)', color: 'var(--primary)', fontSize: '0.75rem' }}>{med.dosage}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    👤 {patient?.name || '—'} · {med.category}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="glass-button" onClick={() => { setPrintPatient(patient); setShowPrint(true); }} style={{ padding: '6px 8px' }} title="Yazdır">
                    <Printer size={14} />
                  </button>
                  <button className="glass-button" onClick={() => openEdit(med)} style={{ padding: '6px 8px' }}>
                    <Edit2 size={14} />
                  </button>
                  <button className="glass-button danger" onClick={() => deleteMed(med.id)} style={{ padding: '6px 8px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <Clock size={12} style={{ marginRight: '4px' }} />
                  {med.frequency} · {med.times.join(', ')}
                </div>
                {med.startDate && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>📅 {med.startDate}</div>
                )}
              </div>

              {med.note && (
                <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px', fontStyle: 'italic' }}>
                  💬 {med.note}
                </div>
              )}

              {/* Bugün alındı mı? */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bugün alındı mı?</span>
                <button onClick={() => toggleTaken(med.id, todayKey)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px',
                    borderRadius: '20px', border: `1px solid ${isTakenToday ? 'var(--success)' : 'var(--glass-border)'}`,
                    background: isTakenToday ? 'rgba(16,185,129,0.15)' : 'transparent',
                    color: isTakenToday ? 'var(--success)' : 'var(--text-muted)',
                    cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'Outfit', transition: 'all 0.2s',
                  }}>
                  <CheckCircle size={14} /> {isTakenToday ? 'Alındı' : 'Alınmadı'}
                </button>
              </div>

              {/* 7 günlük uyum takvimi */}
              <div style={{ marginTop: '14px', borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Son 7 gün uyum</div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {last7.map(date => {
                    const taken = med.taken[date];
                    return (
                      <div key={date} title={date} onClick={() => toggleTaken(med.id, date)}
                        style={{
                          width: '28px', height: '28px', borderRadius: '6px',
                          background: taken ? 'var(--success)' : 'rgba(255,255,255,0.06)',
                          border: `1px solid ${taken ? 'var(--success)' : 'var(--glass-border)'}`,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.7rem', color: taken ? '#fff' : 'var(--text-muted)', transition: 'all 0.2s',
                        }}>
                        {new Date(date).getDate()}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* İlaç Formu Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setShowForm(false)}>
          <div className="glass-panel animate-slide-in" style={{ width: '600px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ color: 'var(--primary)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Pill size={20} /> {editId ? 'İlaç Düzenle' : 'Yeni İlaç Ekle'}
              </h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Hasta *</label>
                <select style={inputStyle} value={form.patientId} onChange={e => update('patientId', e.target.value)}>
                  <option value="">Hasta seçin...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>İlaç Adı *</label>
                <input
                  style={{
                    ...inputStyle,
                    borderColor: liveInteractions.length > 0
                      ? (liveInteractions.some(i => i.severity === 'high') ? '#ef4444'
                        : liveInteractions.some(i => i.severity === 'medium') ? '#f59e0b'
                        : 'var(--primary)')
                      : 'var(--glass-border)',
                    boxShadow: liveInteractions.some(i => i.severity === 'high') ? '0 0 0 2px rgba(239,68,68,0.2)' : 'none',
                  }}
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="Örn: Metformin — etkileşim otomatik kontrol edilir"
                />
                {liveInteractions.length > 0 && (
                  <div style={{ marginTop: '4px', fontSize: '0.74rem', color: liveInteractions.some(i => i.severity === 'high') ? 'var(--danger)' : 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={11} />
                    {liveInteractions.length} etkileşim tespit edildi — aşağıyı inceleyin
                  </div>
                )}
              </div>
              <div>
                <label style={labelStyle}>Doz *</label>
                <input style={inputStyle} value={form.dosage} onChange={e => update('dosage', e.target.value)} placeholder="Örn: 500mg" />
              </div>
              <div>
                <label style={labelStyle}>Kategori</label>
                <select style={inputStyle} value={form.category} onChange={e => update('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Kullanım Sıklığı</label>
                <select style={inputStyle} value={form.frequency} onChange={e => update('frequency', e.target.value)}>
                  {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Başlangıç Tarihi</label>
                <input style={inputStyle} type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Bitiş Tarihi (opsiyonel)</label>
                <input style={inputStyle} type="date" value={form.endDate} onChange={e => update('endDate', e.target.value)} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Doz Saatleri</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                  {TIMES.map(t => (
                    <button key={t} onClick={() => toggleTime(t)}
                      style={{
                        padding: '6px 14px', borderRadius: '20px', border: '1px solid',
                        borderColor: form.times.includes(t) ? 'var(--primary)' : 'var(--glass-border)',
                        background: form.times.includes(t) ? 'rgba(0,229,255,0.15)' : 'transparent',
                        color: form.times.includes(t) ? 'var(--primary)' : 'var(--text-muted)',
                        cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Outfit', transition: 'all 0.2s',
                      }}>
                      <Clock size={12} style={{ marginRight: '4px' }} />{t}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Notlar</label>
                <textarea style={{ ...inputStyle, height: '70px', resize: 'vertical' }}
                  value={form.note} onChange={e => update('note', e.target.value)}
                  placeholder="Aç karnına, yemekle birlikte vs..." />
              </div>
            </div>

            {/* ── Canlı Etkileşim Uyarı Paneli ── */}
            {liveInteractions.length > 0 && (
              <div style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--danger)', fontWeight: 700, fontSize: '0.88rem' }}>
                  <AlertTriangle size={16} /> 🤖 Yapay Zeka İlaç Etkileşim Taraması
                </div>
                {liveInteractions.map((ix, i) => {
                  const color = ix.severity === 'high' ? 'var(--danger)' : ix.severity === 'medium' ? 'var(--warning)' : 'var(--primary)';
                  const label = ix.severity === 'high' ? '🔴 Ciddi' : ix.severity === 'medium' ? '🟡 Orta' : '🔵 Düşük';
                  return (
                    <div key={i} style={{ padding: '10px 14px', borderRadius: '8px', background: `${color}10`, border: `1px solid ${color}33`, marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color }}>{label}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ix.drugs.join(' + ')}</span>
                      </div>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>{ix.msg}</p>
                    </div>
                  );
                })}
                {showInteractionConfirm && (
                  <div style={{ marginTop: '12px', padding: '14px', borderRadius: '10px', background: 'rgba(239,68,68,0.12)', border: '1px solid var(--danger)' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '12px', lineHeight: 1.6 }}>
                      ⚠️ <strong>Ciddi etkileşim riski tespit edildi.</strong><br/>
                      Bu ilacı yine de kaydetmek istediğinizden emin misiniz?
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        style={{ flex: 1, padding: '9px', borderRadius: '8px', border: '1px solid var(--danger)', background: 'rgba(239,68,68,0.2)', color: 'var(--danger)', cursor: 'pointer', fontFamily: 'Outfit', fontSize: '0.82rem', fontWeight: 700 }}
                        onClick={handleSave}>
                        Riski Anlıyorum, Yine de Kaydet
                      </button>
                      <button
                        style={{ flex: 1, padding: '9px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'Outfit', fontSize: '0.82rem' }}
                        onClick={() => setShowInteractionConfirm(false)}>
                        İptal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button className="glass-button" onClick={() => setShowForm(false)}>İptal</button>
              <button className="glass-button primary" onClick={handleSave}>
                <CheckCircle size={16} /> {editId ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reçete Önizleme Modal */}
      {showPrint && printPatient && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setShowPrint(false)}>
          <div className="glass-panel animate-slide-in" style={{ width: '520px', maxWidth: '95vw', padding: '36px' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '2px solid var(--glass-border)', paddingBottom: '20px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '1px' }}>🏥 MediTrack Hastanesi</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Dahiliye Kliniği</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hasta</div><strong>{printPatient.name}</strong></div>
              <div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tarih</div><strong>{new Date().toLocaleDateString('tr-TR')}</strong></div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '12px' }}>💊 Reçeteli İlaçlar</h4>
              {meds.filter(m => m.patientId === printPatient.id).map((m, i) => (
                <div key={m.id} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{i + 1}. {m.name} {m.dosage}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '3px' }}>{m.frequency} · {m.times.join(', ')}</div>
                  {m.note && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '3px' }}>Not: {m.note}</div>}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'right', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dr. Ahmet Öztürk</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dahiliye Uzmanı</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button className="glass-button" onClick={() => setShowPrint(false)}><X size={16} /> Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationManager;
