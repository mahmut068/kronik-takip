import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, TrendingUp, TrendingDown, Plus, CheckSquare, Square, ClipboardList, Star, BarChart2, FileText } from 'lucide-react';

const INCIDENTS = [
  { id: 1, type: 'İlaç Hatası', patient: 'Ayşe Kaya', dept: 'Kardiyoloji', severity: 'high', date: '2026-07-04', status: 'open', description: 'Yanlış doz uygulaması. Hasta gözlem altına alındı.' },
  { id: 2, type: 'Hasta Düşmesi', patient: 'Mehmet Demir', dept: 'Nöroloji', severity: 'medium', date: '2026-07-05', status: 'investigating', description: 'Banyo transferi sırasında düşme. Yaralanma yok.' },
  { id: 3, type: 'Enfeksiyon', patient: 'Fatma Çelik', dept: 'Cerrahi', severity: 'high', date: '2026-07-05', status: 'closed', description: 'Cerrahi alan enfeksiyonu. Antibiyotik tedavisi başlandı.' },
  { id: 4, type: 'Ekipman Arızası', patient: '-', dept: 'Radyoloji', severity: 'low', date: '2026-07-06', status: 'open', description: 'MR cihazı beklenmedik kapanma. Teknisyen çağrıldı.' },
];

const KPIS = [
  { label: 'Hasta Memnuniyeti', value: 87, target: 90, unit: '%', trend: 'up', delta: 2.3 },
  { label: 'Ortalama Bekleme Süresi', value: 18, target: 15, unit: 'dk', trend: 'down', delta: -2 },
  { label: 'Hastane İçi Enfeksiyon Oranı', value: 1.2, target: 1.0, unit: '%', trend: 'up', delta: 0.1 },
  { label: 'Yatak Doluluk Oranı', value: 78, target: 85, unit: '%', trend: 'up', delta: 4.1 },
  { label: 'Ortalama Yatış Süresi', value: 4.2, target: 4.0, unit: 'gün', trend: 'down', delta: -0.3 },
  { label: 'Doğru İlaç Uygulama Oranı', value: 99.1, target: 99.5, unit: '%', trend: 'down', delta: -0.2 },
];

const DEPARTMENTS = [
  { name: 'Kardiyoloji', score: 92, incidents: 1, audits: 3 },
  { name: 'Nöroloji', score: 85, incidents: 2, audits: 2 },
  { name: 'Cerrahi', score: 78, incidents: 3, audits: 4 },
  { name: 'Acil Servis', score: 88, incidents: 1, audits: 5 },
  { name: 'Radyoloji', score: 90, incidents: 1, audits: 2 },
];

const CHECKLIST = [
  { id: 1, category: 'Hasta Güvenliği', item: 'Hasta kimlik doğrulama protokolü uygulanıyor', done: true },
  { id: 2, category: 'Hasta Güvenliği', item: 'Düşme riski değerlendirmesi yapılıyor', done: true },
  { id: 3, category: 'Hasta Güvenliği', item: 'İlaç doğrulama çift kontrol süreci aktif', done: false },
  { id: 4, category: 'Enfeksiyon Kontrolü', item: 'El hijyeni denetim oranı ≥%85', done: true },
  { id: 5, category: 'Enfeksiyon Kontrolü', item: 'Sterilizasyon kayıtları güncel', done: true },
  { id: 6, category: 'Enfeksiyon Kontrolü', item: 'İzolasyon protokolleri belgelenmiş', done: false },
  { id: 7, category: 'Belgeler & Akreditasyon', item: 'Klinik politikalar son 12 ayda güncellendi', done: true },
  { id: 8, category: 'Belgeler & Akreditasyon', item: 'Personel eğitim kayıtları tam', done: false },
  { id: 9, category: 'Belgeler & Akreditasyon', item: 'JCI öz-değerlendirme tamamlandı', done: false },
  { id: 10, category: 'Ekipman & Tesis', item: 'Tıbbi ekipman bakım kayıtları güncel', done: true },
  { id: 11, category: 'Ekipman & Tesis', item: 'Yangın güvenliği tatbikatı yapıldı', done: true },
];

