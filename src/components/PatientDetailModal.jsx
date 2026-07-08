import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Calendar, BrainCircuit, Loader, Watch, HeartPulse, Video, Pill, Plus, Trash2, ClipboardList, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import TeleMedicine from './TeleMedicine';

const TABS = [
  { key: 'overview',    label: '📋 Genel', icon: ClipboardList },
  { key: 'vitals',      label: '💊 Vitals & İlaçlar', icon: Pill },
  { key: 'history',     label: '📈 Gelişim Grafiği', icon: BarChart2 },
  { key: 'tasks',       label: '📅 Görev & Randevu', icon: Calendar },
  { key: 'ai',          label: '🤖 MediAI Raporu', icon: BrainCircuit },
];

const PatientDetailModal = ({ patient, onClose, tasks = [], _setTasks, appointments = [], _setAppointments }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [aiState, setAiState] = useState('idle');
  const [aiReport, setAiReport] = useState('');
  const [watchActive, setWatchActive] = useState(false);
  const [liveVitals, setLiveVitals] = useState({ bpm: 72, spo2: 98 });
  const [showTeleMed, setShowTeleMed] = useState(false);
  const [medications, setMedications] = useState(patient.medications || []);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: 'Günde 1' });

  useEffect(() => {
    let interval;
    if (watchActive) {
      interval = setInterval(() => {
        setLiveVitals({
          bpm: patient.status === 'danger'
            ? Math.floor(Math.random() * (140 - 110 + 1)) + 110
            : Math.floor(Math.random() * (85 - 65 + 1)) + 65,
          spo2: Math.floor(Math.random() * (100 - 95 + 1)) + 95
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [watchActive, patient.status]);

  if (!patient) return null;

  const handleAiAnalysis = () => {
    setAiState('processing');
    setActiveTab('ai');
    setTimeout(() => {
      const report = patient.status === 'danger'
        ? `Yapay Zeka Analizi (${new Date().toLocaleString('tr-TR')}): Son verilerde ani bir yükseliş tespit edilmiştir. Hastanın ölçüm ivmesi tehlikeli sınırdadır. Derhal müdahale edilmesi ve ilgili ilaç dozajının yeniden yapılandırılması tavsiye edilir. Sağlık skoru: ${patient.healthScore}/100.`
        : `Yapay Zeka Analizi (${new Date().toLocaleString('tr-TR')}): Hastanın ölçüm değerleri son periyotta oldukça istikrarlıdır. Herhangi bir risk artışı gözlemlenmemiştir. Mevcut tedavi rutinine devam edilmesi uygundur. Sağlık skoru: ${patient.healthScore}/100.`;
      setAiReport(report);
      setAiState('done');
    }, 2500);
  };

  const handleAddMedication = (e) => {
    e.preventDefault();
    if (!newMed.name) return;
    setMedications([...medications, { id: Date.now(), ...newMed }]);
    setNewMed({ name: '', dosage: '', frequency: 'Günde 1' });
    setShowPrescriptionForm(false);
  };

  const handleRemoveMedication = (id) => setMedications(medications.filter(m => m.id !== id));

  const statusColor = patient.status === 'danger' ? 'var(--danger)' : 'var(--success)';

  return (
    <>
      {showTeleMed && <TeleMedicine patient={patient} onClose={() => setShowTeleMed(false)} />}

      <div className="alert-overlay animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9998 }}>
        <div className="glass-panel animate-slide-in"
          style={{ width: '980px', maxWidth: '96vw', padding: '0', position: 'relative', maxHeight: '92vh', overflowY: 'auto', borderRadius: '20px' }}>

          {/* Modal Header */}
          <div style={{ padding: '28px 32px 0', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--glass-border)' }}>
            <div className="print-header">
              <h1 style={{ fontSize: '1.5rem' }}>MediTrack Enterprise — Hasta Raporu</h1>
              <p>Tarih: {new Date().toLocaleDateString('tr-TR')} | Hasta: {patient.name}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '2rem', color: 'var(--primary)' }}>{patient.name}</h2>
                <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', marginTop: '6px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><TrendingUp size={16} /> {patient.disease}</span>
                  <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '0.8rem',
                    background: patient.status === 'danger' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
                    color: statusColor, border: `1px solid ${statusColor}44` }}>
                    {patient.status === 'danger' ? '🔴 Risk Altında' : '🟢 Stabil'}
                  </span>
                  <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Sağlık Skoru: <strong style={{ color: statusColor }}>{patient.healthScore}/100</strong>
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <button className="glass-button no-print" onClick={() => window.print()}
                  style={{ background: 'rgba(245,158,11,0.2)', borderColor: '#f59e0b', color: '#fff', padding: '10px 16px' }}>
                  🖨️ Rapor Al
                </button>
                <button className="glass-button no-print" onClick={handleAiAnalysis} disabled={aiState === 'processing'}
                  style={{ background: 'rgba(139,92,246,0.2)', borderColor: '#8b5cf6', color: '#fff', padding: '10px 16px' }}>
                  <BrainCircuit size={16} /> MediAI
                </button>
                <button className="glass-button no-print" onClick={() => setShowTeleMed(true)}
                  style={{ background: 'rgba(16,185,129,0.2)', borderColor: '#10b981', color: '#fff', padding: '10px 16px' }}>
                  <Video size={16} /> Görüşme
                </button>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '8px' }}>
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {TABS.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  style={{ padding: '10px 18px', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer', fontSize: '0.88rem',
                    fontFamily: 'Outfit, sans-serif', fontWeight: activeTab === tab.key ? 600 : 400,
                    background: activeTab === tab.key ? 'var(--glass-bg)' : 'transparent',
                    color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-muted)',
                    borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
                    transition: 'all 0.2s' }}>
                  {tab.label}
                  {tab.key === 'ai' && aiState === 'processing' && (
                    <Loader size={12} style={{ animation: 'spin 1s linear infinite', marginLeft: '6px', display: 'inline' }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '28px 32px' }}>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="animate-fade-in">
                {/* Stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                  {[
                    { label: 'Eşik Değeri', value: patient.threshold, color: 'var(--warning)' },
                    { label: 'Son Ölçüm', value: patient.currentValue, color: statusColor },
                    { label: 'Toplam Kayıt', value: patient.history.length, color: 'var(--primary)' },
                  ].map(s => (
                    <div key={s.label} className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                      <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>{s.label}</p>
                      <h3 style={{ fontSize: '2.2rem', color: s.color, fontWeight: 700 }}>{s.value}</h3>
                    </div>
                  ))}
                </div>
                {/* İletişim kanalı */}
                <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>İletişim Kanalı</p>
                  <p style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {patient.literacy ? '📱 Yazılı Mesaj (SMS)' : '📞 Sesli Arama (Bot)'}
                  </p>
                </div>
                {/* Sorular */}
                {patient.questions?.length > 0 && (
                  <div className="glass-panel" style={{ padding: '20px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>Aktif Sorular</p>
                    {patient.questions.map((q, i) => (
                      <div key={i} style={{ padding: '10px 14px', background: 'rgba(0,229,255,0.06)', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.2)', color: 'var(--text-main)', marginBottom: '8px' }}>
                        {i + 1}. {q}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VITALS TAB */}
            {activeTab === 'vitals' && (
              <div className="animate-fade-in">
                {/* Watch */}
                <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: watchActive ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ padding: '12px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%' }}>
                      <Watch size={32} color={watchActive ? 'var(--success)' : 'var(--text-muted)'} />
                    </div>
                    <div>
                      <h3 style={{ marginBottom: '4px', color: 'var(--text-main)' }}>Canlı Vitals (Giyilebilir Teknoloji)</h3>
                      <p className="text-muted" style={{ fontSize: '0.9rem' }}>Hastanın akıllı cihazından gerçek zamanlı veri akışı.</p>
                    </div>
                  </div>
                  {!watchActive ? (
                    <button className="glass-button primary" onClick={() => setWatchActive(true)}>Bağlantı Kur</button>
                  ) : (
                    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                      <div style={{ textAlign: 'center' }}>
                        <span className="text-muted" style={{ fontSize: '0.8rem', display: 'block' }}>Nabız (BPM)</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>
                          <HeartPulse size={28} className="animate-heartbeat" /> {liveVitals.bpm}
                        </div>
                      </div>
                      <div style={{ textAlign: 'center', paddingLeft: '24px', borderLeft: '1px solid var(--glass-border)' }}>
                        <span className="text-muted" style={{ fontSize: '0.8rem', display: 'block' }}>Oksijen (SpO2)</span>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>%{liveVitals.spo2}</div>
                      </div>
                      <button className="glass-button danger" onClick={() => setWatchActive(false)}>Kes</button>
                    </div>
                  )}
                </div>

                {/* E-Reçete */}
                <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(59,130,246,0.05)' }}>
                  <div className="flex-between" style={{ marginBottom: '16px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                      <Pill size={20} color="#3b82f6" /> Aktif İlaçlar & E-Reçete
                    </h3>
                    <button className="glass-button" onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                      style={{ background: 'rgba(59,130,246,0.2)', borderColor: '#3b82f6', color: '#fff', padding: '8px 14px' }}>
                      <Plus size={16} /> Reçete Yaz
                    </button>
                  </div>
                  {showPrescriptionForm && (
                    <form onSubmit={handleAddMedication} className="animate-fade-in"
                      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', marginBottom: '20px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                      <div>
                        <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>İlaç Adı</label>
                        <input className="glass-input" required placeholder="Örn: Metformin" value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} />
                      </div>
                      <div>
                        <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Dozaj</label>
                        <input className="glass-input" placeholder="Örn: 500mg" value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} />
                      </div>
                      <div>
                        <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Kullanım</label>
                        <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} value={newMed.frequency} onChange={e => setNewMed({ ...newMed, frequency: e.target.value })}>
                          <option>Günde 1</option><option>Günde 2</option><option>Günde 3</option><option>Haftada 1</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="submit" className="glass-button primary" style={{ height: '46px' }}>Kaydet</button>
                      </div>
                    </form>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {medications.length === 0 ? (
                      <p className="text-muted" style={{ textAlign: 'center', padding: '16px' }}>Henüz reçete yazılmamış.</p>
                    ) : medications.map(med => (
                      <div key={med.id} className="medication-card">
                        <div style={{ padding: '10px', background: 'rgba(59,130,246,0.2)', borderRadius: '8px' }}>
                          <Pill size={20} color="#60a5fa" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <strong style={{ color: 'var(--text-main)' }}>{med.name}</strong>
                          {med.dosage && <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>{med.dosage}</span>}
                          <p style={{ color: '#60a5fa', fontSize: '0.85rem', marginTop: '2px' }}>{med.frequency}</p>
                        </div>
                        <button onClick={() => handleRemoveMedication(med.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'history' && (
              <div className="animate-fade-in" style={{ height: '380px' }}>
                <h3 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Gelişim Grafiği</h3>
                {patient.history?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={patient.history} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                      <XAxis dataKey="date" stroke="var(--text-muted)" />
                      <YAxis stroke="var(--text-muted)" />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} itemStyle={{ color: 'var(--text-main)' }} />
                      <Legend />
                      <ReferenceLine y={patient.threshold} label="Risk Eşiği" stroke="var(--danger)" strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="value" name="Ölçüm" stroke="var(--primary)" strokeWidth={3} activeDot={{ r: 8 }} dot={{ r: 4, fill: 'var(--primary)' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)' }}>Yeterli veri bulunmamaktadır.</div>
                )}
              </div>
            )}

            {/* TASKS TAB */}
            {activeTab === 'tasks' && (
              <div className="animate-fade-in">
                <h3 style={{ marginBottom: '16px', color: 'var(--text-main)', fontSize: '1.2rem' }}>Hastaya Atanmış Görevler & Randevular</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {/* Left Column: Tasks */}
                  <div>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', fontWeight: 600 }}>
                      📋 Klinik Görevler
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {tasks.filter(t => t.patientId === patient.id).length === 0 ? (
                        <p className="text-muted" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }}>Atanmış görev bulunmuyor.</p>
                      ) : (
                        tasks.filter(t => t.patientId === patient.id).map(t => (
                          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: t.done ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid var(--glass-border)', opacity: t.done ? 0.6 : 1 }}>
                            <span style={{ color: t.done ? 'var(--success)' : 'var(--text-muted)', fontSize: '1.1rem' }}>{t.done ? '✅' : '⏳'}</span>
                            <div style={{ flex: 1 }}>
                              <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</p>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kategori: {t.category} | Son Tarih: {t.dueDate}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  {/* Right Column: Appointments */}
                  <div>
                    <h4 style={{ color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', fontWeight: 600 }}>
                      📅 Randevular
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {appointments.filter(a => a.patientId === patient.id).length === 0 ? (
                        <p className="text-muted" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }}>Planlanmış randevu bulunmuyor.</p>
                      ) : (
                        appointments.filter(a => a.patientId === patient.id).map(a => (
                          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: a.status === 'completed' ? 'rgba(16,185,129,0.06)' : 'rgba(0,229,255,0.05)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                            <span style={{ color: a.status === 'completed' ? 'var(--success)' : 'var(--primary)', fontSize: '1.1rem' }}>{a.status === 'completed' ? '✅' : '📅'}</span>
                            <div style={{ flex: 1 }}>
                              <p style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{a.type}</p>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tarih: {a.date} | Saat: {a.time}</span>
                              {a.note && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '2px' }}>Not: {a.note}</p>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI TAB */}
            {activeTab === 'ai' && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                  <button onClick={handleAiAnalysis} disabled={aiState === 'processing'} className="glass-button"
                    style={{ background: aiState === 'done' ? 'rgba(16,185,129,0.2)' : 'rgba(139,92,246,0.2)', borderColor: aiState === 'done' ? 'var(--success)' : '#8b5cf6', color: 'var(--text-main)', minWidth: '210px', justifyContent: 'center' }}>
                    {aiState === 'idle'       && <><BrainCircuit size={20} /> MediAI Analizi İste</>}
                    {aiState === 'processing' && <><Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> Analiz Ediliyor...</>}
                    {aiState === 'done'       && <><BrainCircuit size={20} /> Yeniden Analiz Et</>}
                  </button>
                </div>
                {aiState === 'processing' && (
                  <div className="glass-panel flex-center" style={{ padding: '40px', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', border: '3px solid rgba(139,92,246,0.3)', borderTop: '3px solid #8b5cf6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <p style={{ color: 'var(--text-muted)' }}>MediAI hasta verilerini analiz ediyor...</p>
                  </div>
                )}
                {aiState === 'done' && (
                  <div className="animate-fade-in" style={{ padding: '24px', background: 'rgba(139,92,246,0.1)', border: '1px solid #8b5cf6', borderRadius: '12px', color: 'var(--text-main)', lineHeight: 1.7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                      <BrainCircuit size={24} color="#a78bfa" />
                      <strong style={{ fontSize: '1.1rem', color: '#a78bfa' }}>MediAI Raporu</strong>
                    </div>
                    <p>{aiReport}</p>
                  </div>
                )}
                {aiState === 'idle' && (
                  <div className="glass-panel flex-center" style={{ padding: '60px', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)' }}>
                    <BrainCircuit size={48} style={{ opacity: 0.3 }} />
                    <p>Yapay zeka analizi başlatmak için butona tıklayın.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default PatientDetailModal;
