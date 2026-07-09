'use client';

import { useState } from 'react';
import {
  FileText, Download, Calendar, Filter, CheckCircle,
  Users, AlertTriangle, BarChart2, FileDown, Printer,
  Eye, Clock, TrendingUp, Shield, Plus, Database, Settings, RefreshCw
} from 'lucide-react';

const RECENT_REPORTS = [
  { id: '1', title: 'Aylık Klinik Özet (Temmuz)', type: 'Klinik Analitik', date: '08 Tem 2026', format: 'PDF', size: '2.4 MB', status: 'ready', icon: BarChart2, color: '#00e5ff' },
  { id: '2', title: 'Hipertansiyon Risk Analizi', type: 'YZ Raporu', date: '05 Tem 2026', format: 'XLSX', size: '1.1 MB', status: 'ready', icon: AlertTriangle, color: '#f43f5e' },
  { id: '3', title: 'Hasta Adherence (Uyum) Oranları', type: 'Takip', date: '01 Tem 2026', format: 'PDF', size: '3.8 MB', status: 'ready', icon: Users, color: '#10b981' },
  { id: '4', title: 'Sistem Logları & Denetim', type: 'Güvenlik', date: '30 Haz 2026', format: 'CSV', size: '840 KB', status: 'ready', icon: Shield, color: '#a78bfa' },
];

export default function ReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState('Klinik Özet');

  const handleDownload = (id: string) => {
    setDownloading(id);
    setSuccessMsg(null);
    setTimeout(() => {
      setDownloading(null);
      setSuccessMsg(`Rapor cihazınıza güvenli bir şekilde indirildi.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 1500);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setSuccessMsg(`"${reportType}" raporu oluşturuldu ve listeye eklendi.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 2500);
  };

  return (
    <div className="animate-in" style={{ paddingBottom: '40px' }}>
      
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f0f9ff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={30} color="#00e5ff" />
            Raporlama Merkezi
          </h1>
          <p style={{ color: '#8aafc7', marginTop: '6px', fontSize: '14px' }}>
            Klinik verileri analiz edin, özel raporlar oluşturun ve güvenli şekilde dışa aktarın.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="animate-in" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', marginBottom: '24px', color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
          <CheckCircle size={18} />
          {successMsg}
        </div>
      )}

      {/* ── Report Builder (Generator) ── */}
      <div className="card" style={{ padding: '32px', marginBottom: '32px', background: 'linear-gradient(135deg, rgba(8,14,26,0.95) 0%, rgba(11,22,38,0.9) 100%)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#e2f0f9', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={20} color="#00e5ff" />
          Özel Rapor Oluşturucu
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          
          {/* Data Module */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#8aafc7', marginBottom: '8px', fontWeight: 600 }}>Veri Modülü</label>
            <div style={{ position: 'relative' }}>
              <Database size={16} color="#4d6b82" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <select value={reportType} onChange={e => setReportType(e.target.value)} className="input" style={{ width: '100%', paddingLeft: '40px', appearance: 'none', background: 'rgba(0,0,0,0.2)', height: '44px' }}>
                <option value="Klinik Özet">Klinik Özet Raporu</option>
                <option value="Risk Analizi">YZ Risk Analizi (Kritik Vakalar)</option>
                <option value="Hasta Uyumu">Hasta Takip Uyumu</option>
                <option value="Sistem Logları">Güvenlik ve Sistem Logları</option>
              </select>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#8aafc7', marginBottom: '8px', fontWeight: 600 }}>Tarih Aralığı</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={16} color="#4d6b82" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <select className="input" style={{ width: '100%', paddingLeft: '40px', appearance: 'none', background: 'rgba(0,0,0,0.2)', height: '44px' }}>
                <option>Bu Ay (Temmuz 2026)</option>
                <option>Geçen Ay</option>
                <option>Son 3 Ay</option>
                <option>Yılbaşından Bugüne</option>
                <option>Özel Tarih Aralığı...</option>
              </select>
            </div>
          </div>

          {/* Format */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#8aafc7', marginBottom: '8px', fontWeight: 600 }}>Dışa Aktarım Formatı</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-ghost" style={{ flex: 1, height: '44px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,229,255,0.3)', color: '#00e5ff' }}>
                PDF (.pdf)
              </button>
              <button className="btn btn-ghost" style={{ flex: 1, height: '44px', background: 'rgba(255,255,255,0.02)' }}>
                Excel (.xlsx)
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={handleGenerate} disabled={generating} className="btn btn-primary" style={{ minWidth: '180px', justifyContent: 'center', height: '44px', fontSize: '14px' }}>
            {generating ? (
              <><div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Derleniyor...</>
            ) : (
              <><RefreshCw size={16} /> Raporu Derle</>
            )}
          </button>
        </div>
      </div>

      {/* ── Recent Reports List ── */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#e2f0f9', marginBottom: '20px' }}>İndirilebilir Rapor Arşivi</h3>
      
      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <th style={{ padding: '16px 24px', fontSize: '12px', color: '#4d6b82', fontWeight: 600 }}>RAPOR ADI</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', color: '#4d6b82', fontWeight: 600 }}>KATEGORİ</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', color: '#4d6b82', fontWeight: 600 }}>TARİH</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', color: '#4d6b82', fontWeight: 600 }}>BOYUT</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', color: '#4d6b82', fontWeight: 600, textAlign: 'right' }}>İŞLEM</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_REPORTS.map((rep, idx) => {
              const Icon = rep.icon;
              return (
                <tr key={rep.id} style={{ borderBottom: idx === RECENT_REPORTS.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }} className="hover:bg-white/5">
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${rep.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={18} color={rep.color} />
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#e2f0f9' }}>{rep.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: '#8aafc7' }}>{rep.type}</td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: '#8aafc7' }}>{rep.date}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div className="badge badge-muted" style={{ fontFamily: 'monospace' }}>{rep.size}</div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDownload(rep.id)}
                      className="btn btn-ghost btn-sm" 
                      style={{ padding: '8px 12px', background: 'rgba(0,229,255,0.08)', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.15)' }}
                    >
                      {downloading === rep.id ? (
                        <div className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px', borderColor: '#00e5ff', borderTopColor: 'transparent' }} />
                      ) : (
                        <><Download size={14} /> {rep.format}</>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
