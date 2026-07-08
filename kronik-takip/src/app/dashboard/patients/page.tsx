'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  Plus, Search, AlertTriangle, CheckCircle,
  ChevronRight, Users, X, Phone,
  ChevronLeft, Loader2, UserPlus, Send, Download
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Recharts lazy load
const LazyCharts = dynamic(() => import('@/components/DashboardCharts'), {
  ssr: false,
  loading: () => <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" /></div>,
});

const DISEASE_COLORS: Record<string, string> = {
  'Hipertansiyon':         '#0ea5e9', // Sky
  'Tip 2 Diyabet':         '#10b981', // Emerald
  'Kalp Yetmezliği':      '#f59e0b', // Amber
  'KOAH':                  '#8b5cf6', // Violet
  'Astım':                 '#3b82f6', // Blue
  'Kronik Böbrek Hastalığı': '#e11d48', // Rose
  'Epilepsi':              '#db2777', // Pink
  'Parkinson':             '#6366f1', // Indigo
};
const getColor = (d: string) => DISEASE_COLORS[d] || '#64748b';

const FILTERS = ['Tümü', 'Kritik', 'Aktif', 'Pasif'];
const PAGE_SIZE = 24;

// ── Debounce hook ────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── Add patient modal (Light Mode) ───────────────────────────────────────────
function AddPatientModal({ onClose, onAdded }: { onClose: () => void; onAdded: (id: string) => void }) {
  const [form, setForm] = useState({
    name: '', phone: '', disease: 'Hipertansiyon',
    thresholdValue: 140, thresholdLabel: 'mmHg (Sistolik)',
    literacyLevel: 'LITERATE', isActive: true,
  });
  const [saving, setSaving] = useState(false);

  const DISEASES = [
    { label: 'Hipertansiyon',          threshold: 140, unit: 'mmHg (Sistolik)' },
    { label: 'Tip 2 Diyabet',          threshold: 200, unit: 'mg/dL (Açlık)' },
    { label: 'Kalp Yetmezliği',       threshold: 7,   unit: 'Dispne Skoru (1-10)' },
    { label: 'KOAH',                   threshold: 88,  unit: '% SpO₂' },
    { label: 'Astım',                  threshold: 60,  unit: 'PEF (L/dk)' },
    { label: 'Kronik Böbrek Hastalığı',threshold: 6,   unit: 'mg/dL (Kreatinin)' },
    { label: 'Epilepsi',               threshold: 1,   unit: 'Nöbet Sayısı (Günlük)' },
    { label: 'Parkinson',              threshold: 7,   unit: 'Titreme Şiddeti (1-10)' },
  ];

  const handleDiseaseChange = (d: string) => {
    const found = DISEASES.find(x => x.label === d);
    setForm(f => ({ ...f, disease: d, thresholdValue: found?.threshold ?? 140, thresholdLabel: found?.unit ?? '' }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone) return;
    setSaving(true);
    const res  = await fetch('/api/patients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (data.id) onAdded(data.id);
    setSaving(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="card animate-scale" style={{ width: '100%', maxWidth: '560px', padding: '36px', background: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Yeni Hasta Ekle</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>Sisteme yeni bir takip kaydı oluşturun</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(0,0,0,0.04)', borderRadius: '50%', width: '32px', height: '32px', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label style={{ fontSize: '13px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Ad Soyad *</label><input className="input" style={{ background: '#f8fafc', width: '100%' }} placeholder="Ahmet Yılmaz" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><label style={{ fontSize: '13px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Telefon *</label><input className="input" style={{ background: '#f8fafc', width: '100%' }} placeholder="+90 5XX XXX XX XX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Kronik Hastalık (Tanı)</label>
            <select className="input" style={{ background: '#f8fafc', width: '100%' }} value={form.disease} onChange={e => handleDiseaseChange(e.target.value)}>
              {DISEASES.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label style={{ fontSize: '13px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Kritik Eşik</label><input className="input" style={{ background: '#f8fafc', width: '100%' }} type="number" value={form.thresholdValue} onChange={e => setForm(f => ({ ...f, thresholdValue: Number(e.target.value) }))} /></div>
            <div><label style={{ fontSize: '13px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Birim</label><input className="input" style={{ background: '#e2e8f0', width: '100%', color: '#64748b' }} value={form.thresholdLabel} readOnly /></div>
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>İletişim/Takip Kanalı</label>
            <select className="input" style={{ background: '#f8fafc', width: '100%' }} value={form.literacyLevel} onChange={e => setForm(f => ({ ...f, literacyLevel: e.target.value }))}>
              <option value="LITERATE">Akıllı Mesaj / SMS</option>
              <option value="ILLITERATE">Yapay Zeka Destekli Sesli Arama</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          <button onClick={onClose} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', background: '#f1f5f9', color: '#475569' }}>Vazgeç</button>
          <button onClick={handleSubmit} disabled={saving || !form.name || !form.phone} className="btn btn-primary" style={{ flex: 2, justifyContent: 'center', background: '#2563eb' }}>
            {saving ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Kaydediliyor…</> : <><UserPlus size={16} /> Hastayı Sisteme Ekle</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Patient card (Light Mode) ────────────────────────────────────────────────
function PatientCard({ p, delay = 0, selected, onSelect }: { p: any; delay?: number; selected?: boolean; onSelect?: (id: string) => void }) {
  const hasAlert  = p.alerts?.length > 0;
  const color     = getColor(p.disease);
  const lastValue = p.responses?.[0]?.value;
  const healthPct = hasAlert ? 28 :
    lastValue !== null && lastValue !== undefined
      ? Math.max(10, Math.min(100, 100 - Math.round(Math.abs(lastValue - p.thresholdValue) / p.thresholdValue * 80)))
      : p.isActive ? 75 : 45;

  return (
    <div style={{ position: 'relative' }}>
      <Link
        href={"/dashboard/patients/" + p.id}
        className={"card animate-in " + (selected ? "selected-card" : "")}
        style={{ 
          display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px', 
          textDecoration: 'none', animationDelay: delay + "s", position: 'relative', overflow: 'hidden', 
          border: selected ? '2px solid #2563eb' : '1px solid rgba(0,0,0,0.06)',
          background: selected ? '#eff6ff' : '#ffffff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}
      >
        {/* Top */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: color + "15", display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, color, flexShrink: 0 }}>
              {p.name[0]}
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{p.name}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                <Phone size={10} />{p.phone}
              </div>
            </div>
          </div>
          {hasAlert
            ? <div style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={12} />Kritik</div>
            : p.isActive
            ? <div style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} />Aktif</div>
            : <div style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: '#f1f5f9', color: '#64748b' }}>Pasif</div>}
        </div>

        {/* Disease */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: '#475569', fontWeight: 700 }}>{p.disease}</span>
          {p.doctor && <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>{p.doctor.name}</span>}
        </div>

        {/* Health bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Genel Sağlık Skoru</span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: hasAlert ? '#e11d48' : healthPct > 70 ? '#059669' : '#d97706' }}>{healthPct}%</span>
          </div>
          <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: healthPct + "%", background: hasAlert ? '#e11d48' : healthPct > 70 ? '#059669' : '#d97706', borderRadius: '3px', transition: 'width 1s ease-in-out' }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>
            Son İşlem: {p.responses?.[0] ? new Date(p.responses[0].respondedAt).toLocaleDateString('tr-TR') : 'Kayıt Bekleniyor'}
          </span>
          <ChevronRight size={16} color="#94a3b8" />
        </div>
      </Link>
      
      {/* Selection Overlay */}
      {onSelect && (
        <div 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSelect(p.id); }}
          style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, cursor: 'pointer', padding: '6px' }}
        >
          <div style={{
            width: '24px', height: '24px', borderRadius: '6px',
            border: "2px solid " + (selected ? '#2563eb' : '#cbd5e1'),
            background: selected ? '#2563eb' : '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {selected && <CheckCircle size={14} color="#ffffff" style={{ strokeWidth: 4 }} />}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function PatientsPage() {
  const router = useRouter();
  const [patients,  setPatients]  = useState<any[]>([]);
  const [total,     setTotal]     = useState(0);
  const [totalPages,setTotalPages]= useState(1);
  const [page,      setPage]      = useState(1);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState('Tümü');
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 350);
  const abortRef = useRef<AbortController | null>(null);

  const fetchPatients = useCallback(async (pg: number, srch: string, flt: string) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page:   String(pg),
        limit:  String(PAGE_SIZE),
        search: srch,
        filter: flt,
      });
      const res  = await fetch("/api/patients?" + params.toString(), { signal: abortRef.current.signal });
      const data = await res.json();
      setPatients(data.patients ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (e: any) {
      if (e.name !== 'AbortError') console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
    fetchPatients(1, debouncedSearch, filter);
  }, [debouncedSearch, filter, fetchPatients]);

  useEffect(() => {
    fetchPatients(page, debouncedSearch, filter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const critCount   = patients.filter(p => p.alerts?.length > 0).length;
  const activeCount = patients.filter(p => p.isActive && !p.alerts?.length).length;

  const handleSelectAll = () => {
    if (selectedIds.length === patients.length && patients.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(patients.map(p => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkSMS = async () => {
    if (selectedIds.length === 0) return;
    setBulkActionLoading(true);
    setTimeout(() => {
      alert(selectedIds.length + " hastaya başarıyla işlem uygulandı.");
      setSelectedIds([]);
      setBulkActionLoading(false);
    }, 1500);
  };

  const handleExportCSV = () => {
    alert("Dışa aktarım başlıyor...");
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px', marginBottom: '6px' }}>Hastalarımız</h1>
          <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
            {loading ? "Sistem yükleniyor…" : total + " kayıtlık hasta havuzu • Sayfa " + page + " / " + totalPages}
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ height: '44px', padding: '0 20px', borderRadius: '12px', fontSize: '14px' }}>
          <Plus size={18} /> Yeni Hasta Ekle
        </button>
      </div>

      {/* Stats strip */}
      <div className="animate-in delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { icon: Users,         val: total,      label: 'Sistemdeki Toplam',  color: '#2563eb', dim: '#eff6ff' },
          { icon: AlertTriangle, val: critCount,   label: 'Görünür Kritik Risk', color: '#e11d48', dim: '#fff1f2' },
          { icon: CheckCircle,   val: activeCount, label: 'Sorunsuz / Stabil',  color: '#059669', dim: '#ecfdf5' },
        ].map(({ icon: Icon, val, label, color, dim }) => (
          <div key={label} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: dim, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', fontWeight: 600 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="card animate-in delay-2" style={{ padding: '16px 20px', display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} size={18} />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input" style={{ paddingLeft: '44px', width: '100%', height: '44px', background: '#f8fafc' }} placeholder="T.C. No, Hasta Adı veya Hastalık arayın..." />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={16} /></button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} className="btn btn-sm"
              style={{ 
                height: '40px', padding: '0 16px',
                background: filter === f ? (f === 'Kritik' ? '#fff1f2' : '#eff6ff') : '#f8fafc', 
                color: filter === f ? (f === 'Kritik' ? '#e11d48' : '#2563eb') : '#64748b', 
                border: '1px solid ' + (filter === f ? (f === 'Kritik' ? 'rgba(225,29,72,0.2)' : 'rgba(37,99,235,0.2)') : 'rgba(0,0,0,0.05)'),
                fontWeight: filter === f ? 700 : 500
              }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="animate-in delay-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '16px 20px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={handleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#1e40af', fontSize: '14px', fontWeight: 700 }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '6px', border: '2px solid #2563eb', background: selectedIds.length === patients.length ? '#2563eb' : '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedIds.length === patients.length && <CheckCircle size={14} color="#ffffff" style={{ strokeWidth: 4 }} />}
              </div>
              Tümünü Seç / Temizle
            </button>
            <span style={{ fontSize: '13px', color: '#1e40af', background: '#dbeafe', padding: '4px 12px', borderRadius: '20px', fontWeight: 700 }}>
              {selectedIds.length} hasta seçildi
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleBulkSMS} disabled={bulkActionLoading} className="btn btn-primary btn-sm" style={{ padding: '8px 16px', background: '#2563eb' }}>
              {bulkActionLoading ? <Loader2 size={16} className="spin" /> : <Send size={16} />} 
              Toplu İşlem
            </button>
            <button onClick={handleExportCSV} className="btn btn-ghost btn-sm" style={{ padding: '8px 16px', background: '#ffffff', color: '#475569', border: '1px solid #cbd5e1' }}>
              <Download size={16} /> Listeyi Dışa Aktar
            </button>
          </div>
        </div>
      )}

      {/* Patient Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '20px' }}>
          {[...Array(12)].map((_, i) => <div key={i} className="skeleton" style={{ height: '200px', borderRadius: '16px', background: '#f1f5f9' }} />)}
        </div>
      ) : patients.length === 0 ? (
        <div className="card" style={{ padding: '80px', textAlign: 'center', background: '#ffffff', border: '1px dashed #cbd5e1' }}>
          <Users size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
          <div style={{ color: '#475569', fontSize: '16px', fontWeight: 600 }}>
            {search || filter !== 'Tümü' ? 'Arama kriterlerinize uygun hasta sistemde bulunamadı.' : 'Kliniğe henüz kayıtlı hasta yok.'}
          </div>
          {!search && filter === 'Tümü' && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-flex', padding: '12px 24px' }}>
              <Plus size={18} /> İlk Hastayı Sisteme Kaydet
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '20px' }}>
          {patients.map((p, i) => (
            <PatientCard 
              key={p.id} 
              p={p} 
              delay={i * 0.02} 
              selected={selectedIds.includes(p.id)}
              onSelect={handleToggleSelect}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '40px' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn btn-ghost"
            style={{ opacity: page === 1 ? 0.4 : 1, background: '#ffffff', border: '1px solid #cbd5e1' }}
          >
            <ChevronLeft size={18} /> Önceki
          </button>

          <div style={{ display: 'flex', gap: '6px' }}>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pg: number;
              if (totalPages <= 7) pg = i + 1;
              else if (page <= 4) pg = i + 1;
              else if (page >= totalPages - 3) pg = totalPages - 6 + i;
              else pg = page - 3 + i;

              return (
                <button key={pg} onClick={() => setPage(pg)} className="btn"
                  style={{ 
                    minWidth: '40px', height: '40px', justifyContent: 'center', borderRadius: '10px',
                    background: page === pg ? '#2563eb' : '#ffffff',
                    color: page === pg ? '#ffffff' : '#64748b',
                    border: '1px solid ' + (page === pg ? '#2563eb' : '#e2e8f0'),
                    fontWeight: page === pg ? 800 : 600,
                  }}>
                  {pg}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn btn-ghost"
            style={{ opacity: page === totalPages ? 0.4 : 1, background: '#ffffff', border: '1px solid #cbd5e1' }}
          >
            Sonraki <ChevronRight size={18} />
          </button>
        </div>
      )}

      {showModal && (
        <AddPatientModal
          onClose={() => setShowModal(false)}
          onAdded={id => { setShowModal(false); router.push('/dashboard/patients/' + id); }}
        />
      )}
    </div>
  );
}
