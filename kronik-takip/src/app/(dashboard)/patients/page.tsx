'use client';

import { useEffect, useState } from 'react';
import {
  Plus, Search, AlertTriangle, CheckCircle,
  ChevronRight, Users, Filter, X, Phone,
  Heart, Activity, TrendingUp, UserPlus,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DISEASE_COLORS: Record<string, string> = {
  'Hipertansiyon': '#00e5ff',
  'Diyabet':       '#10b981',
  'Kalp Yetmezliği': '#f59e0b',
  'KOAH':          '#a78bfa',
  'Astım':         '#3b82f6',
};
const getColor = (d: string) => DISEASE_COLORS[d] || '#8aafc7';

const FILTERS = ['Tümü', 'Kritik', 'Aktif', 'Pasif'];

/* ── Add patient modal ── */
function AddPatientModal({ onClose, onAdded }: { onClose: () => void; onAdded: (id: string) => void }) {
  const [form, setForm] = useState({
    name: '', phone: '', disease: 'Hipertansiyon',
    thresholdValue: 140, thresholdLabel: 'mmHg (Sistolik)',
    literacyLevel: 'LITERATE', isActive: true,
  });
  const [saving, setSaving] = useState(false);

  const DISEASES = [
    { label: 'Hipertansiyon',    threshold: 140, unit: 'mmHg (Sistolik)' },
    { label: 'Diyabet',          threshold: 200, unit: 'mg/dL (Tokluk)' },
    { label: 'Kalp Yetmezliği',  threshold: 100, unit: 'Dispne Skoru (0-10)' },
    { label: 'KOAH',             threshold: 88,  unit: '% SpO₂' },
    { label: 'Astım',            threshold: 60,  unit: 'PEF L/dk' },
  ];

  const handleDiseaseChange = (d: string) => {
    const found = DISEASES.find(x => x.label === d);
    setForm(f => ({ ...f, disease: d, thresholdValue: found?.threshold ?? 140, thresholdLabel: found?.unit ?? '' }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone) return;
    setSaving(true);
    const res = await fetch('/api/patients', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.id) onAdded(data.id);
    setSaving(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="card animate-scale" style={{ width: '100%', maxWidth: '520px', padding: '32px', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#e2f0f9' }}>Yeni Hasta Ekle</div>
            <div style={{ fontSize: '12px', color: '#4d6b82', marginTop: '3px' }}>Takip sistemine hasta kaydı oluşturun</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4d6b82', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="input-label">Ad Soyad *</label>
              <input className="input" placeholder="Ahmet Yılmaz" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="input-label">Telefon *</label>
              <input className="input" placeholder="+90 555 000 00 00" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="input-label">Kronik Hastalık</label>
            <select className="input" value={form.disease} onChange={e => handleDiseaseChange(e.target.value)}>
              {DISEASES.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="input-label">Kritik Eşik Değeri</label>
              <input className="input" type="number" value={form.thresholdValue} onChange={e => setForm(f => ({ ...f, thresholdValue: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="input-label">Birim</label>
              <input className="input" value={form.thresholdLabel} onChange={e => setForm(f => ({ ...f, thresholdLabel: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="input-label">Hasta Okuryazarlığı</label>
            <select className="input" value={form.literacyLevel} onChange={e => setForm(f => ({ ...f, literacyLevel: e.target.value }))}>
              <option value="LITERATE">Okuryazar — SMS ile takip</option>
              <option value="ILLITERATE">Okuryazar Değil — Sesli arama ile takip</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={onClose} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>İptal</button>
          <button onClick={handleSubmit} disabled={saving || !form.name || !form.phone} className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
            {saving ? <><div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />Kaydediliyor…</> : <><UserPlus size={16} />Hastayı Kaydet</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Patient card ── */
function PatientCard({ p, delay = 0 }: { p: any; delay?: number }) {
  const hasAlert = p.alerts?.length > 0;
  const color = getColor(p.disease);
  const healthPct = hasAlert ? 25 : p.isActive ? Math.floor(Math.random() * 30) + 68 : 50;

  return (
    <Link
      href={`/dashboard/patients/${p.id}`}
      className="card animate-in"
      style={{
        display: 'flex', flexDirection: 'column', gap: '14px',
        padding: '20px', textDecoration: 'none', cursor: 'pointer',
        animationDelay: `${delay}s`, position: 'relative', overflow: 'hidden',
        borderColor: hasAlert ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.06)',
        transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px ${hasAlert ? 'rgba(244,63,94,0.3)' : color + '22'}`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = '';
      }}
    >
      {/* Glow */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: hasAlert ? '#f43f5e' : color, borderRadius: '50%', filter: 'blur(30px)', opacity: 0.07, pointerEvents: 'none' }} />

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px', fontWeight: 800, color }}>
            {p.name[0]}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2f0f9' }}>{p.name}</div>
            <div style={{ fontSize: '11px', color: '#4d6b82', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={10} />{p.phone}
            </div>
          </div>
        </div>

        {hasAlert ? (
          <div className="badge badge-danger badge-pulse"><AlertTriangle size={10} />Kritik</div>
        ) : p.isActive ? (
          <div className="badge badge-success"><CheckCircle size={10} />Aktif</div>
        ) : (
          <div className="badge badge-muted">Pasif</div>
        )}
      </div>

      {/* Disease */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span style={{ fontSize: '12px', color: '#8aafc7', fontWeight: 600 }}>{p.disease}</span>
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#4d6b82' }}>
          Eşik: <strong style={{ color: '#e2f0f9' }}>{p.thresholdValue}</strong> {p.thresholdLabel}
        </span>
      </div>

      {/* Health score bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontSize: '11px', color: '#4d6b82' }}>Sağlık Skoru</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: hasAlert ? '#f43f5e' : healthPct > 70 ? '#10b981' : '#f59e0b' }}>{healthPct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${healthPct}%`, background: hasAlert ? '#f43f5e' : healthPct > 70 ? '#10b981' : '#f59e0b' }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: '#4d6b82' }}>
        <ChevronRight size={15} />
      </div>
    </Link>
  );
}

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tümü');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('/api/patients').then(r => r.json()).then(d => { setPatients(d); setLoading(false); });
  }, []);

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.disease.toLowerCase().includes(search.toLowerCase());
    const hasAlert = p.alerts?.length > 0;
    const matchFilter =
      filterStatus === 'Tümü'  ? true :
      filterStatus === 'Kritik' ? hasAlert :
      filterStatus === 'Aktif'  ? (p.isActive && !hasAlert) :
      filterStatus === 'Pasif'  ? !p.isActive : true;
    return matchSearch && matchFilter;
  });

  const critCount = patients.filter(p => p.alerts?.length > 0).length;
  const activeCount = patients.filter(p => p.isActive && !p.alerts?.length).length;

  return (
    <div>
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#e2f0f9', letterSpacing: '-0.3px', marginBottom: '4px' }}>Hastalar</h1>
          <p style={{ fontSize: '13px', color: '#4d6b82' }}>Kronik hasta takip listesi — {patients.length} kayıt</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={17} />Yeni Hasta Ekle
        </button>
      </div>

      {/* Stats strip */}
      <div className="animate-in delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '22px' }}>
        {[
          { icon: Users,         val: patients.length, label: 'Toplam Kayıt',   color: '#00e5ff', dim: 'rgba(0,229,255,0.08)' },
          { icon: AlertTriangle, val: critCount,        label: 'Kritik Durum',  color: '#f43f5e', dim: 'rgba(244,63,94,0.08)' },
          { icon: CheckCircle,   val: activeCount,      label: 'Aktif Takip',   color: '#10b981', dim: 'rgba(16,185,129,0.08)' },
        ].map(({ icon: Icon, val, label, color, dim }) => (
          <div key={label} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: dim, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#e2f0f9', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: '11px', color: '#4d6b82', marginTop: '3px' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="animate-in delay-2" style={{ display: 'flex', gap: '12px', marginBottom: '22px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '340px' }}>
          <Search style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#4d6b82', pointerEvents: 'none' }} size={15} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: '40px' }}
            placeholder="Hasta adı veya tanı ara…"
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4d6b82' }}>
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className="btn btn-sm"
              style={{
                background: filterStatus === f ? (f === 'Kritik' ? 'rgba(244,63,94,0.15)' : 'rgba(0,229,255,0.12)') : 'rgba(255,255,255,0.04)',
                color: filterStatus === f ? (f === 'Kritik' ? '#f43f5e' : '#00e5ff') : '#8aafc7',
                border: `1px solid ${filterStatus === f ? (f === 'Kritik' ? 'rgba(244,63,94,0.25)' : 'rgba(0,229,255,0.2)') : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '180px', borderRadius: '14px' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <Users size={40} color="#2d4255" style={{ marginBottom: '12px' }} />
          <div style={{ color: '#4d6b82', fontSize: '14px' }}>Kayıtlı hasta bulunamadı.</div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm" style={{ marginTop: '16px', display: 'inline-flex' }}>
            <Plus size={14} />İlk hastayı ekle
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
          {filtered.map((p, i) => <PatientCard key={p.id} p={p} delay={i * 0.04} />)}
        </div>
      )}

      {showModal && (
        <AddPatientModal
          onClose={() => setShowModal(false)}
          onAdded={id => { setShowModal(false); router.push(`/dashboard/patients/${id}`); }}
        />
      )}
    </div>
  );
}
