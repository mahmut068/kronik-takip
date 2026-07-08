import React, { useState } from 'react';
import { FileText, Plus, Trash2, Edit3, Save, X, User, Clock } from 'lucide-react';

const NOTE_TYPES = [
  { key: 'S', label: 'Subjektif', color: '#3b82f6', desc: 'Hastanın ifade ettiği şikayetler' },
  { key: 'O', label: 'Objektif',  color: '#10b981', desc: 'Ölçüm ve gözlem bulguları' },
  { key: 'A', label: 'Analiz',    color: '#f59e0b', desc: 'Klinik değerlendirme ve tanı' },
  { key: 'P', label: 'Plan',      color: '#8b5cf6', desc: 'Tedavi planı ve sonraki adımlar' },
];

const TAGS = ['Acil', 'Rutin', 'İlaç', 'Kontrol', 'Lab', 'Tele-Tıp'];

const initialNotes = [
  {
    id: 1, patientId: 1, patientName: 'Ahmet Yılmaz', createdAt: '2026-07-04 09:15',
    tags: ['Rutin', 'İlaç'],
    S: 'Hasta baş dönmesi ve halsizlik hissinden şikayetçi.',
    O: 'TA: 148/92 mmHg. Nabız: 78 bpm. Vücut ısısı normal.',
    A: 'Hipertansiyon kontrol altında değil. Yeni ilaç dozu gerekebilir.',
    P: 'Amlodipin 10mg başlandı. 1 hafta sonra kontrol randevusu.',
  },
  {
    id: 2, patientId: 2, patientName: 'Ayşe Kaya', createdAt: '2026-07-05 14:30',
    tags: ['Kontrol', 'Lab'],
    S: 'Hasta yorgunluk ve sık idrara çıkma bildirdi.',
    O: 'AKŞ: 187 mg/dL. HbA1c: %7.4.',
    A: 'Diyabet kontrolü yetersiz. Diyet uyumsuzluğu şüphesi.',
    P: 'Metformin dozu artırıldı. Diyetisyen konsültasyonu istendi.',
  },
];

