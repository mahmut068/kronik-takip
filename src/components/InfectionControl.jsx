import React, { useState } from 'react';
import { Shield, AlertTriangle, TrendingUp, Users, Activity, CheckCircle, XCircle, FileText, Thermometer, Droplets } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const INFECTION_CASES = [
  { id: 'INF-001', patient: 'Ahmet Y.', ward: 'Cerrahi', agent: 'MRSA', date: '2026-07-04', status: 'active', room: '201A', isolation: true, contacts: 4, resolved: false },
  { id: 'INF-002', patient: 'Fatma K.', ward: 'YBÜ', agent: 'Klebsiella', date: '2026-07-03', status: 'active', room: 'YBÜ-3', isolation: true, contacts: 7, resolved: false },
  { id: 'INF-003', patient: 'Mehmet S.', ward: 'Dahiliye', agent: 'C. difficile', date: '2026-07-02', status: 'resolved', room: '105B', isolation: false, contacts: 2, resolved: true },
  { id: 'INF-004', patient: 'Ayşe D.', ward: 'Ortopedi', agent: 'VRE', date: '2026-07-01', status: 'monitoring', room: '312A', isolation: true, contacts: 3, resolved: false },
  { id: 'INF-005', patient: 'Hasan B.', ward: 'Kardiyoloji', agent: 'Acinetobacter', date: '2026-06-29', status: 'resolved', room: '204B', isolation: false, contacts: 5, resolved: true },
];

const HAND_HYGIENE = [
  { dept: 'YBÜ', rate: 94, target: 90 }, { dept: 'Cerrahi', rate: 88, target: 90 }, { dept: 'Kardiyoloji', rate: 92, target: 90 },
  { dept: 'Dahiliye', rate: 85, target: 90 }, { dept: 'Ortopedi', rate: 89, target: 90 }, { dept: 'Acil', rate: 91, target: 90 },
];

const TREND_DATA = [
  { hafta: 'H1', mrsa: 2, vap: 1, ssi: 3, uti: 4 },
  { hafta: 'H2', mrsa: 3, vap: 2, ssi: 2, uti: 3 },
  { hafta: 'H3', mrsa: 1, vap: 1, ssi: 4, uti: 5 },
  { hafta: 'H4', mrsa: 2, vap: 0, ssi: 2, uti: 3 },
  { hafta: 'H5', mrsa: 4, vap: 2, ssi: 3, uti: 4 },
  { hafta: 'H6', mrsa: 2, vap: 1, ssi: 2, uti: 2 },
];

const BUNDLES = [
  { id: 1, name: 'VAP Önleme Demeti', items: ['Yatak başı 30-45° yükseltme', 'Günlük sedasyon tatili', 'Oral bakım x4', 'Subglottik aspirasyon'], compliance: 87, target: 95 },
  { id: 2, name: 'CLABSI Önleme Demeti', items: ['El hijyeni', 'Maksimal bariyer önlemi', 'Klorheksidin deri antisepsisi', 'Günlük hat değerlendirmesi'], compliance: 92, target: 95 },
  { id: 3, name: 'SSI Önleme Demeti', items: ['Antibiyotik profilaksisi', 'Perioperatif normoglisemi', 'Normotermik yönetim', 'Triş'], compliance: 78, target: 90 },
];

