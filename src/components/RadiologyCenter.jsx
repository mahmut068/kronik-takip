import React, { useState, useEffect } from 'react';
import { Brain, ScanLine, Image, AlertTriangle, CheckCircle, Clock, Plus, Eye, FileText, Zap, Activity, Search, Filter } from 'lucide-react';

const STUDIES = [
  { id: 1, patient: 'Ahmet Yılmaz', type: 'MRI', region: 'Beyin', date: '2026-07-05', status: 'reported', priority: 'normal', aiScore: 12, modality: 'MR', accession: 'MR-2026-0701', technician: 'Elif Kaya', radiologist: 'Dr. Serhan Doğan', finding: 'Patolojik bulgu saptanmadı. Normal beyin MR görünümü.' },
  { id: 2, patient: 'Ayşe Kaya', type: 'BT', region: 'Toraks', date: '2026-07-05', status: 'pending', priority: 'urgent', aiScore: 74, modality: 'CT', accession: 'CT-2026-0702', technician: 'Murat Şahin', radiologist: null, finding: null },
  { id: 3, patient: 'Mehmet Demir', type: 'Röntgen', region: 'Akciğer', date: '2026-07-06', status: 'inprogress', priority: 'high', aiScore: 38, modality: 'XR', accession: 'XR-2026-0703', technician: 'Zeynep Arslan', radiologist: 'Dr. Serhan Doğan', finding: null },
  { id: 4, patient: 'Fatma Çelik', type: 'Ultrason', region: 'Batın', date: '2026-07-06', status: 'pending', priority: 'normal', aiScore: 5, modality: 'US', accession: 'US-2026-0704', technician: 'Murat Şahin', radiologist: null, finding: null },
  { id: 5, patient: 'Ali Korkmaz', type: 'MRI', region: 'Lomber', date: '2026-07-06', status: 'reported', priority: 'normal', aiScore: 21, modality: 'MR', accession: 'MR-2026-0705', technician: 'Elif Kaya', radiologist: 'Dr. Serhan Doğan', finding: 'L4-L5 disk hernisi. Klinik korelasyon önerilir.' },
  { id: 6, patient: 'Zeynep Yıldız', type: 'BT', region: 'Kranyal', date: '2026-07-06', status: 'pending', priority: 'urgent', aiScore: 89, modality: 'CT', accession: 'CT-2026-0706', technician: 'Zeynep Arslan', radiologist: null, finding: null },
];

const MODALITY_COLORS = { MR: '#a78bfa', CT: '#f97316', XR: '#38bdf8', US: '#34d399' };
const PRIORITY_COLORS = { urgent: 'var(--danger)', high: '#f97316', normal: 'var(--success)' };
const STATUS_LABELS = { pending: 'Bekliyor', inprogress: 'Okunuyor', reported: 'Raporlandı' };

const AIGauge = ({ score }) => {
  const color = score >= 70 ? 'var(--danger)' : score >= 40 ? '#f97316' : 'var(--success)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 4, transition: 'width 1s ease' }} />
      </div>
      <span style={{ fontSize: '0.78rem', color, fontWeight: 700, minWidth: 36 }}>{score}%</span>
    </div>
  );
};

