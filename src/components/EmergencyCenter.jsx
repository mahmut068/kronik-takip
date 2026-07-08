import React, { useState, useEffect } from 'react';
import { AlertTriangle, Siren, Clock, CheckCircle, Phone, Activity, ChevronRight, X, Zap } from 'lucide-react';

// Triyaj renk sistemi (Manchester Triage System)
const TRIAGE_LEVELS = [
  { code: 1, label: 'Resüsitasyon', color: '#dc2626', bg: 'rgba(220,38,38,0.12)', time: 'Anında', description: 'Hayati tehlike — anında müdahale' },
  { code: 2, label: 'Acil',         color: '#ea580c', bg: 'rgba(234,88,12,0.12)',  time: '≤15 dk',   description: 'Ciddi durum — kısa sürede görülmeli' },
  { code: 3, label: 'Acil Değil',   color: '#ca8a04', bg: 'rgba(202,138,4,0.12)',  time: '≤60 dk',   description: 'Stabil — sıra bekleyebilir' },
  { code: 4, label: 'Az Acil',      color: '#16a34a', bg: 'rgba(22,163,74,0.12)',  time: '≤120 dk',  description: 'Hafif — düşük öncelik' },
  { code: 5, label: 'Normal',       color: '#0891b2', bg: 'rgba(8,145,178,0.12)',  time: '≤240 dk',  description: 'Poliklinik — acil değil' },
];

const CHIEF_COMPLAINTS = [
  'Göğüs Ağrısı', 'Nefes Darlığı', 'Bilinç Kaybı', 'İnme Belirtileri',
  'Yüksek Ateş', 'Şiddetli Baş Ağrısı', 'Karın Ağrısı', 'Travma',
  'Alerji / Anafilaksi', 'Kanamalı Yara', 'Çarpıntı', 'Bayılma',
];

const DISCRIMINATORS = {
  'Göğüs Ağrısı':      { base: 2, factors: ['EKG değişikliği', 'Soğuk terleme', 'Sol kola yayılım', 'Nefes darlığı eşliği'] },
  'Nefes Darlığı':     { base: 2, factors: ['SpO2 <90%', 'Konuşamıyor', 'Aksesuar kas kullanımı', 'Siyanoz'] },
  'Bilinç Kaybı':      { base: 1, factors: ['GKS <13', 'Fokal nörolojik belirti', 'Nöbet geçmişi', 'Travma'] },
  'İnme Belirtileri':  { base: 1, factors: ['Yüz asimetrisi', 'Kol güçsüzlüğü', 'Konuşma bozukluğu', 'Ani başlangıç'] },
  'Yüksek Ateş':       { base: 3, factors: ['>39.5°C', 'Peteşi/purpura', 'Boyun sertliği', 'Bilinç değişikliği'] },
  'Karın Ağrısı':      { base: 3, factors: ['Rijidite', 'Rebound hassasiyet', 'Kanlı dışkı', 'Şiddetli ağrı'] },
};

const initialCases = [
  { id: 1, name: 'Fatma Arslan', age: 67, complaint: 'Göğüs Ağrısı', triage: 1, arrivalTime: new Date(Date.now() - 8 * 60000).toLocaleTimeString(), status: 'inProgress', assignedTo: 'Dr. Kaya', bp: '180/110', spo2: '94', hr: '108', assigned: true, discriminators: ['Sol kola yayılım', 'Soğuk terleme'] },
  { id: 2, name: 'Ahmet Demir',  age: 45, complaint: 'Nefes Darlığı', triage: 2, arrivalTime: new Date(Date.now() - 22 * 60000).toLocaleTimeString(), status: 'waiting', assignedTo: '', bp: '130/85', spo2: '91', hr: '96', assigned: false, discriminators: ['SpO2 <90%'] },
  { id: 3, name: 'Zeynep Yıldız', age: 28, complaint: 'Yüksek Ateş', triage: 3, arrivalTime: new Date(Date.now() - 45 * 60000).toLocaleTimeString(), status: 'waiting', assignedTo: '', bp: '115/75', spo2: '98', hr: '102', assigned: false, discriminators: ['>39.5°C'] },
  { id: 4, name: 'Mustafa Can', age: 55, complaint: 'Karın Ağrısı', triage: 2, arrivalTime: new Date(Date.now() - 12 * 60000).toLocaleTimeString(), status: 'waiting', assignedTo: '', bp: '145/92', spo2: '97', hr: '88', assigned: false, discriminators: ['Rijidite', 'Rebound hassasiyet'] },
];

