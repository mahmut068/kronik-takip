import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity, Plus, TrendingUp, AlertCircle, FileText, Users, ShieldAlert,
  CheckCircle, Search, ShieldCheck, TrendingDown, Minus, Zap, Sparkles,
  Phone, Eye, Edit2, X, Save, Brain, MessageSquare, Bell,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import PatientDetailModal from './PatientDetailModal';
import FamilyNotificationModal from './FamilyNotificationModal';

/* ─── Count-up animasyon hook ─── */
const useCountUp = (target, duration = 1200) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

const getTrend = (history) => {
  if (!history || history.length < 2) return 'stable';
  const last = history[history.length - 1].value;
  const prev = history[history.length - 2].value;
  const diff = last - prev;
  if (diff > 5) return 'up';
  if (diff < -5) return 'down';
  return 'stable';
};

const getComplianceScore = (history) => {
  if (!history || history.length === 0) return 0;
  return Math.min(100, Math.round((history.length / 7) * 100));
};

/* ─── İstatistik Kartı ─── */
const StatCard = ({ icon, label, value, color, bg, pulse }) => {
  const animatedValue = useCountUp(value);
  return (
    <div
      className="glass-panel stat-card-hover"
      style={{
        padding: '22px 24px', display: 'flex', alignItems: 'center', gap: '18px',
        position: 'relative', overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        ...(pulse ? { animation: 'statPulse 2.5s infinite' } : {}),
      }}
    >
      <div style={{ padding: '14px', background: bg, borderRadius: '50%', flexShrink: 0, boxShadow: `0 0 20px ${bg}` }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</p>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color, lineHeight: 1, fontFamily: 'Outfit, sans-serif' }}>
          {animatedValue}
        </h2>
      </div>
      <div style={{
        position: 'absolute', right: '-20px', bottom: '-20px',
        width: '80px', height: '80px', background: bg,
        borderRadius: '50%', opacity: 0.15, filter: 'blur(20px)',
      }} />
    </div>
  );
};

/* ─── Özel Tooltip ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div style={{
      background: 'rgba(10,15,28,0.97)',
      border: '1px solid rgba(0,229,255,0.4)',
      borderRadius: '12px', padding: '14px 18px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
      fontFamily: 'Outfit, sans-serif', minWidth: '160px',
    }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
        📅 {label}
      </p>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '5px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color, display: 'inline-block' }} />
            {entry.name}
          </span>
          <strong style={{ fontSize: '0.9rem', color: entry.color }}>{entry.value}</strong>
        </div>
      ))}
    </div>
  );
};

const getHealthScoreColor = (score) => {
  if (score >= 80) return 'var(--success)';
  if (score >= 50) return 'var(--warning)';
  return 'var(--danger)';
};

const PATIENT_COLORS = ['#00e5ff', '#10b981', '#f59e0b', '#a78bfa', '#f43f5e'];
const PAGE_SIZE = 25;

/* ─── Inline Düzenleme ─── */
const InlineEditRow = ({ patient, onSave, onCancel }) => {
  const [form, setForm] = useState({ name: patient.name, disease: patient.disease, threshold: patient.threshold });
  return (
    <tr style={{ background: 'rgba(0,229,255,0.06)' }}>
      <td style={{ padding: '10px 14px' }}>
        <input className="glass-input" style={{ padding: '6px 10px', fontSize: '0.83rem', width: '130px' }}
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      </td>
      <td style={{ padding: '10px 14px' }}>
        <input className="glass-input" style={{ padding: '6px 10px', fontSize: '0.83rem', width: '130px' }}
          value={form.disease} onChange={e => setForm({ ...form, disease: e.target.value })} />
      </td>
      <td style={{ padding: '10px 14px' }}>
        <input className="glass-input" type="number" style={{ padding: '6px 10px', fontSize: '0.83rem', width: '80px' }}
          value={form.threshold} onChange={e => setForm({ ...form, threshold: parseInt(e.target.value) || 0 })} />
      </td>
      <td colSpan={3} style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="glass-button primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            onClick={() => onSave({ ...patient, ...form, threshold: parseInt(form.threshold) })}>
            <Save size={13} /> Kaydet
          </button>
          <button className="glass-button" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={onCancel}>
            <X size={13} /> İptal
          </button>
        </div>
      </td>
    </tr>
  );
};

