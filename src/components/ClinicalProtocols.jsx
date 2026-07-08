import React, { useState } from 'react';
import { ClipboardList, Plus, Trash2, Users, ChevronRight, ShieldCheck } from 'lucide-react';

const PROTOCOL_DEFINITIONS = [
  {
    id: 'hypertension',
    name: 'Hipertansiyon Takip Protokolü',
    description: 'Yüksek tansiyon hastaları için günlük ölçüm ve kardiyoloji kontrollerini içeren bakım planı.',
    severity: 'warning',
    color: '#f59e0b',
    tasks: [
      { title: 'Sabah büyük ve küçük tansiyon ölçümü', category: 'Ölçüm', priority: 'high', daysFromNow: 1 },
      { title: 'Akşam tansiyon ölçümü', category: 'Ölçüm', priority: 'normal', daysFromNow: 2 },
      { title: 'Tuzsuz diyet uyumu kontrolü', category: 'Diyet', priority: 'normal', daysFromNow: 3 },
      { title: 'Tansiyon ilacı sabah dozu alımı', category: 'İlaç Takibi', priority: 'urgent', daysFromNow: 1 },
    ],
    appointments: [
      { type: 'Kardiyoloji Kontrolü', daysFromNow: 14, time: '10:00', note: 'Genel tansiyon seyri değerlendirilecek.' }
    ]
  },
  {
    id: 'diabetes',
    name: 'Diyabet Bakım Planı',
    description: 'Tip-2 diyabet tanısı alan hastalar için HbA1c takibi ve kan şekeri ölçüm protokolü.',
    severity: 'danger',
    color: 'var(--danger)',
    tasks: [
      { title: 'Açlık kan şekeri ölçümü', category: 'Ölçüm', priority: 'high', daysFromNow: 1 },
      { title: 'Tokluk kan şekeri ölçümü', category: 'Ölçüm', priority: 'normal', daysFromNow: 1 },
      { title: 'Glukofaj 850mg akşam dozu alımı', category: 'İlaç Takibi', priority: 'urgent', daysFromNow: 2 },
      { title: 'Günlük 30 dakika yürüyüş', category: 'Egzersiz', priority: 'low', daysFromNow: 3 },
    ],
    appointments: [
      { type: 'Diyetisyen Kontrolü', daysFromNow: 7, time: '11:30', note: 'Karbonhidrat sayımı eğitimi.' },
      { type: 'Diyabet Polikliniği Randevusu', daysFromNow: 30, time: '14:00', note: 'HbA1c tahlili ile birlikte genel kontrol.' }
    ]
  },
  {
    id: 'heart_failure',
    name: 'Kalp Yetmezliği İzlem Protokolü',
    description: 'Kardiyak disfonksiyonu olan hastalarda ani kilo artışları ve ödem takibi için koruyucu protokol.',
    severity: 'danger',
    color: 'var(--danger)',
    tasks: [
      { title: 'Sabah aç karnına kilo ölçümü (Ödem takibi)', category: 'Ölçüm', priority: 'urgent', daysFromNow: 1 },
      { title: 'Sıvı kısıtlamasına uyum kontrolü (Maks 1.5L)', category: 'Diyet', priority: 'high', daysFromNow: 2 },
      { title: 'Diüretik ilaç alımı', category: 'İlaç Takibi', priority: 'urgent', daysFromNow: 1 },
    ],
    appointments: [
      { type: 'Ekokardiyografi (ECHO) Kontrolü', daysFromNow: 21, time: '09:00', note: 'EF değeri kontrol edilecek.' }
    ]
  },
  {
    id: 'copd',
    name: 'KOAH Yönetim Protokolü',
    description: 'Kronik Obstrüktif Akciğer Hastalığı seyri için SpO2 takibi ve nefes egzersizi programı.',
    severity: 'info',
    color: 'var(--primary)',
    tasks: [
      { title: 'Oksijen satürasyonu (SpO2) ölçümü', category: 'Ölçüm', priority: 'high', daysFromNow: 1 },
      { title: 'Triflo ile nefes egzersizi yapılması', category: 'Egzersiz', priority: 'normal', daysFromNow: 2 },
      { title: 'İnhaler kullanımı kontrolü', category: 'İlaç Takibi', priority: 'urgent', daysFromNow: 1 },
    ],
    appointments: [
      { type: 'Göğüs Hastalıkları Kontrolü', daysFromNow: 28, time: '15:00', note: 'Solunum fonksiyon testi (SFT) yapılacak.' }
    ]
  }
];

