'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, ShieldOff, ShieldCheck, Mail, Phone, Stethoscope, Search } from 'lucide-react';

export default function DoctorsAdminPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', email: '', password: '', specialty: '', department: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/doctors');
      if (res.ok) {
        const data = await res.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error('Failed to fetch doctors', error);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/admin/doctors/${formData.id}` : '/api/admin/doctors';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        fetchDoctors();
      } else {
        const err = await res.json();
        alert('Hata: ' + err.error);
      }
    } catch (error) {
      console.error('Save failed', error);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    if (!confirm(`Doktoru ${currentStatus ? 'pasife almak' : 'aktifleştirmek'} istediğinize emin misiniz?`)) return;
    try {
      const res = await fetch(`/api/admin/doctors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) fetchDoctors();
    } catch (error) {
      console.error('Status toggle failed', error);
    }
  };

  const openNewModal = () => {
    setIsEditing(false);
    setFormData({ id: '', name: '', email: '', password: '', specialty: '', department: '', phone: '' });
    setShowModal(true);
  };

  const openEditModal = (doc: any) => {
    setIsEditing(true);
    setFormData({ ...doc, password: '' }); // Şifre boş gelir, değiştirilmek istenirse doldurulur
    setShowModal(true);
  };

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.email.toLowerCase().includes(search.toLowerCase()) ||
    (d.specialty && d.specialty.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#e2f0f9', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users color="#00e5ff" />
            Doktor Yönetim Merkezi
          </h1>
          <p style={{ color: '#8aafc7', fontSize: '14px' }}>
            Klinik doktorlarının hesaplarını oluşturun, düzenleyin ve sistem erişimlerini (KVKK) yönetin.
          </p>
        </div>
        
        <button 
          onClick={openNewModal}
          style={{
            background: 'linear-gradient(135deg, #00e5ff, #3b82f6)',
            color: '#000', border: 'none', padding: '10px 20px',
            borderRadius: '8px', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 15px rgba(0, 229, 255, 0.3)'
          }}
        >
          <Plus size={18} /> Yeni Doktor Ekle
        </button>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div style={{ 
            flex: 1, position: 'relative', 
            background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', padding: '0 15px'
          }}>
            <Search size={18} color="#4d6b82" />
            <input 
              type="text" 
              placeholder="Doktor adı, e-posta veya uzmanlık ara..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', padding: '12px 10px', fontSize: '14px'
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#8aafc7' }}>Yükleniyor...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#8aafc7', fontSize: '13px' }}>
                  <th style={{ padding: '12px 10px', fontWeight: 600 }}>Doktor Adı</th>
                  <th style={{ padding: '12px 10px', fontWeight: 600 }}>İletişim & Uzmanlık</th>
                  <th style={{ padding: '12px 10px', fontWeight: 600 }}>Kayıt Tarihi</th>
                  <th style={{ padding: '12px 10px', fontWeight: 600 }}>Durum</th>
                  <th style={{ padding: '12px 10px', fontWeight: 600, textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map(doc => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '15px 10px' }}>
                      <div style={{ fontWeight: 600, color: '#e2f0f9', fontSize: '15px' }}>{doc.name}</div>
                      <div style={{ color: '#4d6b82', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <Mail size={12} /> {doc.email}
                      </div>
                    </td>
                    <td style={{ padding: '15px 10px' }}>
                      <div style={{ color: '#00e5ff', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Stethoscope size={14} /> {doc.specialty || 'Belirtilmemiş'}
                      </div>
                      <div style={{ color: '#8aafc7', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                        <Phone size={12} /> {doc.phone || '-'}
                      </div>
                    </td>
                    <td style={{ padding: '15px 10px', color: '#8aafc7', fontSize: '13px' }}>
                      {new Date(doc.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td style={{ padding: '15px 10px' }}>
                      {doc.isActive ? (
                        <span style={{ padding: '4px 8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>AKTİF</span>
                      ) : (
                        <span style={{ padding: '4px 8px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>PASİF</span>
                      )}
                    </td>
                    <td style={{ padding: '15px 10px', textAlign: 'right' }}>
                      <button onClick={() => openEditModal(doc)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '10px' }} title="Düzenle">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => toggleStatus(doc.id, doc.isActive)} style={{ background: 'transparent', border: 'none', color: doc.isActive ? '#f43f5e' : '#10b981', cursor: 'pointer' }} title={doc.isActive ? "Pasife Al" : "Aktifleştir"}>
                        {doc.isActive ? <ShieldOff size={18} /> : <ShieldCheck size={18} />}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredDoctors.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#4d6b82' }}>Kayıtlı doktor bulunamadı.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card animate-scale-up" style={{ width: '500px', padding: '24px', position: 'relative' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#e2f0f9' }}>
              {isEditing ? 'Doktoru Düzenle' : 'Yeni Doktor Ekle'}
            </h2>
            
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#8aafc7', marginBottom: '6px' }}>Ad Soyad</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#8aafc7', marginBottom: '6px' }}>E-Posta (Giriş için)</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
              </div>

              {!isEditing && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8aafc7', marginBottom: '6px' }}>Şifre</label>
                  <input required minLength={6} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8aafc7', marginBottom: '6px' }}>Uzmanlık</label>
                  <input type="text" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#8aafc7', marginBottom: '6px' }}>Departman</label>
                  <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#8aafc7', marginBottom: '6px' }}>Telefon</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>İptal</button>
                <button type="submit" style={{ padding: '10px 20px', background: '#10b981', color: '#000', border: 'none', fontWeight: 700, borderRadius: '6px', cursor: 'pointer' }}>Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
