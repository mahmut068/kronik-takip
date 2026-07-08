import React, { useState } from 'react';
import { FileDown, FileText, FileSpreadsheet, Download, Calendar, Filter, FileBarChart, CheckCircle, Clock } from 'lucide-react';

const REPORT_TYPES = [
  { id: 'patient_summary', label: 'Hasta Özeti ve Vitals', icon: <FileText size={18} /> },
  { id: 'clinical_notes', label: 'SOAP Klinik Notları', icon: <FileText size={18} /> },
  { id: 'analytics', label: 'AI Tahminsel Analizleri', icon: <FileBarChart size={18} /> },
  { id: 'tasks', label: 'Görev ve Uyum Raporu', icon: <CheckCircle size={18} /> },
];

const RECENT_REPORTS = [
  { id: 1, name: 'Ahmet Yılmaz - Aylık Özet', type: 'Hasta Özeti', format: 'PDF', date: '2026-07-05 16:30', status: 'ready', size: '1.2 MB' },
  { id: 2, name: 'Tüm Hastalar - AI Risk Analizi', type: 'Analitik', format: 'Excel', date: '2026-07-06 09:15', status: 'ready', size: '3.4 MB' },
  { id: 3, name: 'Ayşe Kaya - SOAP Notları', type: 'Klinik Notlar', format: 'PDF', date: '2026-07-06 14:20', status: 'ready', size: '840 KB' },
];

const ReportCenter = ({ patients, addNotification }) => {
  const [reports, setReports] = useState(RECENT_REPORTS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [form, setForm] = useState({
    type: 'patient_summary',
    patientId: 'all',
    dateRange: 'last_30_days',
    format: 'pdf',
  });

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate report generation delay
    setTimeout(() => {
      const patientName = form.patientId === 'all' ? 'Tüm Hastalar' : patients.find(p => p.id === parseInt(form.patientId))?.name || 'Bilinmeyen';
      const typeLabel = REPORT_TYPES.find(rt => rt.id === form.type)?.label || 'Rapor';
      
      const newReport = {
        id: Date.now(),
        name: `${patientName} - Sistem Raporu`,
        type: typeLabel,
        format: form.format.toUpperCase(),
        date: new Date().toLocaleString('tr-TR'),
        status: 'ready',
        size: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)} MB`
      };
      
      setReports([newReport, ...reports]);
      setIsGenerating(false);
      addNotification('success', `${newReport.name} başarıyla oluşturuldu ve indirmeye hazır.`);
    }, 2500);
  };

  const getFormatIcon = (format) => {
    if (format === 'PDF') return <FileText size={20} color="#ef4444" />;
    if (format === 'EXCEL' || format === 'CSV') return <FileSpreadsheet size={20} color="#10b981" />;
    return <FileDown size={20} color="var(--primary)" />;
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div className="flex-between mb-4">
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <FileDown size={36} color="var(--primary)" /> Raporlama Merkezi
          </h1>
          <p className="text-muted">Kurumsal hasta verilerini, analizleri ve klinik notları dışa aktarın.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Generate Report Form */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={20} color="var(--primary)" /> Rapor Parametreleri
          </h3>
          
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Report Type */}
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Rapor Türü</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {REPORT_TYPES.map(rt => (
                  <button key={rt.id} type="button" onClick={() => setForm({ ...form, type: rt.id })}
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif',
                      borderColor: form.type === rt.id ? 'var(--primary)' : 'var(--glass-border)',
                      background: form.type === rt.id ? 'rgba(0,229,255,0.1)' : 'transparent',
                      color: form.type === rt.id ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {rt.icon} {rt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Patient */}
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Kapsam (Hasta Seçimi)</label>
              <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}>
                <option value="all">Tüm Hastalar (Toplu Rapor)</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name} — {p.disease}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Date Range */}
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Tarih Aralığı</label>
                <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} value={form.dateRange} onChange={e => setForm({ ...form, dateRange: e.target.value })}>
                  <option value="today">Bugün</option>
                  <option value="last_7_days">Son 7 Gün</option>
                  <option value="last_30_days">Son 30 Gün</option>
                  <option value="this_year">Bu Yıl</option>
                </select>
              </div>

              {/* Format */}
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Dışa Aktarım Formatı</label>
                <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} value={form.format} onChange={e => setForm({ ...form, format: e.target.value })}>
                  <option value="pdf">PDF Dokümanı (.pdf)</option>
                  <option value="excel">Excel Tablosu (.xlsx)</option>
                  <option value="csv">CSV Verisi (.csv)</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={isGenerating} className="glass-button primary" style={{ marginTop: '10px', height: '48px', justifyContent: 'center', fontSize: '1rem', fontWeight: 600 }}>
              {isGenerating ? (
                <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}><Clock size={20} /></span> Rapor Hazırlanıyor...</>
              ) : (
                <><FileDown size={20} /> Raporu Oluştur</>
              )}
            </button>
          </form>
        </div>

        {/* Generated Reports List */}
        <div>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px' }}>
            <Calendar size={20} color="var(--primary)" /> Son Oluşturulan Raporlar
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reports.map((report) => (
              <div key={report.id} className="glass-panel animate-fade-in task-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                    {getFormatIcon(report.format)}
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text-main)', fontSize: '1.05rem', marginBottom: '4px' }}>{report.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> {report.date}
                      </span>
                      <span>·</span>
                      <span>{report.type}</span>
                      <span>·</span>
                      <span style={{ color: 'var(--primary)' }}>{report.size}</span>
                    </div>
                  </div>
                </div>
                
                <button className="glass-button" style={{ background: 'rgba(0,229,255,0.1)', borderColor: 'rgba(0,229,255,0.3)', color: 'var(--primary)' }}>
                  <Download size={18} />
                </button>
              </div>
            ))}
            {reports.length === 0 && (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Henüz rapor oluşturulmamış.
              </div>
            )}
          </div>
        </div>

      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ReportCenter;
