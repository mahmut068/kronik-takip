import React, { useState } from 'react';
import { Microscope, FileText, Search, Eye, Download, Activity, Heart, Droplet, Bone } from 'lucide-react';

const CATEGORIES = ['Tümü', 'Biyokimya', 'Hematoloji', 'Radyoloji (Görüntüleme)', 'Kardiyoloji (EKG)'];

const LAB_REPORTS = [
  { id: 1, patientId: 1, patientName: 'Ahmet Yılmaz', category: 'Biyokimya', testName: 'Tam Kan Sayımı (Hemogram)', date: '2026-07-06 08:30', status: 'Sonuçlandı', doctor: 'Uzm. Dr. Aylin Kaya', isAbnormal: true,
    results: [
      { name: 'WBC (Lökosit)', value: '11.2', unit: '10^3/uL', ref: '4.0 - 10.0', abnormal: true },
      { name: 'RBC (Eritrosit)', value: '4.8', unit: '10^6/uL', ref: '4.5 - 5.5', abnormal: false },
      { name: 'Hemoglobin (HGB)', value: '14.5', unit: 'g/dL', ref: '13.0 - 17.0', abnormal: false },
    ]
  },
  { id: 2, patientId: 2, patientName: 'Ayşe Kaya', category: 'Biyokimya', testName: 'Diyabet Paneli (HbA1c & AKŞ)', date: '2026-07-05 10:15', status: 'Sonuçlandı', doctor: 'Prof. Dr. Sinan Yılmaz', isAbnormal: true,
    results: [
      { name: 'Açlık Kan Şekeri', value: '187', unit: 'mg/dL', ref: '70 - 100', abnormal: true },
      { name: 'HbA1c', value: '7.4', unit: '%', ref: '4.0 - 5.6', abnormal: true },
      { name: 'İnsülin (Açlık)', value: '18.5', unit: 'uU/mL', ref: '2.6 - 24.9', abnormal: false },
    ]
  },
  { id: 3, patientId: 3, patientName: 'Mehmet Demir', category: 'Kardiyoloji (EKG)', testName: 'Ekokardiyografi (ECHO)', date: '2026-07-04 14:00', status: 'Sonuçlandı', doctor: 'Prof. Dr. Sinan Yılmaz', isAbnormal: false,
    imagePlaceholder: 'EKG Trasesi: Normal Sinüs Ritmi',
    notes: 'Sol ventrikül ejeksiyon fraksiyonu (LVEF) %55. Kapak yapılarında patolojik bulgu saptanmadı.'
  },
  { id: 4, patientId: 1, patientName: 'Ahmet Yılmaz', category: 'Radyoloji (Görüntüleme)', testName: 'Akciğer Grafisi (PA)', date: '2026-07-06 09:45', status: 'İnceleniyor', doctor: 'Uzm. Dr. Burak Tekin', isAbnormal: false,
    imagePlaceholder: 'X-Ray Görüntüsü',
    notes: 'Radyolog raporu bekleniyor.'
  },
];