const EmergencyCenter = ({ _patients, addNotification }) => {
  const [cases, setCases] = useState(initialCases);
  const [showNewCase, setShowNewCase] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [_timer, setTimer] = useState(0);
  const [newCase, setNewCase] = useState({ name: '', age: '', complaint: '', bp: '', spo2: '', hr: '', discriminators: [] });

  // Geçen süre sayacı
  useEffect(() => {
    const t = setInterval(() => setTimer(x => x + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const getTriageLevel = (code) => TRIAGE_LEVELS.find(t => t.code === code);

  const calcTriageFromDiscriminators = (complaint, discs) => {
    const base = DISCRIMINATORS[complaint]?.base || 3;
    const bonus = Math.floor(discs.length / 2);
    return Math.max(1, base - bonus);
  };

  const toggleDiscriminator = (d) => {
    setNewCase(prev => ({
      ...prev,
      discriminators: prev.discriminators.includes(d)
        ? prev.discriminators.filter(x => x !== d)
        : [...prev.discriminators, d],
    }));
  };

  const handleRegister = () => {
    if (!newCase.name || !newCase.complaint) return;
    const triageCode = calcTriageFromDiscriminators(newCase.complaint, newCase.discriminators);
    const tLevel = getTriageLevel(triageCode);
    const caseObj = {
      id: Date.now(),
      name: newCase.name,
      age: parseInt(newCase.age) || 0,
      complaint: newCase.complaint,
      triage: triageCode,
      arrivalTime: new Date().toLocaleTimeString(),
      status: 'waiting',
      assignedTo: '',
      bp: newCase.bp || '—',
      spo2: newCase.spo2 || '—',
      hr: newCase.hr || '—',
      assigned: false,
      discriminators: newCase.discriminators,
    };
    setCases(prev => [caseObj, ...prev].sort((a, b) => a.triage - b.triage));
    addNotification(triageCode <= 2 ? 'danger' : 'info', `${newCase.name} — Triyaj ${triageCode}: ${tLevel?.label} (${tLevel?.time})`);
    setNewCase({ name: '', age: '', complaint: '', bp: '', spo2: '', hr: '', discriminators: [] });
    setShowNewCase(false);
  };

  const assignCase = (id, doctor) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, assignedTo: doctor, assigned: true, status: 'inProgress' } : c));
    addNotification('success', `Vaka ${doctor}'a atandı.`);
  };

  const dischargeCase = (id) => {
    const c = cases.find(x => x.id === id);
    setCases(prev => prev.map(x => x.id === id ? { ...x, status: 'discharged' } : x));
    addNotification('info', `${c?.name} taburcu edildi.`);
    setSelectedCase(null);
  };

  const activeCases = cases.filter(c => c.status !== 'discharged');
  const criticalCount = activeCases.filter(c => c.triage <= 2).length;
  const waitingCount = activeCases.filter(c => c.status === 'waiting').length;

  const inputStyle = { width: '100%', padding: '9px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-main)', fontSize: '0.9rem', fontFamily: 'Outfit', outline: 'none' };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', background: 'rgba(220,38,38,0.2)', borderRadius: '12px', border: '1px solid rgba(220,38,38,0.4)' }}>
              <Siren size={26} color="#ef4444" />
            </div>
            Acil & Triyaj Merkezi
          </h1>
          <p className="text-muted">Manchester Triyaj Sistemi — gerçek zamanlı hasta akış yönetimi.</p>
        </div>
        <button className="glass-button primary" onClick={() => setShowNewCase(true)} style={{ padding: '12px 24px' }}>
          <AlertTriangle size={18} /> Yeni Vaka Kaydet
        </button>
      </div>

      {/* Özet Kartlar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {[
          { label: 'Aktif Vaka', value: activeCases.length, icon: <Activity size={20} />, color: 'var(--primary)' },
          { label: 'Kritik (1-2)', value: criticalCount, icon: <AlertTriangle size={20} />, color: 'var(--danger)' },
          { label: 'Bekleyen', value: waitingCount, icon: <Clock size={20} />, color: 'var(--warning)' },
          { label: 'Devam Eden', value: activeCases.filter(c => c.status === 'inProgress').length, icon: <Zap size={20} />, color: 'var(--success)' },
          { label: 'Taburcu', value: cases.filter(c => c.status === 'discharged').length, icon: <CheckCircle size={20} />, color: 'var(--text-muted)' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '10px', background: `${color}22`, borderRadius: '10px', color }}>{icon}</div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Triyaj Renk Referansı */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {TRIAGE_LEVELS.map(t => (
          <div key={t.code} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: t.bg, border: `1px solid ${t.color}44` }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.color }} />
            <span style={{ fontSize: '0.78rem', color: t.color, fontWeight: 600 }}>{t.code} — {t.label}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.time}</span>
          </div>
        ))}
      </div>

      {/* Vaka Listesi */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {activeCases.length === 0 && (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Aktif vaka bulunmuyor.
          </div>
        )}
        {activeCases.map(c => {
          const tLevel = getTriageLevel(c.triage);
          return (
            <div key={c.id} className="glass-panel" onClick={() => setSelectedCase(c)}
              style={{ padding: '20px', cursor: 'pointer', borderLeft: `4px solid ${tLevel?.color}`, transition: 'all 0.2s', background: c.status === 'inProgress' ? 'rgba(255,255,255,0.03)' : '' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Triyaj Kodu */}
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: tLevel?.bg, border: `2px solid ${tLevel?.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: tLevel?.color }}>{c.triage}</span>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{c.name}</h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.age} yaş</span>
                    <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', background: tLevel?.bg, color: tLevel?.color, fontWeight: 600 }}>{tLevel?.label}</span>
                    {c.status === 'inProgress' && <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', background: 'rgba(16,185,129,0.15)', color: 'var(--success)' }}>● Devam Ediyor</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '20px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <span>🩺 {c.complaint}</span>
                    <span><Clock size={12} style={{ marginRight: '4px' }} />{c.arrivalTime}</span>
                    {c.assignedTo && <span>👨‍⚕️ {c.assignedTo}</span>}
                  </div>
                </div>

                {/* Vitals */}
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem' }}>
                  {[['🩸 KB', c.bp], ['💓 SpO2', `${c.spo2}%`], ['❤️ Nabız', c.hr]].map(([k, v]) => (
                    <div key={k} style={{ textAlign: 'center' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>{k}</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{v}</div>
                    </div>
                  ))}
                </div>

                <ChevronRight size={18} color="var(--text-muted)" />
              </div>

              {/* Diskriminatörler */}
              {c.discriminators?.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--glass-border)', flexWrap: 'wrap' }}>
                  {c.discriminators.map(d => (
                    <span key={d} style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', background: `${tLevel?.color}18`, color: tLevel?.color }}>{d}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Vaka Detay Modal */}
      {selectedCase && (() => {
        const tLevel = getTriageLevel(selectedCase.triage);
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            onClick={() => setSelectedCase(null)}>
            <div className="glass-panel animate-slide-in" style={{ width: '560px', maxWidth: '95vw', padding: '32px' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: tLevel?.bg, border: `2px solid ${tLevel?.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: tLevel?.color }}>{selectedCase.triage}</span>
                  </div>
                  <div>
                    <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>{selectedCase.name}</h3>
                    <span style={{ fontSize: '0.82rem', color: tLevel?.color }}>{tLevel?.label} — {tLevel?.time}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedCase(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                {[['Başvuru Şikayeti', selectedCase.complaint], ['Varış Saati', selectedCase.arrivalTime], ['Kan Basıncı', selectedCase.bp], ['SpO2', `${selectedCase.spo2}%`], ['Nabız', selectedCase.hr], ['Atanmış Hekim', selectedCase.assignedTo || 'Atanmadı']].map(([k, v]) => (
                  <div key={k} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '3px' }}>{k}</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{v}</div>
                  </div>
                ))}
              </div>

              {!selectedCase.assigned && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Hekime Ata:</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Dr. Kaya', 'Dr. Yılmaz', 'Dr. Öz', 'Dr. Şahin'].map(doc => (
                      <button key={doc} className="glass-button primary"
                        onClick={() => { assignCase(selectedCase.id, doc); setSelectedCase(prev => ({ ...prev, assignedTo: doc, assigned: true, status: 'inProgress' })); }}
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                        {doc}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                {selectedCase.triage <= 2 && (
                  <button className="glass-button danger" style={{ flex: 1, padding: '12px' }}>
                    <Phone size={16} /> Acil Ekip Çağır
                  </button>
                )}
                <button className="glass-button" onClick={() => dischargeCase(selectedCase.id)} style={{ flex: 1, padding: '12px' }}>
                  <CheckCircle size={16} /> Taburcu Et
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Yeni Vaka Kayıt Modal */}
      {showNewCase && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setShowNewCase(false)}>
          <div className="glass-panel animate-slide-in" style={{ width: '600px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ color: 'var(--danger)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <AlertTriangle size={20} /> Yeni Acil Vaka
              </h3>
              <button onClick={() => setShowNewCase(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              {[['name', 'Hasta Adı *', 'text', 'Adı Soyadı'], ['age', 'Yaş', 'number', '—'], ['bp', 'Kan Basıncı', 'text', '120/80'], ['spo2', 'SpO2 (%)', 'number', '98'], ['hr', 'Nabız (atım/dk)', 'number', '72']].map(([f, label, type, ph]) => (
                <div key={f}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</label>
                  <input style={inputStyle} type={type} value={newCase[f]} onChange={e => setNewCase(p => ({ ...p, [f]: e.target.value }))} placeholder={ph} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Başvuru Şikayeti *</label>
                <select style={inputStyle} value={newCase.complaint} onChange={e => setNewCase(p => ({ ...p, complaint: e.target.value, discriminators: [] }))}>
                  <option value="">Seçiniz...</option>
                  {CHIEF_COMPLAINTS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {newCase.complaint && DISCRIMINATORS[newCase.complaint] && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 600 }}>⚡ Diskriminatörler (Ağırlıklı Faktörler)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {DISCRIMINATORS[newCase.complaint].factors.map(f => (
                    <button key={f} onClick={() => toggleDiscriminator(f)}
                      style={{ padding: '7px 14px', borderRadius: '20px', border: '1px solid', borderColor: newCase.discriminators.includes(f) ? 'var(--danger)' : 'var(--glass-border)', background: newCase.discriminators.includes(f) ? 'rgba(239,68,68,0.15)' : 'transparent', color: newCase.discriminators.includes(f) ? 'var(--danger)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'Outfit', transition: 'all 0.2s' }}>
                      {f}
                    </button>
                  ))}
                </div>
                {newCase.complaint && (
                  <div style={{ marginTop: '12px', padding: '10px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Öngörülen Triyaj:</span>
                    <span style={{ fontWeight: 700, color: getTriageLevel(calcTriageFromDiscriminators(newCase.complaint, newCase.discriminators))?.color, fontSize: '1.1rem' }}>
                      {calcTriageFromDiscriminators(newCase.complaint, newCase.discriminators)} — {getTriageLevel(calcTriageFromDiscriminators(newCase.complaint, newCase.discriminators))?.label}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="glass-button" onClick={() => setShowNewCase(false)}>İptal</button>
              <button className="glass-button primary" onClick={handleRegister} style={{ padding: '12px 28px' }}>
                <AlertTriangle size={16} /> Kaydet & Triyaj Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyCenter;