/* ─── Pagination Bar ─── */
const PagonBtn = ({ label, onClick, disabled, active }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '6px 11px', borderRadius: '6px', border: 'none',
      background: active ? 'var(--primary)' : disabled ? 'transparent' : 'rgba(255,255,255,0.06)',
      color: active ? '#000' : disabled ? 'var(--text-muted)' : 'var(--text-main)',
      cursor: disabled ? 'default' : 'pointer',
      fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', fontWeight: active ? 700 : 400,
      transition: 'all 0.15s ease', opacity: disabled ? 0.4 : 1, minWidth: '34px',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}
    onMouseEnter={e => { if (!disabled && !active) e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
    onMouseLeave={e => { if (!disabled && !active) e.currentTarget.style.background = active ? 'var(--primary)' : disabled ? 'transparent' : 'rgba(255,255,255,0.06)'; }}
  >
    {label}
  </button>
);

const PaginationBar = ({ page, totalPages, setPage }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4)              return [1, 2, 3, 4, 5, '...', totalPages];
    if (page >= totalPages - 3) return [1, '...', totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages];
    return [1, '...', page - 1, page, page + 1, '...', totalPages];
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '16px', borderTop: '1px solid var(--glass-border)', flexWrap: 'wrap' }}>
      <PagonBtn key="first" label={<ChevronsLeft size={14}/>} onClick={() => setPage(1)} disabled={page===1} />
      <PagonBtn key="prev"  label={<ChevronLeft size={14}/>}  onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} />
      {getPages().map((p, i) =>
        p === '...'
          ? <span key={`dot-${i}`} style={{ padding: '6px 4px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>…</span>
          : <PagonBtn key={`pg-${p}-${i}`} label={p} onClick={() => setPage(p)} disabled={false} active={p === page} />
      )}
      <PagonBtn key="next"  label={<ChevronRight size={14}/>}  onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} />
      <PagonBtn key="last"  label={<ChevronsRight size={14}/>} onClick={() => setPage(totalPages)} disabled={page===totalPages} />
    </div>
  );
};