export default function RadiologyCenter() {
  const [studies, setStudies] = useState(STUDIES);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [reportText, setReportText] = useState('');
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [newReq, setNewReq] = useState({ patient: '', type: 'BT', region: '', priority: 'normal' });
  const [aiScan, setAiScan] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);

  // AI scan animation
  useEffect(() => {
    if (!aiScan) return;
    setAiProgress(0);
    const iv = setInterval(() => {
      setAiProgress(p => {
        if (p >= 100) { clearInterval(iv); setAiScan(false); return 100; }
        return p + 4;
      });
    }, 60);
    return () => clearInterval(iv);
  }, [aiScan]);

  const filtered = studies.filter(s => {
    if (filter !== 'all' && s.status !== filter) return false;
    if (search && !s.patient.toLowerCase().includes(search.toLowerCase()) && !s.type.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: studies.length,
    pending: studies.filter(s => s.status === 'pending').length,
    urgent: studies.filter(s => s.priority === 'urgent').length,
    reported: studies.filter(s => s.status === 'reported').length,
  };

  const handleReport = (id) => {
    setStudies(prev => prev.map(s => s.id === id ? { ...s, status: 'reported', radiologist: 'Dr. Serhan Doğan', finding: reportText } : s));
    setSelected(s => ({ ...s, status: 'reported', finding: reportText }));
    setReportText('');
  };

  const handleNewRequest = () => {
    if (!newReq.patient || !newReq.region) return;
    const modMap = { BT: 'CT', MRI: 'MR', Röntgen: 'XR', Ultrason: 'US' };
    const study = {
      id: Date.now(), patient: newReq.patient, type: newReq.type, region: newReq.region,
      date: new Date().toISOString().split('T')[0], status: 'pending', priority: newReq.priority,
      aiScore: Math.floor(Math.random() * 60), modality: modMap[newReq.type] || 'CT',
      accession: `${modMap[newReq.type]}-2026-${Date.now().toString().slice(-4)}`,
      technician: 'Murat Şahin', radiologist: null, finding: null
    };
    setStudies(prev => [study, ...prev]);
    setNewReq({ patient: '', type: 'BT', region: '', priority: 'normal' });
    setShowNewRequest(false);
  };

  return (
    <div className="animate-fade-in" style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Brain size={28} color="var(--primary)" /> Radyoloji & Görüntüleme Merkezi
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>DICOM çalışmaları, AI ön-okuma ve radyoloji rapor yönetimi</p>
        </div>
        <button className="glass-button primary" onClick={() => setShowNewRequest(true)} style={{ gap: 8 }}>
          <Plus size={16} /> Yeni Talep
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {[
          { label: 'Toplam Çalışma', value: stats.total, color: 'var(--primary)', icon: <Image size={20} /> },
          { label: 'Bekleyen', value: stats.pending, color: '#f97316', icon: <Clock size={20} /> },
          { label: 'Acil Talep', value: stats.urgent, color: 'var(--danger)', icon: <AlertTriangle size={20} /> },
          { label: 'Raporlandı', value: stats.reported, color: 'var(--success)', icon: <CheckCircle size={20} /> },
        ].map((s, i) => (
          <div key={i} className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ padding: 10, borderRadius: 12, background: `${s.color}22`, color: s.color }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 20, flex: 1, minHeight: 0 }}>
        {/* List */}
        <div style={{ flex: '0 0 420px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Hasta veya tür ara..."
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '8px 12px 8px 32px', color: 'var(--text-main)', fontSize: '0.85rem', boxSizing: 'border-box' }} />
            </div>
            <select value={filter} onChange={e => setFilter(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-main)', fontSize: '0.85rem' }}>
              <option value="all">Tümü</option>
              <option value="pending">Bekliyor</option>
              <option value="inprogress">Okunuyor</option>
              <option value="reported">Raporlandı</option>
            </select>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(s => (
              <div key={s.id} className="glass-panel" onClick={() => { setSelected(s); setReportText(s.finding || ''); }}
                style={{ padding: '14px 16px', cursor: 'pointer', border: selected?.id === s.id ? '1px solid var(--primary)' : '1px solid var(--glass-border)', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{s.patient}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.region} · {s.date}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {s.priority === 'urgent' && <span style={{ background: 'var(--danger)', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 700 }}>ACİL</span>}
                    <span style={{ padding: '3px 10px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700, background: `${MODALITY_COLORS[s.modality]}22`, color: MODALITY_COLORS[s.modality] }}>{s.type}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 6, background: s.status === 'reported' ? 'rgba(16,185,129,0.15)' : s.status === 'inprogress' ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.06)', color: s.status === 'reported' ? 'var(--success)' : s.status === 'inprogress' ? '#f97316' : 'var(--text-muted)' }}>
                    {STATUS_LABELS[s.status]}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: '0 0 160px' }}>
                    <Zap size={12} color="var(--primary)" />
                    <AIGauge score={s.aiScore} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {selected ? (
            <>
              {/* Image Viewer Simulation */}
              <div className="glass-panel" style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 240 }}>
                <div style={{ position: 'absolute', inset: 0, background: '#000', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Simulated DICOM viewer */}
                  <div style={{ position: 'relative', width: 280, height: 280 }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #2a2a3a 0%, #111 60%, #1a1a2e 100%)', border: '1px solid #333', boxShadow: 'inset 0 0 40px rgba(0,229,255,0.05)' }} />
                    {/* Scan lines */}
                    {[...Array(8)].map((_, i) => (
                      <div key={i} style={{ position: 'absolute', left: '10%', right: '10%', top: `${15 + i * 10}%`, height: 1, background: 'rgba(0,229,255,0.08)' }} />
                    ))}
                    {selected.aiScore >= 40 && (
                      <div style={{ position: 'absolute', top: '28%', left: '45%', width: 30, height: 30, border: '2px solid var(--danger)', borderRadius: '50%', animation: 'pulse 1.5s ease-in-out infinite' }}>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 8, height: 8, background: 'var(--danger)', borderRadius: '50%' }} />
                      </div>
                    )}
                  </div>
                </div>
                {/* Overlay info */}
                <div style={{ position: 'absolute', top: 12, left: 12, fontSize: '0.72rem', color: 'rgba(0,229,255,0.8)', fontFamily: 'monospace', lineHeight: 1.8 }}>
                  <div>{selected.accession}</div>
                  <div>{selected.patient}</div>
                  <div>{selected.type} · {selected.region}</div>
                  <div>{selected.date}</div>
                </div>
                <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {['W/L', 'Zoom', 'Pan', 'Measure'].map(tool => (
                    <button key={tool} className="glass-button" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>{tool}</button>
                  ))}
                </div>
                {/* AI scan overlay */}
                {aiScan && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,229,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                    <div style={{ color: 'var(--primary)', fontWeight: 700 }}>AI Analiz Ediliyor...</div>
                    <div style={{ width: 200, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
                      <div style={{ height: '100%', width: `${aiProgress}%`, background: 'var(--primary)', borderRadius: 4, transition: 'width 0.06s linear' }} />
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{aiProgress}%</div>
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
                  <button className="glass-button" onClick={() => setAiScan(true)} style={{ gap: 6, fontSize: '0.82rem' }}>
                    <Zap size={14} color="var(--primary)" /> AI Tara
                  </button>
                  <button className="glass-button" style={{ gap: 6, fontSize: '0.82rem' }}>
                    <Eye size={14} /> Tam Ekran
                  </button>
                </div>
              </div>

              {/* Report Panel */}
              <div className="glass-panel" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={16} color="var(--primary)" /> Radyoloji Raporu</h3>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Anomali Skoru:</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: selected.aiScore >= 70 ? 'var(--danger)' : selected.aiScore >= 40 ? '#f97316' : 'var(--success)' }}>{selected.aiScore}%</span>
                  </div>
                </div>
                {selected.status === 'reported' ? (
                  <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8 }}>
                    <div style={{ color: 'var(--success)', fontSize: '0.8rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={14} /> {selected.radiologist} · Onaylandı</div>
                    <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6 }}>{selected.finding}</p>
                  </div>
                ) : (
                  <>
                    <textarea value={reportText} onChange={e => setReportText(e.target.value)}
                      placeholder="Radyoloji bulgularını buraya yazın..."
                      style={{ width: '100%', height: 100, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: 12, color: 'var(--text-main)', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Outfit, sans-serif' }} />
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button className="glass-button primary" onClick={() => handleReport(selected.id)} style={{ gap: 6 }} disabled={!reportText}>
                        <CheckCircle size={14} /> Raporu Onayla
                      </button>
                      <button className="glass-button" onClick={() => setStudies(prev => prev.map(s => s.id === selected.id ? { ...s, status: 'inprogress' } : s))} style={{ fontSize: '0.85rem' }}>
                        Okumaya Al
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="glass-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, color: 'var(--text-muted)' }}>
              <ScanLine size={48} style={{ opacity: 0.3 }} />
              <p>İncelemek için bir çalışma seçin</p>
            </div>
          )}
        </div>
      </div>

      {/* New Request Modal */}
      {showNewRequest && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel animate-slide-in" style={{ width: 420, padding: 28 }}>
            <h3 style={{ color: 'var(--text-main)', marginBottom: 20, fontWeight: 700 }}>Yeni Radyoloji Talebi</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Hasta Adı', key: 'patient', type: 'text', placeholder: 'Ad Soyad' },
                { label: 'Bölge', key: 'region', type: 'text', placeholder: 'Örn: Beyin, Toraks...' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>{f.label}</label>
                  <input value={newReq[f.key]} onChange={e => setNewReq(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '9px 12px', color: 'var(--text-main)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                </div>
              ))}
              {[
                { label: 'Görüntüleme Türü', key: 'type', options: ['BT', 'MRI', 'Röntgen', 'Ultrason'] },
                { label: 'Öncelik', key: 'priority', options: ['normal', 'high', 'urgent'] },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>{f.label}</label>
                  <select value={newReq[f.key]} onChange={e => setNewReq(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '9px 12px', color: 'var(--text-main)', fontSize: '0.9rem', boxSizing: 'border-box' }}>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="glass-button primary" onClick={handleNewRequest} style={{ flex: 1, justifyContent: 'center' }}>Talep Oluştur</button>
                <button className="glass-button" onClick={() => setShowNewRequest(false)} style={{ flex: 1, justifyContent: 'center' }}>İptal</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