const SEV_COLORS = { high: 'var(--danger)', medium: '#f97316', low: '#f59e0b' };
const SEV_LABELS = { high: 'Yüksek', medium: 'Orta', low: 'Düşük' };
const STATUS_LABELS = { open: 'Açık', investigating: 'İnceleniyor', closed: 'Kapatıldı' };

export default function QualityAssurance() {
  const [tab, setTab] = useState('incidents');
  const [incidents, setIncidents] = useState(INCIDENTS);
  const [checklist, setChecklist] = useState(CHECKLIST);
  const [showNewIncident, setShowNewIncident] = useState(false);
  const [newInc, setNewInc] = useState({ type: 'İlaç Hatası', patient: '', dept: 'Kardiyoloji', severity: 'medium', description: '' });

  const doneCount = checklist.filter(c => c.done).length;
  const progress = Math.round((doneCount / checklist.length) * 100);

  const grouped = checklist.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {});

  const handleAddIncident = () => {
    if (!newInc.description) return;
    setIncidents(prev => [{
      id: Date.now(), ...newInc,
      date: new Date().toISOString().split('T')[0], status: 'open'
    }, ...prev]);
    setNewInc({ type: 'İlaç Hatası', patient: '', dept: 'Kardiyoloji', severity: 'medium', description: '' });
    setShowNewIncident(false);
  };

  const TABS = [
    { key: 'incidents', label: 'Olay Kayıtları', icon: <AlertTriangle size={15} /> },
    { key: 'kpi', label: 'KPI Hedefleri', icon: <BarChart2 size={15} /> },
    { key: 'departments', label: 'Departman Skorları', icon: <Star size={15} /> },
    { key: 'checklist', label: 'JCI Kontrol Listesi', icon: <ClipboardList size={15} /> },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={28} color="var(--primary)" /> Kalite & Hasta Güvenliği
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>Olay yönetimi, KPI takibi ve JCI akreditasyon kontrol listesi</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="glass-panel" style={{ padding: '10px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: progress >= 80 ? 'var(--success)' : '#f97316' }}>{progress}%</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>JCI Hazırlık</div>
          </div>
          {tab === 'incidents' && (
            <button className="glass-button primary" onClick={() => setShowNewIncident(true)} style={{ gap: 8 }}>
              <Plus size={16} /> Olay Kaydet
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {TABS.map(t => (
          <button key={t.key} className={`glass-button ${tab === t.key ? 'primary' : ''}`} onClick={() => setTab(t.key)} style={{ gap: 6, fontSize: '0.85rem' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Incidents */}
      {tab === 'incidents' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
          {incidents.map(inc => (
            <div key={inc.id} className="glass-panel" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <AlertTriangle size={16} color={SEV_COLORS[inc.severity]} />
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{inc.type}</span>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 6, background: `${SEV_COLORS[inc.severity]}22`, color: SEV_COLORS[inc.severity] }}>{SEV_LABELS[inc.severity]}</span>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 6, background: inc.status === 'closed' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)', color: inc.status === 'closed' ? 'var(--success)' : 'var(--text-muted)' }}>{STATUS_LABELS[inc.status]}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 6 }}>{inc.description}</p>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: 16 }}>
                    <span>👤 {inc.patient !== '-' ? inc.patient : 'Hasta yok'}</span>
                    <span>🏥 {inc.dept}</span>
                    <span>📅 {inc.date}</span>
                  </div>
                </div>
                {inc.status !== 'closed' && (
                  <button className="glass-button" onClick={() => setIncidents(p => p.map(i => i.id === inc.id ? { ...i, status: inc.status === 'open' ? 'investigating' : 'closed' } : i))}
                    style={{ fontSize: '0.8rem', marginLeft: 12 }}>
                    {inc.status === 'open' ? 'İncele' : 'Kapat'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPIs */}
      {tab === 'kpi' && (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, overflowY: 'auto', alignContent: 'start' }}>
          {KPIS.map((kpi, i) => {
            const onTarget = kpi.trend === 'up' ? kpi.value >= kpi.target : kpi.value <= kpi.target;
            const pct = Math.min(100, (kpi.value / (kpi.target * 1.2)) * 100);
            return (
              <div key={i} className="glass-panel" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{kpi.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hedef: {kpi.target}{kpi.unit}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: onTarget ? 'var(--success)' : 'var(--danger)' }}>{kpi.value}<span style={{ fontSize: '1rem' }}>{kpi.unit}</span></div>
                    <div style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', color: kpi.delta > 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {kpi.delta > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {kpi.delta > 0 ? '+' : ''}{kpi.delta}{kpi.unit}
                    </div>
                  </div>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: onTarget ? 'var(--success)' : 'var(--danger)', borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6, textAlign: 'right' }}>
                  {onTarget ? '✅ Hedefte' : '⚠️ Hedef altında'}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Departments */}
      {tab === 'departments' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
          {DEPARTMENTS.sort((a, b) => b.score - a.score).map((d, i) => (
            <div key={i} className="glass-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-muted)', minWidth: 30 }}>#{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>{d.name}</div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${d.score}%`, background: d.score >= 90 ? 'var(--success)' : d.score >= 80 ? '#f97316' : 'var(--danger)', borderRadius: 4 }} />
                </div>
              </div>
              <div style={{ textAlign: 'center', minWidth: 60 }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: d.score >= 90 ? 'var(--success)' : d.score >= 80 ? '#f97316' : 'var(--danger)' }}>{d.score}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Kalite Skoru</div>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>⚠️ {d.incidents} olay</span>
                <span>📋 {d.audits} denetim</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Checklist */}
      {tab === 'checklist' && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>JCI Akreditasyon İlerleme Durumu</span>
                <span style={{ color: progress >= 80 ? 'var(--success)' : '#f97316', fontWeight: 700 }}>{doneCount}/{checklist.length} tamamlandı</span>
              </div>
              <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, var(--primary), var(--success))`, borderRadius: 5, transition: 'width 0.5s' }} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: progress >= 80 ? 'var(--success)' : '#f97316' }}>{progress}%</div>
          </div>
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: 16 }}>
              <h4 style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{cat}</h4>
              <div className="glass-panel" style={{ padding: '8px 0' }}>
                {items.map(item => (
                  <div key={item.id} onClick={() => setChecklist(p => p.map(c => c.id === item.id ? { ...c, done: !c.done } : c))}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', cursor: 'pointer', transition: 'background 0.2s', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {item.done ? <CheckSquare size={18} color="var(--success)" /> : <Square size={18} color="var(--text-muted)" />}
                    <span style={{ color: item.done ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: item.done ? 'line-through' : 'none', fontSize: '0.9rem' }}>
                      {item.item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Incident Modal */}
      {showNewIncident && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel animate-slide-in" style={{ width: 460, padding: 28 }}>
            <h3 style={{ color: 'var(--text-main)', marginBottom: 20, fontWeight: 700 }}>Yeni Olay Kaydı</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[{ label: 'Olay Türü', key: 'type', options: ['İlaç Hatası', 'Hasta Düşmesi', 'Enfeksiyon', 'Ekipman Arızası', 'Cerrahi Komplikasyon', 'Diğer'] },
                { label: 'Departman', key: 'dept', options: ['Kardiyoloji', 'Nöroloji', 'Cerrahi', 'Acil Servis', 'Radyoloji', 'YBÜ'] },
                { label: 'Şiddet', key: 'severity', options: ['low', 'medium', 'high'] }
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>{f.label}</label>
                  <select value={newInc[f.key]} onChange={e => setNewInc(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '9px 12px', color: 'var(--text-main)', fontSize: '0.9rem', boxSizing: 'border-box' }}>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>İlgili Hasta (opsiyonel)</label>
                <input value={newInc.patient} onChange={e => setNewInc(p => ({ ...p, patient: e.target.value }))} placeholder="Ad Soyad"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '9px 12px', color: 'var(--text-main)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Olay Açıklaması</label>
                <textarea value={newInc.description} onChange={e => setNewInc(p => ({ ...p, description: e.target.value }))} placeholder="Olayı kısaca açıklayın..."
                  style={{ width: '100%', height: 80, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '9px 12px', color: 'var(--text-main)', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Outfit, sans-serif' }} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="glass-button primary" onClick={handleAddIncident} style={{ flex: 1, justifyContent: 'center' }}>Kaydet</button>
                <button className="glass-button" onClick={() => setShowNewIncident(false)} style={{ flex: 1, justifyContent: 'center' }}>İptal</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