const ClinicalProtocols = ({ patients = [], setPatients, tasks = [], setTasks, appointments: _appointments = [], setAppointments, addNotification }) => {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedProtocolId, setSelectedProtocolId] = useState('hypertension');
  const [viewingProtocol, setViewingProtocol] = useState(PROTOCOL_DEFINITIONS[0]);

  const handleAssign = (e) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedProtocolId) return;

    const patient = patients.find(p => p.id === parseInt(selectedPatientId));
    const protocol = PROTOCOL_DEFINITIONS.find(p => p.id === selectedProtocolId);

    if (!patient || !protocol) return;

    // 1. Update patient with protocol name
    setPatients(prev => prev.map(p => {
      if (p.id === patient.id) {
        return {
          ...p,
          protocol: protocol.name,
          questions: [
            ...p.questions,
            ...protocol.tasks.filter(t => t.category === 'Ölçüm').map(t => t.title)
          ].slice(0, 3) // limit to 3 questions max
        };
      }
      return p;
    }));

    // 2. Add preset tasks
    const newTasks = protocol.tasks.map((t, idx) => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + t.daysFromNow);
      return {
        id: Date.now() + idx,
        patientId: patient.id,
        patientName: patient.name,
        title: t.title,
        category: t.category,
        priority: t.priority,
        done: false,
        dueDate: dueDate.toISOString().split('T')[0],
        createdAt: new Date().toLocaleTimeString()
      };
    });
    setTasks(prev => [...newTasks, ...prev]);

    // 3. Add preset appointments
    const newAppts = protocol.appointments.map((a, idx) => {
      const apptDate = new Date();
      apptDate.setDate(apptDate.getDate() + a.daysFromNow);
      return {
        id: Date.now() + 100 + idx,
        patientId: patient.id,
        patientName: patient.name,
        type: a.type,
        date: apptDate.toISOString().split('T')[0],
        time: a.time,
        status: 'upcoming',
        note: a.note
      };
    });
    setAppointments(prev => [...prev, ...newAppts]);

    addNotification('success', `${patient.name} için "${protocol.name}" başarıyla aktif edildi. ${newTasks.length} görev ve ${newAppts.length} randevu planlandı.`);
    setSelectedPatientId('');
  };

  const handleRemove = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const { protocol: _protocol, ...rest } = p;
        return rest;
      }
      return p;
    }));

    addNotification('info', `${patient.name} üzerinden bakım planı kaldırıldı.`);
  };

  // Helper: calculate progress for a patient
  const getPatientProgress = (patientId) => {
    const patientTasks = tasks.filter(t => t.patientId === patientId);
    if (patientTasks.length === 0) return 0;
    const completed = patientTasks.filter(t => t.done).length;
    return Math.round((completed / patientTasks.length) * 100);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      {/* Header */}
      <div className="flex-between mb-4">
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <ClipboardList size={36} color="var(--primary)" /> Klinik Protokoller & Bakım Planları
          </h1>
          <p className="text-muted">Hastalara kronik rahatsızlıklarına göre standartlaştırılmış klinik protokoller atayın ve uyumlarını izleyin.</p>
        </div>
      </div>

      {/* Grid: Left - Assign & Status, Right - Protocol Catalog */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
        
        {/* Left Side */}
        <div>
          {/* Assign Form */}
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 600 }}>
              <Plus size={20} /> Hastaya Tedavi Planı Tanımla
            </h3>
            <form onSubmit={handleAssign} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Hasta Seç *</label>
                <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} required value={selectedPatientId} onChange={e => setSelectedPatientId(e.target.value)}>
                  <option value="">Hasta seçin...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.disease}) {p.protocol ? `— [Aktif: ${p.protocol}]` : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Klinik Protokol *</label>
                <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} required value={selectedProtocolId} onChange={e => setSelectedProtocolId(e.target.value)}>
                  {PROTOCOL_DEFINITIONS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="glass-button primary" style={{ height: '46px', padding: '0 24px' }}>
                Planı Başlat
              </button>
            </form>
          </div>

          {/* Active Patients Table */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ color: 'var(--text-main)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 600 }}>
              <Users size={20} color="var(--primary)" /> Aktif Protokol Altındaki Hastalar
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'left' }}>
                    <th style={{ padding: '12px 8px' }}>Hasta</th>
                    <th style={{ padding: '12px 8px' }}>Aktif Protokol</th>
                    <th style={{ padding: '12px 8px' }}>Plan Uyum & İlerleme</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Aksiyon</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.filter(p => p.protocol).length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Şu an aktif bakım planına dahil edilmiş hasta bulunmamaktadır.
                      </td>
                    </tr>
                  ) : (
                    patients.filter(p => p.protocol).map(patient => {
                      const progress = getPatientProgress(patient.id);
                      return (
                        <tr key={patient.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '16px 8px', fontWeight: 500 }}>{patient.name}</td>
                          <td style={{ padding: '16px 8px' }}>
                            <span style={{ padding: '4px 10px', borderRadius: '12px', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', fontSize: '0.8rem', color: 'var(--primary)', display: 'inline-block' }}>
                              {patient.protocol}
                            </span>
                          </td>
                          <td style={{ padding: '16px 8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${progress}%`, height: '100%', background: progress === 100 ? 'var(--success)' : 'var(--primary)', borderRadius: '4px', transition: 'width 0.4s ease' }} />
                              </div>
                              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: progress === 100 ? 'var(--success)' : 'var(--text-main)', minWidth: '35px' }}>%{progress}</span>
                            </div>
                          </td>
                          <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                            <button onClick={() => handleRemove(patient.id)} className="glass-button" style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: 'var(--danger)', fontSize: '0.8rem' }}>
                              <Trash2 size={14} style={{ marginRight: '4px' }} /> Planı Bitir
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Protocol Details Catalog */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Catalog Cards */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ color: 'var(--text-main)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 600 }}>
              <ShieldCheck size={20} color="var(--primary)" /> Protokol Kataloğu
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {PROTOCOL_DEFINITIONS.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => setViewingProtocol(p)}
                  className="glass-panel protocol-card"
                  style={{ 
                    padding: '16px', 
                    cursor: 'pointer', 
                    borderLeft: `4px solid ${p.color}`, 
                    background: viewingProtocol.id === p.id ? 'rgba(0,229,255,0.08)' : 'var(--glass-bg)',
                    borderColor: viewingProtocol.id === p.id ? 'var(--primary)' : 'var(--glass-border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: 'var(--text-main)', fontSize: '1.05rem' }}>{p.name}</strong>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px', lineHeight: 1.4 }}>{p.description}</p>
                </div>
              ))}
            </div>

            {/* Selected Protocol Preset Preview */}
            {viewingProtocol && (
              <div className="animate-fade-in" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '16px', fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🎯 {viewingProtocol.name} İçeriği
                </h4>
                
                {/* Preset Tasks list */}
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Tanımlanacak Görevler:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {viewingProtocol.tasks.map((task, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-main)', padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: viewingProtocol.color }} />
                        <span style={{ flex: 1 }}>{task.title}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '1px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>{task.category}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preset Appointments list */}
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Planlanacak Randevular:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {viewingProtocol.appointments.map((appt, i) => (
                      <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-main)', padding: '8px 12px', background: 'rgba(0,229,255,0.04)', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <strong style={{ color: 'var(--primary)' }}>{appt.type}</strong>
                          <span style={{ color: 'var(--text-muted)' }}>{appt.daysFromNow}. Gün</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>Saat: {appt.time} | {appt.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
            
          </div>

        </div>

      </div>

    </div>
  );
};

export default ClinicalProtocols;
