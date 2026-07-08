import React, { useState } from 'react';
import { Microscope, FileSearch, CheckCircle, Clock, AlertCircle, FileText, FlaskConical, TestTube, Search, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SPECIMENS = [
  { id: 'PAT-26-001', patient: 'Ahmet Yılmaz', type: 'Endoskopik Biyopsi', source: 'Mide', doctor: 'Dr. A. Kaya', date: '2026-07-05', status: 'completed', priority: 'routine', result: 'Helicobacter Pylori (+), Kronik Gastrit' },
  { id: 'PAT-26-002', patient: 'Fatma Şahin', type: 'İnce İğne Aspirasyonu', source: 'Tiroid', doctor: 'Dr. S. Demir', date: '2026-07-06', status: 'processing', priority: 'high', result: null },
  { id: 'PAT-26-003', patient: 'Mehmet S.', type: 'Eksizyonel Biyopsi', source: 'Cilt (Melanom Şüphesi)', doctor: 'Dr. C. Yılmaz', date: '2026-07-06', status: 'received', priority: 'urgent', result: null },
  { id: 'PAT-26-004', patient: 'Ayşe Kaya', type: 'Sitoloji', source: 'Servikal Smear', doctor: 'Dr. M. Arslan', date: '2026-07-04', status: 'completed', priority: 'routine', result: 'NILM (Malignite veya intraepitelyal lezyon izlenmedi)' },
  { id: 'PAT-26-005', patient: 'Hasan B.', type: 'Rezeksiyon Materyali', source: 'Kolon', doctor: 'Dr. T. Öz', date: '2026-07-05', status: 'processing', priority: 'high', result: null },
];

const STATUS_CFG = {
  received:   { label: 'Kabul Edildi', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', icon: <TestTube size={14}/> },
  processing: { label: 'İşleniyor',    color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', icon: <FlaskConical size={14}/> },
  completed:  { label: 'Raporlandı',   color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: <CheckCircle size={14}/> },
};

const PRIORITY_CFG = {
  urgent:  { label: 'ACİL',   color: '#ef4444' },
  high:    { label: 'Yüksek', color: '#f97316' },
  routine: { label: 'Rutin',  color: '#94a3b8' },
};

const STATS_DATA = [
  { name: 'Sitoloji', value: 120, color: '#00e5ff' },
  { name: 'Biyopsi', value: 85, color: '#a855f7' },
  { name: 'Rezeksiyon', value: 40, color: '#f59e0b' },
  { name: 'İİAB', value: 30, color: '#10b981' },
];

const TAT_DATA = [
  { day: 'Pzt', sitoloji: 1.2, biyopsi: 3.5 },
  { day: 'Sal', sitoloji: 1.1, biyopsi: 3.2 },
  { day: 'Çar', sitoloji: 1.3, biyopsi: 3.8 },
  { day: 'Per', sitoloji: 1.0, biyopsi: 3.1 },
  { day: 'Cum', sitoloji: 1.4, biyopsi: 4.0 },
];

export default function PathologyLab({ addNotification }) {
  const [tab, setTab] = useState('specimens');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = SPECIMENS.filter(s => s.patient.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase()));
  const selSpecimen = SPECIMENS.find(s => s.id === selected);

  return (
    <div className="animate-fade-in" style={{ padding: '0 0 60px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Microscope size={30} color="#a855f7"/> Patoloji Merkezi
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
            Doku örnekleri · Sitoloji · İmmünohistokimya · Raporlama
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="glass-input" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', width: 250 }}>
            <Search size={16} color="var(--text-muted)"/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Hasta veya Numune No ara..." style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', width: '100%' }}/>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Günlük Numune', value: 45, color: '#a855f7', icon: <FlaskConical size={20}/> },
          { label: 'İşlemde', value: 18, color: '#3b82f6', icon: <Clock size={20}/> },
          { label: 'Acil (Frozen)', value: 2, color: '#ef4444', icon: <AlertCircle size={20}/> },
          { label: 'Ort. Rapor Süresi', value: '3.2 Gün', color: '#10b981', icon: <FileCheck size={20}/> },
        ].map((s, i) => (
          <div key={i} className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {[{ k: 'specimens', l: '🧫 Numuneler' }, { k: 'analytics', l: '📊 Analiz & Performans' }].map(t => (
          <button key={t.k} className={`glass-button ${tab === t.k ? 'primary' : ''}`} onClick={() => setTab(t.k)} style={{ fontSize: '0.85rem' }}>{t.l}</button>
        ))}
      </div>

      {tab === 'specimens' && (
        <div style={{ display: 'grid', gridTemplateColumns: selSpecimen ? '1fr 380px' : '1fr', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(sp => {
              const sc = STATUS_CFG[sp.status];
              const pc = PRIORITY_CFG[sp.priority];
              const isSel = selected === sp.id;
              return (
                <div key={sp.id} className="glass-panel" onClick={() => setSelected(isSel ? null : sp.id)}
                  style={{ padding: '16px 20px', cursor: 'pointer', border: isSel ? '1px solid #a855f7' : '1px solid var(--glass-border)', background: isSel ? 'rgba(168,85,247,0.05)' : 'var(--glass-bg)', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: sc.bg, color: sc.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {sc.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                          {sp.id} <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, border: `1px solid ${pc.color}`, color: pc.color }}>{pc.label}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: 2 }}>{sp.patient} <span style={{ color: 'var(--text-muted)' }}>· {sp.doctor}</span></div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{sp.type} · {sp.source}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700, color: sc.color, background: sc.bg }}>
                        {sc.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 6 }}>Tarih: {sp.date}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selSpecimen && (
            <div className="glass-panel" style={{ padding: 20, height: 'fit-content', position: 'sticky', top: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <h3 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileSearch size={18} color="#a855f7"/> Numune Detayı
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selSpecimen.id}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { l: 'Hasta', v: selSpecimen.patient },
                  { l: 'Materyal Tipi', v: selSpecimen.type },
                  { l: 'Alındığı Bölge', v: selSpecimen.source },
                  { l: 'İsteyen Hekim', v: selSpecimen.doctor },
                  { l: 'Kabul Tarihi', v: selSpecimen.date },
                ].map((row, i) => (
                  <div key={i} style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{row.l}</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{row.v}</span>
                  </div>
                ))}
                
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 8 }}>PATOLOJİ RAPORU</div>
                  <div style={{ padding: '16px', borderRadius: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)' }}>
                    {selSpecimen.result ? (
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.6 }}>{selSpecimen.result}</p>
                    ) : (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>
                        <Clock size={24} style={{ opacity: 0.5, marginBottom: 8, margin: '0 auto' }}/>
                        <p style={{ fontSize: '0.85rem' }}>İnceleme devam ediyor...</p>
                        <p style={{ fontSize: '0.7rem', marginTop: 4 }}>Dokular makroskobik incelemede / Kasetlemede</p>
                      </div>
                    )}
                  </div>
                </div>

                {selSpecimen.status !== 'completed' && (
                  <button className="glass-button" onClick={() => addNotification?.('success', 'Rapor onaylandı ve sisteme yüklendi.')} style={{ width: '100%', justifyContent: 'center', gap: 8, borderColor: '#10b981', color: '#10b981', marginTop: 10 }}>
                    <CheckCircle size={16}/> Raporu Onayla
                  </button>
                )}
                <button className="glass-button" onClick={() => addNotification?.('info', 'Ek boyama (İHK) talebi oluşturuldu.')} style={{ width: '100%', justifyContent: 'center', gap: 8, marginTop: 5 }}>
                  <TestTube size={16}/> İleri İnceleme (İHK) İste
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="glass-panel" style={{ padding: 20 }}>
            <h3 style={{ color: 'var(--text-main)', marginBottom: 20, fontSize: '1rem' }}>Materyal Tipi Dağılımı</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={STATS_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={5}>
                  {STATS_DATA.map((e, i) => <Cell key={i} fill={e.color}/>)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 8 }}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              {STATS_DATA.map(e => (
                <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: e.color }}/> {e.name} ({e.value})
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel" style={{ padding: 20 }}>
            <h3 style={{ color: 'var(--text-main)', marginBottom: 20, fontSize: '1rem' }}>Turnaround Time (TAT) - Gün</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={TAT_DATA} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }}/>
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }}/>
                <Tooltip contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 8 }}/>
                <Bar dataKey="sitoloji" fill="#00e5ff" name="Sitoloji" radius={[4,4,0,0]}/>
                <Bar dataKey="biyopsi" fill="#a855f7" name="Biyopsi" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

// Fallback for icon used in KPI
function FileCheck(props) {
  return <CheckCircle {...props} />;
}
