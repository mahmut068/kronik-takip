import React, { useState } from 'react';
import { Users, Stethoscope, PhoneCall, Mail, Search, Filter, HeartPulse, Building2, Bed, Truck } from 'lucide-react';

const DEPARTMENTS = ['Tümü', 'Kardiyoloji', 'Nöroloji', 'Dahiliye', 'Acil Servis', 'Onkoloji'];
const STATUSES = ['Tümü', 'Çevrimiçi', 'Ameliyatta', 'İzinli', 'Meşgul'];

const STAFF_DATA = [
  { id: 1, name: 'Prof. Dr. Sinan Yılmaz', title: 'Başhekim / Kardiyolog', dept: 'Kardiyoloji', status: 'Çevrimiçi', patients: 12, rating: 4.9, email: 'sinan@meditrack.com', phone: '+90 532 111 2233' },
  { id: 2, name: 'Uzm. Dr. Aylin Kaya', title: 'Nörolog', dept: 'Nöroloji', status: 'Ameliyatta', patients: 8, rating: 4.8, email: 'aylin@meditrack.com', phone: '+90 533 222 3344' },
  { id: 3, name: 'Dr. Mehmet Demir', title: 'Pratisyen Hekim', dept: 'Acil Servis', status: 'Meşgul', patients: 24, rating: 4.5, email: 'mehmet@meditrack.com', phone: '+90 534 333 4455' },
  { id: 4, name: 'Hemşire Zeynep Çelik', title: 'Sorumlu Hemşire', dept: 'Dahiliye', status: 'Çevrimiçi', patients: 45, rating: 4.7, email: 'zeynep@meditrack.com', phone: '+90 535 444 5566' },
  { id: 5, name: 'Uzm. Dr. Burak Tekin', title: 'Onkolog', dept: 'Onkoloji', status: 'İzinli', patients: 0, rating: 4.9, email: 'burak@meditrack.com', phone: '+90 536 555 6677' },
];

const RESOURCE_DATA = [
  { id: 'icu', label: 'Yoğun Bakım Üniteleri', icon: <HeartPulse size={24} />, total: 40, used: 32, color: 'var(--danger)' },
  { id: 'beds', label: 'Standart Yatak Kapasitesi', icon: <Bed size={24} />, total: 250, used: 180, color: 'var(--primary)' },
  { id: 'ambulance', label: 'Aktif Ambulanslar', icon: <Truck size={24} />, total: 12, used: 4, color: 'var(--success)' },
  { id: 'rooms', label: 'Ameliyathaneler', icon: <Building2 size={24} />, total: 8, used: 5, color: 'var(--warning)' },
];

const TeamManagement = ({ addNotification }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('Tümü');
  const [filterStatus, setFilterStatus] = useState('Tümü');

  const filteredStaff = STAFF_DATA.filter(staff => {
    const matchSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || staff.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = filterDept === 'Tümü' || staff.dept === filterDept;
    const matchStatus = filterStatus === 'Tümü' || staff.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Çevrimiçi': return { color: 'var(--success)', bg: 'rgba(16,185,129,0.15)', dot: '#10b981' };
      case 'Ameliyatta': return { color: 'var(--danger)', bg: 'rgba(239,68,68,0.15)', dot: '#ef4444' };
      case 'Meşgul': return { color: 'var(--warning)', bg: 'rgba(245,158,11,0.15)', dot: '#f59e0b' };
      case 'İzinli': return { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)', dot: '#9ca3af' };
      default: return { color: '#fff', bg: 'transparent', dot: '#fff' };
    }
  };

  const handleAction = (staffName, actionType) => {
    addNotification('info', `${staffName} için ${actionType} işlemi başlatıldı.`);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      {/* Header */}
      <div className="flex-between mb-4">
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Users size={36} color="var(--primary)" /> Personel & Kaynak Yönetimi
          </h1>
          <p className="text-muted">Hastane içi ekiplerin, departmanların ve klinik kaynakların canlı durumu.</p>
        </div>
      </div>

      {/* Resource KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {RESOURCE_DATA.map(res => {
          const percentage = Math.round((res.used / res.total) * 100);
          return (
            <div key={res.id} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ padding: '12px', background: `${res.color}22`, borderRadius: '12px', color: res.color }}>
                  {res.icon}
                </div>
                <h4 style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{res.label}</h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{res.used}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>/ {res.total}</span>
                <span style={{ marginLeft: 'auto', fontWeight: 'bold', color: percentage > 85 ? 'var(--danger)' : percentage > 60 ? 'var(--warning)' : 'var(--success)' }}>
                  %{percentage} Dolu
                </span>
              </div>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${percentage}%`, backgroundColor: res.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Filters */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <h3 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', marginRight: '12px' }}>
          <Filter size={20} color="var(--primary)" /> Ekip Filtreleri
        </h3>
        
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input type="text" className="glass-input" placeholder="Personel ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ paddingLeft: '36px', width: '240px' }} />
        </div>

        <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.5)', width: '180px' }} value={filterDept} onChange={e => setFilterDept(e.target.value)}>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d === 'Tümü' ? 'Tüm Departmanlar' : d}</option>)}
        </select>

        <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.5)', width: '180px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          {STATUSES.map(s => <option key={s} value={s}>{s === 'Tümü' ? 'Tüm Durumlar' : s}</option>)}
        </select>
      </div>

      {/* Staff Grid */}
      {filteredStaff.length === 0 ? (
        <div className="glass-panel flex-center" style={{ padding: '60px', color: 'var(--text-muted)', flexDirection: 'column', gap: '12px' }}>
          <Users size={48} style={{ opacity: 0.3 }} />
          <p>Kriterlere uygun personel bulunamadı.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredStaff.map(staff => {
            const styles = getStatusStyle(staff.status);
            return (
              <div key={staff.id} className="glass-panel animate-fade-in task-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Stethoscope size={24} color="var(--primary)" />
                    </div>
                    <div>
                      <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '4px' }}>{staff.name}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{staff.title} · {staff.dept}</p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '8px', background: styles.bg, width: 'fit-content', marginBottom: '20px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: styles.dot, boxShadow: `0 0 8px ${styles.dot}` }} />
                  <span style={{ color: styles.color, fontSize: '0.85rem', fontWeight: 600 }}>{staff.status}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Aktif Hasta Sayısı</span>
                    <strong style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{staff.patients}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Hasta Memnuniyeti</span>
                    <strong style={{ color: 'var(--warning)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ⭐ {staff.rating}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleAction(staff.name, 'Arama')} className="glass-button" style={{ flex: 1, justifyContent: 'center', color: '#3b82f6', background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.3)' }}>
                    <PhoneCall size={16} /> Ara
                  </button>
                  <button onClick={() => handleAction(staff.name, 'Mesajlaşma')} className="glass-button" style={{ flex: 1, justifyContent: 'center', color: '#10b981', background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)' }}>
                    <Mail size={16} /> Mesaj
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