/* ══════════════════════════════════════════════════
   ANA COMPONENT
══════════════════════════════════════════════════ */
const DoctorDashboard = ({
  patients, setPatients, addNotification, addToast, theme,
  tasks = [], setTasks, appointments = [], setAppointments
}) => {
  const [showAddForm, setShowAddForm]         = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm]           = useState('');
  const [filterStatus, setFilterStatus]       = useState('all');
  const [editingId, setEditingId]             = useState(null);
  const [showAIModal, setShowAIModal]         = useState(false);
  const [showSMSModal, setShowSMSModal]       = useState(false);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [page, setPage]                       = useState(1);
  const [newPatient, setNewPatient]           = useState({ name: '', disease: '', threshold: '', literacy: 'true', question: '' });

  /* Filtre değişince sayfayı sıfırla */
  useEffect(() => { setPage(1); }, [searchTerm, filterStatus]);

  const handleAddPatient = (e) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.threshold) return;
    const patient = {
      id: Date.now(), name: newPatient.name, disease: newPatient.disease,
      threshold: parseInt(newPatient.threshold, 10), currentValue: 0,
      literacy: newPatient.literacy === 'true',
      questions: [newPatient.question],
      status: 'safe', healthScore: 100, medications: [], history: []
    };
    setPatients(prev => [...prev, patient]);
    addNotification('info', `Yeni hasta eklendi: ${patient.name}`);
    if (addToast) addToast('success', `✅ ${patient.name} sisteme eklendi.`);
    setShowAddForm(false);
    setNewPatient({ name: '', disease: '', threshold: '', literacy: 'true', question: '' });
  };

  const handleSaveEdit = (updated) => {
    setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditingId(null);
    if (addToast) addToast('success', `✏️ ${updated.name} güncellendi.`);
  };

  const handleAIReport = () => {
    setShowAIModal(true);
    if (addToast) addToast('info', '🧠 YZ Raporu hazırlanıyor...');
    setTimeout(() => { if (addToast) addToast('success', '✅ YZ Raporu oluşturuldu!'); }, 2000);
  };

  /* ─── Sayılar (memo ile optimize) ─── */
  const { totalPatients, riskPatients, safePatients, avgScore } = useMemo(() => {
    const total = patients.length;
    const risk  = patients.filter(p => p.status === 'danger').length;
    const avg   = total > 0 ? Math.round(patients.reduce((a, p) => a + p.healthScore, 0) / total) : 0;
    return { totalPatients: total, riskPatients: risk, safePatients: total - risk, avgScore: avg };
  }, [patients]);

  /* ─── Filtrelenmiş liste (memo) ─── */
  const filteredPatients = useMemo(() => patients.filter(p => {
    const matchSearch = !searchTerm
      || p.name.toLowerCase().includes(searchTerm.toLowerCase())
      || p.disease.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchFilter;
  }), [patients, searchTerm, filterStatus]);

  const totalPages   = Math.ceil(filteredPatients.length / PAGE_SIZE);
  const pagedPatients = useMemo(
    () => filteredPatients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredPatients, page]
  );

  /* ─── Grafik: sadece ilk 5 hasta, son 5 veri noktası (memo) ─── */
  const { chartData, chartPatients } = useMemo(() => {
    const top5 = patients.slice(0, 5);
    const allDates = [...new Set(top5.flatMap(p => p.history.slice(-5).map(h => h.date)))].sort();
    const data = allDates.length > 0
      ? allDates.map(date => {
          const row = { date };
          top5.forEach(p => {
            const point = p.history.find(h => h.date === date);
            row[p.name.split(' ')[0]] = point ? point.value : null;
          });
          return row;
        })
      : top5.map(p => ({ date: 'Bugün', [p.name.split(' ')[0]]: p.currentValue }));
    return { chartData: data, chartPatients: top5 };
  }, [patients]);

  /* ─── YZ Modal ─── */
  const AIModal = () => {
    const riskList   = patients.filter(p => p.status === 'danger').slice(0, 10);
    const stableList = patients.filter(p => p.status !== 'danger').slice(0, 8);
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', zIndex: 99998, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={() => setShowAIModal(false)}>
        <div className="glass-panel animate-slide-in"
          style={{ width: '560px', maxWidth: '94vw', padding: '32px', maxHeight: '80vh', overflowY: 'auto' }}
          onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontSize: '1.4rem' }}>
              <Brain size={24} /> YZ Klinik Raporu
            </h2>
            <button onClick={() => setShowAIModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            {[
              { label: 'Toplam Hasta',       value: totalPatients, color: 'var(--secondary)' },
              { label: 'Riskli Hasta',        value: riskPatients,  color: 'var(--danger)' },
              { label: 'Stabil Hasta',        value: safePatients,  color: 'var(--success)' },
              { label: 'Ort. Sağlık Skoru',  value: `%${avgScore}`, color: avgScore >= 70 ? 'var(--success)' : 'var(--warning)' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{item.label}</p>
                <p style={{ fontSize: '1.8rem', fontWeight: 800, color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
          {riskList.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ color: 'var(--danger)', marginBottom: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={15} /> Acil Müdahale ({riskPatients} hasta, ilk 10 gösteriliyor)
              </h4>
              {riskList.map(p => (
                <div key={p.id} style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.88rem' }}>{p.name} — {p.disease}</span>
                  <span style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '0.88rem' }}>{p.currentValue}/{p.threshold}</span>
                </div>
              ))}
            </div>
          )}
          <div>
            <h4 style={{ color: 'var(--success)', marginBottom: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={15} /> Stabil Örnekler
            </h4>
            {stableList.map(p => (
              <div key={p.id} style={{ padding: '9px 14px', borderRadius: '8px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{p.name} — {p.disease}</span>
                <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem' }}>Skor: {p.healthScore}/100</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', padding: '12px 14px', borderRadius: '10px', background: 'rgba(0,229,255,0.07)', border: '1px solid rgba(0,229,255,0.25)', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--primary)' }}>🤖 YZ Önerisi:</strong>{' '}
            {riskPatients > 0
              ? `${riskPatients} hasta kritik eşiği aştı. Acil servis koordinasyonu önerilir.`
              : 'Tüm hastalar stabil. Aylık kontroller yeterli görünmektedir.'}
          </div>
        </div>
      </div>
    );
  };

  /* ─── SMS Modal ─── */
  const SMSModal = () => {
    const mockLogs = [
      { time: '09:12', patient: 'Ahmet Yılmaz', type: 'SMS',   msg: 'Tansiyon: 120 → alındı.',       status: 'ok'      },
      { time: '09:45', patient: 'Ayşe Kaya',    type: 'SMS',   msg: 'Kan şekeri: 145 → alındı.',     status: 'ok'      },
      { time: '10:03', patient: 'Mehmet Demir', type: 'Çağrı', msg: 'Sesli bot — Nefes: 3/10',       status: 'ok'      },
      { time: '10:30', patient: 'Ahmet Yılmaz', type: 'SMS',   msg: 'Cevap bekleniyor...',            status: 'pending' },
    ];
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', zIndex: 99998, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={() => setShowSMSModal(false)}>
        <div className="glass-panel animate-slide-in" style={{ width: '520px', maxWidth: '94vw', padding: '28px' }}
          onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontSize: '1.2rem' }}>
              <MessageSquare size={20} /> SMS / Çağrı Geçmişi
            </h2>
            <button onClick={() => setShowSMSModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mockLogs.map((log, i) => (
              <div key={i} style={{ padding: '12px 14px', borderRadius: '9px', background: log.status === 'pending' ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${log.status === 'pending' ? 'rgba(245,158,11,0.3)' : 'var(--glass-border)'}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: log.type === 'SMS' ? 'rgba(0,229,255,0.15)' : 'rgba(16,185,129,0.15)', color: log.type === 'SMS' ? 'var(--primary)' : 'var(--success)', border: `1px solid ${log.type === 'SMS' ? 'rgba(0,229,255,0.3)' : 'rgba(16,185,129,0.3)'}`, flexShrink: 0 }}>
                  {log.type === 'SMS' ? '✉️' : '📞'} {log.type}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1px' }}>{log.patient}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{log.msg}</p>
                </div>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', flexShrink: 0 }}>{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>

      {/* ─── Başlık + Butonlar ─── */}
      <div className="flex-between mb-4" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.1rem', marginBottom: '6px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            Doktor Kontrol Paneli
            <span style={{ fontSize: '0.9rem', padding: '4px 12px', background: 'rgba(0,229,255,0.1)', color: 'var(--primary)', borderRadius: 20, border: '1px solid rgba(0,229,255,0.3)' }}>KRONİK TAKİP</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '0.88rem' }}>
            Kronik hastalarınızı izleyin, eşik değerlerini belirleyin ve yapay zeka ile proaktif takip sağlayın.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="glass-button" onClick={() => setShowSMSModal(true)} style={{ fontSize: '0.85rem', padding: '9px 14px' }}>
            <Phone size={16} style={{ color: 'var(--success)' }} /> SMS / Çağrı
          </button>
          <button className="glass-button" onClick={() => setShowFamilyModal(true)}
            style={{ fontSize: '0.85rem', padding: '9px 14px', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.35)' }}>
            <Bell size={16} style={{ color: '#25d366' }} /> Yakın Bildir
          </button>
          <button className="glass-button" onClick={handleAIReport}
            style={{ fontSize: '0.85rem', padding: '9px 14px', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.35)' }}>
            <Brain size={16} style={{ color: '#a78bfa' }} /> YZ Raporu
          </button>
          <button className="glass-button primary" onClick={() => setShowAddForm(!showAddForm)}
            style={{ animation: !showAddForm ? 'buttonPulse 2s infinite' : 'none', fontSize: '0.85rem', padding: '9px 14px' }}>
            <Plus size={17} /> Yeni Hasta
          </button>
        </div>
      </div>

      {/* ─── İstatistik Kartları ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '28px' }}>
        <StatCard icon={<Users size={24} color="var(--secondary)" />} label="Toplam Hasta" value={totalPatients} color="var(--text-main)" bg="rgba(59,130,246,0.2)" />
        <StatCard icon={<ShieldAlert size={24} color="var(--danger)" />} label="Riskli / Acil" value={riskPatients} color={riskPatients > 0 ? 'var(--danger)' : 'var(--text-main)'} bg="rgba(239,68,68,0.2)" pulse={riskPatients > 0} />
        <StatCard icon={<CheckCircle size={24} color="var(--success)" />} label="Stabil Hasta" value={safePatients} color="var(--success)" bg="rgba(16,185,129,0.2)" />
        <StatCard icon={<Zap size={24} color="var(--warning)" />} label="Ort. Sağlık Skoru" value={avgScore} color={avgScore >= 70 ? 'var(--success)' : avgScore >= 50 ? 'var(--warning)' : 'var(--danger)'} bg="rgba(245,158,11,0.2)" />
      </div>

      {/* ─── ALAN GRAFİĞİ (ilk 5 hasta) ─── */}
      <div className="glass-panel" style={{ padding: '22px 18px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '1rem' }}>
            <Activity size={18} style={{ color: 'var(--primary)' }} /> Anlık Ölçüm vs Eşik (İlk 5 Hasta)
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '20px', height: '0', borderTop: '2px dashed #ef4444', display: 'inline-block' }} /> Eşik
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} /> Ölçüm
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 8, right: 20, left: 0, bottom: 0 }}>
            <defs>
              {chartPatients.map((p, i) => (
                <linearGradient key={p.id} id={`grad-${p.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={PATIENT_COLORS[i % PATIENT_COLORS.length]} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={PATIENT_COLORS[i % PATIENT_COLORS.length]} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 11, fontFamily: 'Outfit' }} />
            <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11, fontFamily: 'Outfit' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={v => <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'Outfit' }}>{v}</span>} />
            {chartPatients.map(p => (
              <ReferenceLine key={`ref-${p.id}`} y={p.threshold} stroke="#ef4444" strokeDasharray="6 3" strokeWidth={1.5} strokeOpacity={0.6} />
            ))}
            {chartPatients.map((p, i) => (
              <Area key={p.id} type="monotone" dataKey={p.name.split(' ')[0]}
                stroke={PATIENT_COLORS[i % PATIENT_COLORS.length]} strokeWidth={2.5}
                fill={`url(#grad-${p.id})`}
                dot={{ fill: PATIENT_COLORS[i % PATIENT_COLORS.length], strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }} connectNulls />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ─── Yeni Hasta Formu ─── */}
      {showAddForm && (
        <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '28px', border: '1px solid rgba(0,229,255,0.25)' }}>
          <h3 style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
            <FileText size={18} style={{ color: 'var(--primary)' }} /> Yeni Profil Oluştur
          </h3>
          <form onSubmit={handleAddPatient} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>Hasta Adı</label>
              <input type="text" className="glass-input" required value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>Hastalık</label>
              <input type="text" className="glass-input" required value={newPatient.disease} onChange={e => setNewPatient({ ...newPatient, disease: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>İletişim</label>
              <select className="glass-input" style={{ backgroundColor: theme === 'light' ? '#fff' : 'rgba(0,0,0,0.8)' }}
                value={newPatient.literacy} onChange={e => setNewPatient({ ...newPatient, literacy: e.target.value })}>
                <option value="true">SMS</option>
                <option value="false">Sesli</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>Eşik Değeri</label>
              <input type="number" className="glass-input" required value={newPatient.threshold} onChange={e => setNewPatient({ ...newPatient, threshold: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>Takip Sorusu</label>
              <input type="text" className="glass-input" required placeholder="Örn: Bugün tansiyonunuz nasıl?" value={newPatient.question} onChange={e => setNewPatient({ ...newPatient, question: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="glass-button" onClick={() => setShowAddForm(false)}>İptal</button>
              <button type="submit" className="glass-button primary">Kaydet</button>
            </div>
          </form>
        </div>
      )}

      {/* ─── Arama & Filtre ─── */}
      <div className="flex-between" style={{ marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Aktif Hasta Listesi{' '}
          <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>({filteredPatients.length})</span>
          {' '}<span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.8rem' }}>
            — Sayfa {page}/{totalPages}
          </span>
        </h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" className="glass-input" placeholder="İsim veya hastalık ara..."
              style={{ paddingLeft: '34px', width: '210px', padding: '8px 10px 8px 34px', fontSize: '0.85rem' }}
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div style={{ display: 'flex', background: 'var(--glass-bg)', borderRadius: '8px', padding: '3px', border: '1px solid var(--glass-border)' }}>
            {[['all', 'Tümü'], ['danger', 'Riskli'], ['safe', 'Stabil']].map(([val, label]) => (
              <button key={val} onClick={() => setFilterStatus(val)}
                style={{
                  padding: '6px 12px', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif',
                  background: filterStatus === val ? (val === 'danger' ? 'var(--danger)' : val === 'safe' ? 'var(--success)' : 'rgba(255,255,255,0.12)') : 'transparent',
                  border: 'none', borderRadius: '5px', cursor: 'pointer',
                  color: filterStatus === val && val !== 'all' ? '#fff' : 'var(--text-main)',
                  fontWeight: filterStatus === val ? 700 : 400, transition: 'all 0.2s',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── TABLO ─── */}
      {filteredPatients.length === 0 ? (
        <div className="glass-panel flex-center" style={{ padding: '48px', color: 'var(--text-muted)', flexDirection: 'column', gap: '10px' }}>
          <Search size={30} style={{ opacity: 0.4 }} />
          <span>Aranan kriterlere uygun hasta bulunamadı.</span>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Outfit, sans-serif' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  {['Hasta Adı', 'Kronik Hastalık', 'Son Ölçüm', 'Sağlık Skoru', 'Durum', 'Aksiyonlar'].map(col => (
                    <th key={col} style={{ padding: '13px 14px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.7px', textTransform: 'uppercase', background: 'rgba(255,255,255,0.02)', whiteSpace: 'nowrap' }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedPatients.map((patient, idx) => {
                  const scoreColor = getHealthScoreColor(patient.healthScore);
                  const isEditing  = editingId === patient.id;
                  const trend      = getTrend(patient.history);
                  const TrendIcon  = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
                  const trendColor = trend === 'up' ? 'var(--danger)' : trend === 'down' ? 'var(--success)' : 'var(--warning)';

                  if (isEditing) {
                    return <InlineEditRow key={patient.id} patient={patient} onSave={handleSaveEdit} onCancel={() => setEditingId(null)} />;
                  }

                  return (
                    <tr key={patient.id}
                      className="patient-table-row"
                      style={{
                        borderBottom: idx < pagedPatients.length - 1 ? '1px solid var(--glass-border)' : 'none',
                        transition: 'background 0.15s',
                        ...(patient.status === 'danger' ? { background: 'rgba(239,68,68,0.04)' } : {}),
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = patient.status === 'danger' ? 'rgba(239,68,68,0.09)' : 'rgba(255,255,255,0.035)'}
                      onMouseLeave={e => e.currentTarget.style.background = patient.status === 'danger' ? 'rgba(239,68,68,0.04)' : 'transparent'}
                    >
                      {/* Hasta Adı */}
                      <td style={{ padding: '14px 14px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, background: patient.status === 'danger' ? 'rgba(239,68,68,0.2)' : 'rgba(0,229,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.88rem', fontWeight: 700, color: patient.status === 'danger' ? 'var(--danger)' : 'var(--primary)', border: `1px solid ${patient.status === 'danger' ? 'rgba(239,68,68,0.3)' : 'rgba(0,229,255,0.3)'}` }}>
                            {patient.name.charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.87rem' }}>{patient.name}</p>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{patient.literacy ? '✉️ SMS' : '🔊 Sesli'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Hastalık */}
                      <td style={{ padding: '14px 14px' }}>
                        <span style={{ padding: '3px 9px', borderRadius: '20px', fontSize: '0.76rem', fontWeight: 600, background: 'rgba(59,130,246,0.12)', color: 'var(--secondary)', border: '1px solid rgba(59,130,246,0.25)', whiteSpace: 'nowrap' }}>
                          {patient.disease}
                        </span>
                      </td>

                      {/* Son Ölçüm */}
                      <td style={{ padding: '14px 14px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: patient.status === 'danger' ? 'var(--danger)' : 'var(--success)' }}>
                            {patient.currentValue || '—'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>/ {patient.threshold}</span>
                          <TrendIcon size={13} color={trendColor} />
                        </div>
                      </td>

                      {/* Sağlık Skoru Badge */}
                      <td style={{ padding: '14px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem', background: `${scoreColor}20`, color: scoreColor, border: `1px solid ${scoreColor}50`, whiteSpace: 'nowrap' }}>
                            {patient.healthScore}/100
                          </span>
                          <div style={{ width: '40px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${patient.healthScore}%`, background: scoreColor, borderRadius: '2px' }} />
                          </div>
                        </div>
                      </td>

                      {/* Durum */}
                      <td style={{ padding: '14px 14px', whiteSpace: 'nowrap' }}>
                        {patient.status === 'danger' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.4)' }}>
                            <AlertCircle size={11} /> Riskli
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(16,185,129,0.12)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.3)' }}>
                            <CheckCircle size={11} /> Stabil
                          </span>
                        )}
                      </td>

                      {/* Aksiyonlar */}
                      <td style={{ padding: '14px 14px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => setSelectedPatient(patient)}
                            style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '0.76rem', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,229,255,0.1)'}>
                            <Eye size={12} /> Detay
                          </button>
                          <button onClick={() => setEditingId(patient.id)}
                            style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '0.76rem', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(167,139,250,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(167,139,250,0.1)'}>
                            <Edit2 size={12} /> Düzenle
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ─── Pagination ─── */}
          <PaginationBar page={page} totalPages={totalPages} setPage={setPage} />

          {/* Sayfa bilgisi */}
          <div style={{ padding: '0 16px 12px', textAlign: 'center', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredPatients.length)} / {filteredPatients.length} hasta gösteriliyor
          </div>
        </div>
      )}

      {/* ─── Modals ─── */}
      {selectedPatient && (
        <PatientDetailModal patient={selectedPatient} onClose={() => setSelectedPatient(null)}
          tasks={tasks} setTasks={setTasks} appointments={appointments} setAppointments={setAppointments} />
      )}
      {showAIModal  && <AIModal />}
      {showSMSModal && <SMSModal />}
      {showFamilyModal && (
        <FamilyNotificationModal
          patients={patients}
          onClose={() => setShowFamilyModal(false)}
          addNotification={addNotification}
          addToast={addToast}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