const LabResults = ({ patients: _patients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Tümü');
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports = LAB_REPORTS.filter(r => {
    const matchSearch = r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || r.testName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory === 'Tümü' || r.category === filterCategory;
    return matchSearch && matchCat;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Biyokimya': return <Droplet size={20} color="#3b82f6" />;
      case 'Hematoloji': return <Droplet size={20} color="#ef4444" />;
      case 'Radyoloji (Görüntüleme)': return <Bone size={20} color="#f59e0b" />;
      case 'Kardiyoloji (EKG)': return <Heart size={20} color="#10b981" />;
      default: return <Microscope size={20} color="var(--primary)" />;
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      {/* Header */}
      <div className="flex-between mb-4">
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Microscope size={36} color="var(--primary)" /> Laboratuvar ve Görüntüleme
          </h1>
          <p className="text-muted">Hastaların tahlil sonuçlarını, laboratuvar panellerini ve radyoloji raporlarını inceleyin.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedReport ? '1fr 400px' : '1fr', gap: '24px', transition: 'all 0.3s ease' }}>
        
        {/* Left Side: Report List */}
        <div>
          {/* Filters */}
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input type="text" className="glass-input" placeholder="Hasta veya test ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ paddingLeft: '36px', width: '240px' }} />
            </div>

            <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.5)', width: '220px' }} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredReports.map(report => (
              <div key={report.id} onClick={() => setSelectedReport(report)} className="glass-panel task-card"
                style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderLeft: report.isAbnormal ? '4px solid var(--danger)' : '4px solid transparent',
                  background: selectedReport?.id === report.id ? 'rgba(0,229,255,0.08)' : 'var(--glass-bg)',
                  borderColor: selectedReport?.id === report.id ? 'var(--primary)' : 'var(--glass-border)' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                    {getCategoryIcon(report.category)}
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '4px' }}>{report.patientName} — {report.testName}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <span>{report.date}</span>
                      <span>·</span>
                      <span>{report.category}</span>
                      <span>·</span>
                      <span style={{ color: report.status === 'Sonuçlandı' ? 'var(--success)' : 'var(--warning)' }}>{report.status}</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {report.isAbnormal && (
                    <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 600 }}>
                      Anormal Bulgular
                    </span>
                  )}
                  <button className="glass-button" style={{ background: 'transparent', border: 'none', color: 'var(--primary)' }}>
                    <Eye size={20} />
                  </button>
                </div>
              </div>
            ))}
            {filteredReports.length === 0 && (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Sonuç bulunamadı.</div>
            )}
          </div>
        </div>

        {/* Right Side: Report Details Panel */}
        {selectedReport && (
          <div className="glass-panel animate-fade-in" style={{ padding: '24px', position: 'sticky', top: '24px', height: 'fit-content', maxHeight: 'calc(100vh - 40px)', overflowY: 'auto' }}>
            <div className="flex-between" style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
              <h3 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="var(--primary)" /> Rapor Detayı
              </h3>
              <button className="glass-button" style={{ padding: '6px' }} onClick={() => setSelectedReport(null)}>✕</button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '4px' }}>{selectedReport.testName}</h2>
              <p style={{ color: 'var(--text-muted)' }}>Hasta: <strong style={{ color: 'var(--primary)' }}>{selectedReport.patientName}</strong></p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                <span className="compliance-badge" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>İsteyen: {selectedReport.doctor}</span>
                <span className="compliance-badge" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Tarih: {selectedReport.date}</span>
              </div>
            </div>

            {/* Results Table (if exists) */}
            {selectedReport.results && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px 8px 0 0', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span>Parametre</span>
                  <span>Sonuç</span>
                  <span>Ref. Aralığı</span>
                </div>
                {selectedReport.results.map((res, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', padding: '12px', borderBottom: '1px solid var(--glass-border)', background: res.abnormal ? 'rgba(239,68,68,0.05)' : 'transparent', color: 'var(--text-main)', fontSize: '0.9rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: 500 }}>{res.name}</span>
                    <span style={{ color: res.abnormal ? 'var(--danger)' : 'var(--text-main)', fontWeight: res.abnormal ? 700 : 400 }}>
                      {res.value} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.unit}</span>
                      {res.abnormal && <span style={{ color: 'var(--danger)', marginLeft: '6px' }}>↑</span>}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{res.ref}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Image / Notes (if exists) */}
            {selectedReport.imagePlaceholder && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ width: '100%', height: '180px', background: 'var(--glass-bg)', border: '1px dashed var(--glass-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: '8px' }}>
                  <Activity size={32} style={{ opacity: 0.5 }} />
                  {selectedReport.imagePlaceholder}
                </div>
              </div>
            )}

            {selectedReport.notes && (
              <div style={{ padding: '16px', background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '12px', color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--primary)' }}>Klinik Rapor / Yorum:</strong>
                {selectedReport.notes}
              </div>
            )}

            <button className="glass-button" style={{ width: '100%', justifyContent: 'center', marginTop: '24px', padding: '12px' }}>
              <Download size={18} /> PDF Olarak İndir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabResults;