const AGENT_COLORS = { 'MRSA': '#ef4444', 'Klebsiella': '#f97316', 'C. difficile': '#8b5cf6', 'VRE': '#f59e0b', 'Acinetobacter': '#3b82f6' };
const STATUS_CFG = {
  active:     { label: 'Aktif',     color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  monitoring: { label: 'İzlemde',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  resolved:   { label: 'İyileşti', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
};

export default function InfectionControl({ addNotification }) {
  const [cases, setCases] = useState(INFECTION_CASES);
  const [tab, setTab] = useState('dashboard');
  const [filterStatus, setFilterStatus] = useState('all');

  const activeCases = cases.filter(c => c.status === 'active').length;
  const isolationCount = cases.filter(c => c.isolation).length;
  const avgHygiene = Math.round(HAND_HYGIENE.reduce((s, d) => s + d.rate, 0) / HAND_HYGIENE.length);
  const totalContacts = cases.filter(c => c.status === 'active').reduce((s, c) => s + c.contacts, 0);

  const filteredCases = filterStatus === 'all' ? cases : cases.filter(c => c.status === filterStatus);

  const resolveCase = (id) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: 'resolved', resolved: true, isolation: false } : c));
    addNotification?.('success', `${id} vakası çözüldü olarak işaretlendi.`);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 0 60px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Shield size={30} color="var(--primary)"/> Enfeksiyon Kontrol
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
            HAI sürveyansı · El hijyeni · İzolasyon yönetimi · Önleme demetleri
          </p>
        </div>
        <button className="glass-button" onClick={() => addNotification?.('info', 'Enfeksiyon kontrol raporu oluşturuluyor...')}
          style={{ gap: 8, borderColor: '#ef4444', color: '#ef4444' }}>
          <FileText size={16}/> Rapor Oluştur
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Aktif Vaka', value: activeCases, color: '#ef4444', icon: <AlertTriangle size={20}/>, sub: 'Acil müdahale gerektirir' },
          { label: 'İzolasyon Odası', value: isolationCount, color: '#f97316', icon: <Shield size={20}/>, sub: 'Aktif izolasyon' },
          { label: 'Temas Kişi Sayısı', value: totalContacts, color: '#f59e0b', icon: <Users size={20}/>, sub: 'Risk altındaki kişi' },
          { label: 'El Hijyeni Uyum', value: `%${avgHygiene}`, color: avgHygiene >= 90 ? '#10b981' : '#f59e0b', icon: <Droplets size={20}/>, sub: 'Hastane ortalaması' },
        ].map((s, i) => (
          <div key={i} className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, border: i === 0 && activeCases > 0 ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--glass-border)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.9rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', opacity: 0.7 }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {[{ k: 'dashboard', l: '📊 Genel Bakış' }, { k: 'cases', l: `🦠 Vakalar (${cases.length})` }, { k: 'hygiene', l: '🧼 El Hijyeni' }, { k: 'bundles', l: '📋 Önleme Demetleri' }].map(t => (
          <button key={t.k} className={`glass-button ${tab === t.k ? 'primary' : ''}`} onClick={() => setTab(t.k)} style={{ fontSize: '0.85rem' }}>{t.l}</button>
        ))}
      </div>

      {/* DASHBOARD */}
      {tab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={16} color="var(--primary)"/> Haftalık HAI Trendi
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                <XAxis dataKey="hafta" tick={{ fill: 'var(--text-muted)', fontSize: 11 }}/>
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }}/>
                <Tooltip contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-main)' }}/>
                <Legend wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}/>
                <Line type="monotone" dataKey="mrsa" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="MRSA"/>
                <Line type="monotone" dataKey="vap" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="VAP"/>
                <Line type="monotone" dataKey="ssi" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Cerrahi"/>
                <Line type="monotone" dataKey="uti" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} name="İdrar Yolu"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Aktif Vaka Özeti</div>
            {cases.filter(c => c.status === 'active').map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--glass-border)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>{c.patient}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.ward} · {c.room}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700, background: `${AGENT_COLORS[c.agent] || '#94a3b8'}22`, color: AGENT_COLORS[c.agent] || '#94a3b8' }}>{c.agent}</span>
                  {c.isolation && <span style={{ fontSize: '0.68rem', color: '#f97316' }}>🔒 İzole</span>}
                </div>
              </div>
            ))}
            {cases.filter(c => c.status === 'active').length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>Aktif vaka yok ✅</p>}
          </div>
        </div>
      )}

      {/* CASES */}
      {tab === 'cases' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {['all', 'active', 'monitoring', 'resolved'].map(s => (
              <button key={s} className={`glass-button ${filterStatus === s ? 'primary' : ''}`} onClick={() => setFilterStatus(s)} style={{ fontSize: '0.8rem', padding: '7px 14px' }}>
                {s === 'all' ? 'Tümü' : STATUS_CFG[s]?.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredCases.map(c => {
              const sc = STATUS_CFG[c.status];
              return (
                <div key={c.id} className="glass-panel" style={{ padding: '16px 20px', border: c.status === 'active' ? '1px solid rgba(239,68,68,0.25)' : '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: `${AGENT_COLORS[c.agent] || '#94a3b8'}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🦠</div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{c.patient}</span>
                          <span style={{ fontSize: '0.72rem', color: AGENT_COLORS[c.agent] || '#94a3b8', background: `${AGENT_COLORS[c.agent] || '#94a3b8'}18`, padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>{c.agent}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{c.ward} · Oda {c.room} · Kayıt: {c.date}</div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Temas: <strong style={{ color: 'var(--text-main)' }}>{c.contacts} kişi</strong></span>
                          {c.isolation && <span style={{ fontSize: '0.72rem', color: '#f97316', fontWeight: 700 }}>🔒 İzolasyonda</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                      <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, color: sc.color, background: sc.bg }}>{sc.label}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.id}</span>
                      {c.status !== 'resolved' && (
                        <button className="glass-button" onClick={() => resolveCase(c.id)} style={{ fontSize: '0.72rem', padding: '5px 12px', color: '#10b981', borderColor: '#10b981', gap: 5 }}>
                          <CheckCircle size={12}/> Çözüldü İşaretle
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* HYGIENE */}
      {tab === 'hygiene' && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ color: 'var(--text-main)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Droplets size={20} color="var(--primary)"/> El Hijyeni Uyum Oranları
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={HAND_HYGIENE} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="dept" tick={{ fill: 'var(--text-muted)', fontSize: 11 }}/>
              <YAxis domain={[70, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }}/>
              <Tooltip formatter={v => [`%${v}`, 'Uyum Oranı']} contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-main)' }}/>
              <Bar dataKey="rate" name="Uyum" radius={[6,6,0,0]} fill="url(#hygieneGrad)"/>
              <Bar dataKey="target" name="Hedef" radius={[6,6,0,0]} fill="rgba(255,255,255,0.08)" strokeDasharray="3 3"/>
              <defs>
                <linearGradient id="hygieneGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00e5ff"/>
                  <stop offset="100%" stopColor="#00e5ff" stopOpacity={0.4}/>
                </linearGradient>
              </defs>
              <Legend wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}/>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            {HAND_HYGIENE.map(d => (
              <div key={d.dept} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 80, fontSize: '0.82rem', color: 'var(--text-muted)' }}>{d.dept}</div>
                <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${d.rate}%`, background: d.rate >= d.target ? '#10b981' : '#f59e0b', borderRadius: 4, transition: 'width 0.8s' }}/>
                </div>
                <span style={{ width: 40, textAlign: 'right', fontSize: '0.82rem', fontWeight: 700, color: d.rate >= d.target ? '#10b981' : '#f59e0b' }}>%{d.rate}</span>
                {d.rate >= d.target ? <CheckCircle size={14} color="#10b981"/> : <XCircle size={14} color="#f59e0b"/>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BUNDLES */}
      {tab === 'bundles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {BUNDLES.map(bundle => (
            <div key={bundle.id} className="glass-panel" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <h3 style={{ color: 'var(--text-main)', fontWeight: 700 }}>{bundle.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Hedef: %{bundle.target}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: bundle.compliance >= bundle.target ? '#10b981' : '#f59e0b', lineHeight: 1 }}>%{bundle.compliance}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Uyum Oranı</div>
                </div>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ height: '100%', width: `${bundle.compliance}%`, background: bundle.compliance >= bundle.target ? '#10b981' : '#f59e0b', borderRadius: 4, transition: 'width 0.8s' }}/>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {bundle.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-main)', padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)' }}>
                    <Activity size={12} color="var(--primary)"/>  {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
