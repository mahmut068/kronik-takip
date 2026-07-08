import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown, FileText, CheckCircle, Clock, XCircle, Search, Plus, CreditCard, Building2, BarChart2, Filter } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const INVOICES = [
  { id: 'INV-2026-001', patient: 'Ahmet Yılmaz', date: '2026-07-01', service: 'Kardiyoloji Muayenesi', amount: 850, insurance: 680, patient_share: 170, status: 'paid', insurer: 'SGK' },
  { id: 'INV-2026-002', patient: 'Ayşe Kaya', date: '2026-07-02', service: 'Diyabet Kontrolü + Lab', amount: 1200, insurance: 960, patient_share: 240, status: 'paid', insurer: 'SGK' },
  { id: 'INV-2026-003', patient: 'Mehmet Demir', date: '2026-07-03', service: 'Ekokardiyografi', amount: 2400, insurance: 1920, patient_share: 480, status: 'pending', insurer: 'Özel Sigorta' },
  { id: 'INV-2026-004', patient: 'Fatma Şahin', date: '2026-07-04', service: 'YBÜ Günlük Ücret', amount: 8500, insurance: 7650, patient_share: 850, status: 'pending', insurer: 'SGK' },
  { id: 'INV-2026-005', patient: 'Kemal Aydın', date: '2026-07-04', service: 'Sepsis Tedavi Paketi', amount: 15000, insurance: 12000, patient_share: 3000, status: 'overdue', insurer: 'Özel Sigorta' },
  { id: 'INV-2026-006', patient: 'Selin Demirci', date: '2026-07-05', service: 'Cerrahi + Anestezi', amount: 22000, insurance: 19800, patient_share: 2200, status: 'paid', insurer: 'Özel Sigorta' },
  { id: 'INV-2026-007', patient: 'Ali Koca', date: '2026-07-05', service: 'Radyoloji - MRI', amount: 3200, insurance: 2560, patient_share: 640, status: 'pending', insurer: 'SGK' },
  { id: 'INV-2026-008', patient: 'Zeynep Arslan', date: '2026-07-06', service: 'Dahiliye Muayene', amount: 650, insurance: 520, patient_share: 130, status: 'paid', insurer: 'SGK' },
];

const MONTHLY = [
  { ay: 'Oca', gelir: 320000, gider: 210000 },
  { ay: 'Şub', gelir: 298000, gider: 198000 },
  { ay: 'Mar', gelir: 365000, gider: 225000 },
  { ay: 'Nis', gelir: 410000, gider: 240000 },
  { ay: 'May', gelir: 388000, gider: 232000 },
  { ay: 'Haz', gelir: 445000, gider: 268000 },
  { ay: 'Tem', gelir: 53800, gider: 31000 },
];

const DEPT_REVENUE = [
  { name: 'Kardiyoloji', value: 28, color: '#f43f5e' },
  { name: 'Dahiliye', value: 22, color: '#00e5ff' },
  { name: 'Cerrahi', value: 19, color: '#a855f7' },
  { name: 'YBÜ', value: 16, color: '#f59e0b' },
  { name: 'Radyoloji', value: 10, color: '#10b981' },
  { name: 'Diğer', value: 5, color: '#64748b' },
];

const STATUS_CONFIG = {
  paid:    { label: 'Ödendi',   color: 'var(--success)', bg: 'rgba(16,185,129,0.12)', icon: <CheckCircle size={13}/> },
  pending: { label: 'Bekliyor', color: '#f59e0b',        bg: 'rgba(245,158,11,0.12)', icon: <Clock size={13}/> },
  overdue: { label: 'Gecikmiş', color: 'var(--danger)',  bg: 'rgba(244,63,94,0.12)',  icon: <XCircle size={13}/> },
};

const fmt = (n) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(n);

