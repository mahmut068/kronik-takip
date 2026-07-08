import React, { useState } from 'react';
import { CalendarDays, Plus, Clock, Stethoscope, Trash2, CheckCircle } from 'lucide-react';

const APPOINTMENT_TYPES = [
  'Kontrol Muayenesi',
  'Kan Tahlili',
  'Tansiyon Takibi',
  'Diyabet Kontrolü',
  'Beslenme Danışmanlığı',
  'Tele-Tıp Görüşmesi',
];

const AppointmentManager = ({ patients, addNotification, appointments = [], setAppointments }) => {
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [newAppt, setNewAppt] = useState({
    patientId: '',
    type: APPOINTMENT_TYPES[0],
    date: '',
    time: '09:00',
    note: '',
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === parseInt(newAppt.patientId));
    if (!patient || !newAppt.date) return;
    const appt = {
      id: Date.now(),
      patientId: patient.id,
      patientName: patient.name,
      type: newAppt.type,
      date: newAppt.date,
      time: newAppt.time,
      status: 'upcoming',
      note: newAppt.note,
    };
    setAppointments(prev => [...prev, appt]);
    addNotification('info', `${patient.name} için "${newAppt.type}" randevusu oluşturuldu: ${newAppt.date}`);
    setNewAppt({ patientId: '', type: APPOINTMENT_TYPES[0], date: '', time: '09:00', note: '' });
    setShowForm(false);
  };

  const toggleStatus = (id) => {
    setAppointments(prev => prev.map(a =>
      a.id === id ? { ...a, status: a.status === 'upcoming' ? 'completed' : 'upcoming' } : a
    ));
  };

  const remove = (id) => setAppointments(prev => prev.filter(a => a.id !== id));

  const filtered = appointments.filter(a => filterStatus === 'all' ? true : a.status === filterStatus);
  const sorted = [...filtered].sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));

  const upcoming = appointments.filter(a => a.status === 'upcoming').length;
  const completed = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex-between mb-4">
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <CalendarDays size={36} color="var(--primary)" /> Randevu Yönetimi
          </h1>
          <p className="text-muted">Hasta randevularını planlayın, takip edin ve yönetin.</p>
        </div>
        <button className="glass-button primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Randevu Oluştur
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '14px', background: 'rgba(0,229,255,0.15)', borderRadius: '50%' }}>
            <Clock size={28} color="var(--primary)" />
          </div>
          <div>
            <p className="text-muted">Bekleyen Randevu</p>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)' }}>{upcoming}</h2>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '14px', background: 'rgba(16,185,129,0.15)', borderRadius: '50%' }}>
            <CheckCircle size={28} color="var(--success)" />
          </div>
          <div>
            <p className="text-muted">Tamamlanan</p>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--success)' }}>{completed}</h2>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="glass-panel animate-fade-in" style={{ padding: '28px', marginBottom: '32px' }}>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Stethoscope size={20} color="var(--primary)" /> Yeni Randevu
          </h3>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Hasta</label>
              <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} required value={newAppt.patientId} onChange={e => setNewAppt({ ...newAppt, patientId: e.target.value })}>
                <option value="">Hasta Seçin</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Randevu Türü</label>
              <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} value={newAppt.type} onChange={e => setNewAppt({ ...newAppt, type: e.target.value })}>
                {APPOINTMENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Tarih</label>
              <input type="date" className="glass-input" required style={{ colorScheme: 'dark' }} value={newAppt.date} onChange={e => setNewAppt({ ...newAppt, date: e.target.value })} />
            </div>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Saat</label>
              <input type="time" className="glass-input" style={{ colorScheme: 'dark' }} value={newAppt.time} onChange={e => setNewAppt({ ...newAppt, time: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Not (İsteğe Bağlı)</label>
              <input type="text" className="glass-input" placeholder="Randevuya dair not..." value={newAppt.note} onChange={e => setNewAppt({ ...newAppt, note: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="glass-button primary">Randevuyu Kaydet</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        {['all', 'upcoming', 'completed'].map(f => (
          <button key={f} onClick={() => setFilterStatus(f)}
            style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid var(--glass-border)', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '0.95rem', transition: 'all 0.2s',
              background: filterStatus === f ? 'var(--primary-dark)' : 'var(--glass-bg)', color: filterStatus === f ? '#fff' : 'var(--text-muted)' }}>
            {f === 'all' ? 'Tümü' : f === 'upcoming' ? '⏳ Bekleyen' : '✅ Tamamlanan'}
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sorted.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Randevu bulunamadı.</div>
        ) : sorted.map(appt => (
          <div key={appt.id} className="glass-panel animate-fade-in"
            style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: `4px solid ${appt.status === 'completed' ? 'var(--success)' : 'var(--primary)'}`, opacity: appt.status === 'completed' ? 0.7 : 1 }}>
            <div style={{ padding: '12px', background: appt.status === 'completed' ? 'rgba(16,185,129,0.15)' : 'rgba(0,229,255,0.1)', borderRadius: '50%' }}>
              {appt.status === 'completed' ? <CheckCircle size={28} color="var(--success)" /> : <CalendarDays size={28} color="var(--primary)" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                <strong style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{appt.patientName}</strong>
                <span style={{ fontSize: '0.8rem', padding: '2px 10px', borderRadius: '20px', background: 'rgba(0,229,255,0.15)', color: 'var(--primary)' }}>{appt.type}</span>
              </div>
              <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span><CalendarDays size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{appt.date}</span>
                <span><Clock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{appt.time}</span>
              </div>
              {appt.note && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px', fontStyle: 'italic' }}>📝 {appt.note}</p>}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => toggleStatus(appt.id)} className="glass-button"
                style={{ padding: '8px 14px', background: appt.status === 'upcoming' ? 'rgba(16,185,129,0.2)' : 'rgba(0,0,0,0.2)', borderColor: appt.status === 'upcoming' ? 'var(--success)' : 'var(--glass-border)', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                {appt.status === 'upcoming' ? '✓ Tamamla' : '↩ Geri Al'}
              </button>
              <button onClick={() => remove(appt.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentManager;