const PatientNotes = ({ patients, addNotification }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterPatient, setFilterPatient] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ patientId: '', S: '', O: '', A: '', P: '', tags: [] });

  const resetForm = () => {
    setForm({ patientId: patients[0]?.id || '', S: '', O: '', A: '', P: '', tags: [] });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!form.patientId || (!form.S && !form.O && !form.A && !form.P)) return;
    const patient = patients.find(p => p.id === parseInt(form.patientId));
    if (editingId) {
      setNotes(prev => prev.map(n => n.id === editingId ? { ...n, ...form, patientName: patient?.name, updatedAt: new Date().toLocaleString('tr-TR') } : n));
      addNotification('success', `${patient?.name} için SOAP notu güncellendi.`);
    } else {
      const note = { id: Date.now(), patientId: parseInt(form.patientId), patientName: patient?.name || '', createdAt: new Date().toLocaleString('tr-TR'), tags: form.tags, S: form.S, O: form.O, A: form.A, P: form.P };
      setNotes(prev => [note, ...prev]);
      addNotification('success', `${patient?.name} için yeni SOAP notu oluşturuldu.`);
    }
    resetForm();
  };

  const handleEdit = (note) => {
    setForm({ patientId: note.patientId, S: note.S, O: note.O, A: note.A, P: note.P, tags: note.tags || [] });
    setEditingId(note.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    addNotification('info', 'Klinik not silindi.');
  };

  const toggleTag = (tag) => {
    setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }));
  };

  const filtered = notes.filter(n => {
    const matchPatient = filterPatient === 'all' || n.patientId === parseInt(filterPatient);
    const matchTag = filterTag === 'all' || (n.tags || []).includes(filterTag);
    const matchSearch = !searchTerm || [n.S, n.O, n.A, n.P, n.patientName].some(t => t?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchPatient && matchTag && matchSearch;
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div className="flex-between mb-4">
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <FileText size={36} color="var(--primary)" /> Klinik Notlar
          </h1>
          <p className="text-muted">SOAP formatında klinik not oluşturun, düzenleyin ve arayın.</p>
        </div>
        <button className="glass-button primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ patientId: patients[0]?.id || '', S: '', O: '', A: '', P: '', tags: [] }); }}>
          <Plus size={20} /> Yeni Not
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {NOTE_TYPES.map(nt => (
          <div key={nt.key} className="glass-panel" style={{ padding: '16px 20px', borderLeft: `4px solid ${nt.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: nt.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: nt.color, fontSize: '1.1rem' }}>{nt.key}</div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{nt.label}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0.7 }}>{nt.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SOAP Form */}
      {showForm && (
        <div className="glass-panel animate-fade-in" style={{ padding: '28px', marginBottom: '32px', borderColor: 'rgba(0,229,255,0.3)' }}>
          <div className="flex-between" style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} /> {editingId ? 'Notu Düzenle' : 'Yeni SOAP Notu'}
            </h3>
            <button onClick={resetForm} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
          </div>

          {/* Patient Select */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Hasta *</label>
            <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.5)', maxWidth: '320px' }}
              value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name} — {p.disease}</option>)}
            </select>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Etiketler</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {TAGS.map(tag => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)}
                  style={{ padding: '4px 12px', borderRadius: '20px', border: '1px solid', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s',
                    borderColor: form.tags.includes(tag) ? 'var(--primary)' : 'var(--glass-border)',
                    background: form.tags.includes(tag) ? 'rgba(0,229,255,0.15)' : 'transparent',
                    color: form.tags.includes(tag) ? 'var(--primary)' : 'var(--text-muted)' }}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* SOAP Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            {NOTE_TYPES.map(nt => (
              <div key={nt.key}>
                <label style={{ color: nt.color, fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '6px', background: nt.color + '22', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>{nt.key}</span>
                  {nt.label} — <span style={{ fontWeight: 400, opacity: 0.7 }}>{nt.desc}</span>
                </label>
                <textarea
                  className="glass-input"
                  rows={3}
                  placeholder={`${nt.label} notlarını girin...`}
                  value={form[nt.key]}
                  onChange={e => setForm({ ...form, [nt.key]: e.target.value })}
                  style={{ resize: 'vertical', borderColor: form[nt.key] ? nt.color + '66' : 'var(--glass-border)' }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="glass-button" onClick={resetForm}>İptal</button>
            <button className="glass-button primary" onClick={handleSave}>
              <Save size={16} /> {editingId ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <input className="glass-input" placeholder="Not içinde ara..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)} style={{ paddingLeft: '12px', width: '220px' }} />
        </div>
        <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.5)', width: '220px' }}
          value={filterPatient} onChange={e => setFilterPatient(e.target.value)}>
          <option value="all">Tüm Hastalar</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['all', ...TAGS].map(tag => (
            <button key={tag} onClick={() => setFilterTag(tag)}
              style={{ padding: '6px 12px', border: '1px solid', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif',
                borderColor: filterTag === tag ? 'var(--primary)' : 'var(--glass-border)',
                background: filterTag === tag ? 'rgba(0,229,255,0.1)' : 'transparent',
                color: filterTag === tag ? 'var(--primary)' : 'var(--text-muted)' }}>
              {tag === 'all' ? '🏷 Tümü' : tag}
            </button>
          ))}
        </div>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>{filtered.length} not gösteriliyor</p>

      {/* Notes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.length === 0 ? (
          <div className="glass-panel flex-center" style={{ padding: '60px', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)' }}>
            <FileText size={48} style={{ opacity: 0.3 }} />
            <p>Not bulunamadı. Yeni not oluşturmak için "Yeni Not" butonuna tıklayın.</p>
          </div>
        ) : filtered.map(note => (
          <div key={note.id} className="glass-panel animate-fade-in" style={{ padding: '24px' }}>
            {/* Note Header */}
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} color="var(--primary)" />
                  <strong style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>{note.patientName}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  <Clock size={13} /> {note.createdAt}
                  {note.updatedAt && <span style={{ color: '#f59e0b' }}>· (güncellendi)</span>}
                </div>
                {(note.tags || []).map(tag => (
                  <span key={tag} style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.73rem', background: 'rgba(0,229,255,0.1)', color: 'var(--primary)', border: '1px solid rgba(0,229,255,0.3)' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEdit(note)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  <Edit3 size={17} />
                </button>
                <button onClick={() => handleDelete(note.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  <Trash2 size={17} />
                </button>
              </div>
            </div>

            {/* SOAP Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {NOTE_TYPES.filter(nt => note[nt.key]).map(nt => (
                <div key={nt.key} style={{ padding: '14px', borderRadius: '10px', background: nt.color + '0d', border: `1px solid ${nt.color}33` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '6px', background: nt.color + '33', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: nt.color }}>{nt.key}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: nt.color }}>{nt.label}</span>
                  </div>
                  <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.5 }}>{note[nt.key]}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientNotes;