export default function FinancialCenter({ addNotification }) {
  const [tab, setTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewInvoice, setShowNewInvoice] = useState(false);

  const filtered = useMemo(() => INVOICES.filter(inv => {
    const matchSearch = inv.patient.toLowerCase().includes(search.toLowerCase()) || inv.id.includes(search);
    const matchStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchSearch && matchStatus;
  }), [search, filterStatus]);

  const totalRevenue  = INVOICES.reduce((s, i) => s + i.amount, 0);
  const totalPaid     = INVOICES.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalPending  = INVOICES.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const totalOverdue  = INVOICES.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

  const STATS = [
    { label: 'Toplam Faturalanan', value: fmt(totalRevenue),  icon: <DollarSign size={20}/>,  color: 'var(--primary)' },
    { label: 'Tahsil Edildi',      value: fmt(totalPaid),     icon: <CheckCircle size={20}/>, color: 'var(--success)' },
    { label: 'Bekleyen',           value: fmt(totalPending),  icon: <Clock size={20}/>,       color: '#f59e0b' },
    { label: 'Gecikmiş',           value: fmt(totalOverdue),  icon: <XCircle size={20}/>,     color: 'var(--danger)' },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <DollarSign size={28} color="var(--success)" /> Finansal Merkez
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            Gelir-gider analizi, fatura yönetimi ve sigorta takibi
          </p>
        </div>
        <button className="glass-button primary" onClick={() => { setShowNewInvoice(true); setTab('invoices'); }} style={{ gap: 8 }}>
          <Plus size={15} /> Yeni Fatura
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {STATS.map((s, i) => (
          <div key={i} className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${s.color}22`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { key: 'overview', label: 'Genel Bakış', icon: <BarChart2 size={14}/> },
          { key: 'invoices', label: 'Faturalar',   icon: <FileText size={14}/> },
          { key: 'insurance',label: 'Sigorta',     icon: <Building2 size={14}/> },
        ].map(t => (
          <button key={t.key} className={`glass-button ${tab === t.key ? 'primary' : ''}`} onClick={() => setTab(t.key)} style={{ gap: 6, fontSize: '0.85rem' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, minHeight: 0 }}>
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={16} color="var(--primary)" /> Aylık Gelir / Gider
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={MONTHLY} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="ay" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-main)' }} />
                <Bar dataKey="gelir" fill="#00e5ff" radius={[4,4,0,0]} name="Gelir" />
                <Bar dataKey="gider" fill="#f43f5e" radius={[4,4,0,0]} name="Gider" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Bölüm Gelirleri (%)</div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={DEPT_REVENUE} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={35}>
                  {DEPT_REVENUE.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-main)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              {DEPT_REVENUE.map((d, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                    <span style={{ color: 'var(--text-muted)' }}>{d.name}</span>
                  </div>
                  <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invoices */}
      {tab === 'invoices' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '8px 12px' }}>
              <Search size={15} color="var(--text-muted)" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Hasta adı veya fatura no ara..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '0.9rem', fontFamily: 'Outfit, sans-serif' }} />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['all','paid','pending','overdue'].map(s => (
                <button key={s} className={`glass-button ${filterStatus === s ? 'primary' : ''}`} onClick={() => setFilterStatus(s)} style={{ fontSize: '0.8rem', padding: '8px 14px' }}>
                  {s === 'all' ? 'Tümü' : STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(inv => {
              const sc = STATUS_CONFIG[inv.status];
              return (
                <div key={inv.id} className="glass-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ flex: '0 0 130px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{inv.id}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{inv.date}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>{inv.patient}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{inv.service}</div>
                  </div>
                  <div style={{ textAlign: 'right', flex: '0 0 120px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem' }}>{fmt(inv.amount)}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sigorta: {fmt(inv.insurance)}</div>
                  </div>
                  <div style={{ flex: '0 0 90px', textAlign: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, color: sc.color, background: sc.bg }}>
                      {sc.icon} {sc.label}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>{inv.insurer}</div>
                  </div>
                  <div style={{ flex: '0 0 80px', textAlign: 'right' }}>
                    <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700 }}>Hasta Payı</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 800 }}>{fmt(inv.patient_share)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Insurance */}
      {tab === 'insurance' && (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, minHeight: 0 }}>
          {[
            { name: 'SGK', count: INVOICES.filter(i=>i.insurer==='SGK').length, total: INVOICES.filter(i=>i.insurer==='SGK').reduce((s,i)=>s+i.insurance,0), color: '#00e5ff', rate: 92 },
            { name: 'Özel Sigorta', count: INVOICES.filter(i=>i.insurer==='Özel Sigorta').length, total: INVOICES.filter(i=>i.insurer==='Özel Sigorta').reduce((s,i)=>s+i.insurance,0), color: '#a855f7', rate: 85 },
          ].map((ins, i) => (
            <div key={i} className="glass-panel" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${ins.color}22`, color: ins.color }}>
                  <CreditCard size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1.1rem' }}>{ins.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ins.count} aktif talep</div>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: ins.color }}>{fmt(ins.total)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Toplam sigorta ödemesi</div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tahsilat Oranı</span>
                  <span style={{ color: ins.color, fontWeight: 700 }}>{ins.rate}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>
                  <div style={{ height: '100%', width: `${ins.rate}%`, background: `linear-gradient(90deg, ${ins.color}, ${ins.color}aa)`, borderRadius: 4, transition: 'width 1s ease' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button className="glass-button" style={{ flex: 1, fontSize: '0.8rem' }} onClick={() => addNotification?.('info', `${ins.name} icmal raporu oluşturuldu.`)}>
                  İcmal Raporu
                </button>
                <button className="glass-button primary" style={{ flex: 1, fontSize: '0.8rem' }} onClick={() => addNotification?.('success', `${ins.name} talep dosyası gönderildi.`)}>
                  Talep Gönder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
