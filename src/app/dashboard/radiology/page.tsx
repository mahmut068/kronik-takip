'use client';

import { useState } from 'react';
import { Scan, Brain, UploadCloud, FileImage, AlertOctagon, CheckCircle2, ChevronRight, Zap, Image as ImageIcon } from 'lucide-react';

export default function RadiologyPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<null | 'success'>(null);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      setResult('success');
    }, 4000);
  };

  return (
    <div className="animate-in" style={{ paddingBottom: '60px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* ── Header ── */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px', color: '#0f172a', letterSpacing: '-0.5px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={24} color="#d97706" />
          </div>
          YZ Klinik Radyoloji ve Tarama Analizi
        </h1>
        <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', fontWeight: 500 }}>
          BT (Tomografi), MR ve Röntngen görüntülerini gelişmiş derin öğrenme modeli ile analiz edin.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* ── UPLOAD ── */}
        <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Yeni Tarama Yükle (DICOM / JPEG)</div>
          
          <div style={{ 
            flex: 1, 
            border: '2px dashed #cbd5e1', 
            borderRadius: '16px', 
            background: '#f8fafc',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
            gap: '16px', minHeight: '320px', cursor: 'pointer', transition: 'all 0.2s',
            position: 'relative'
          }}>
            {!analyzing && !result ? (
              <>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UploadCloud size={28} color="#64748b" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Görüntüleri Buraya Sürükleyin</div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>veya bilgisayarınızdan seçin</div>
                </div>
                <button onClick={handleAnalyze} className="btn btn-primary" style={{ marginTop: '16px', padding: '12px 24px', fontSize: '15px', fontWeight: 700 }}>
                  <Scan size={18} /> Görüntüyü Analiz Et
                </button>
              </>
            ) : analyzing ? (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                <div style={{ position: 'relative' }}>
                  {/* Fake scanning line over an icon */}
                  <div style={{ width: '120px', height: '120px', borderRadius: '16px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    <ImageIcon size={48} color="#94a3b8" />
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: '#2563eb', animation: 'scan 2s linear infinite', boxShadow: '0 4px 12px rgba(37,99,235,0.5)' }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#2563eb', marginBottom: '6px' }}>V10.0 Yapay Zeka Devrede</div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Kesitler inceleniyor, mikroskobik anomaliler taranıyor...</div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <CheckCircle2 size={40} color="#059669" />
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#059669', marginBottom: '6px' }}>Analiz Tamamlandı</div>
                <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500, marginBottom: '24px' }}>AI bulguları sağ panelde raporlandı.</div>
                <button onClick={() => setResult(null)} className="btn btn-ghost" style={{ border: '1px solid #cbd5e1', color: '#475569' }}>
                  Yeni Tarama
                </button>
              </div>
            )}
            
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes scan {
                0% { top: 0; opacity: 1; }
                50% { top: 100%; opacity: 0.5; }
                100% { top: 0; opacity: 1; }
              }
            `}} />
          </div>
        </div>

        {/* ── RESULTS ── */}
        <div className="card" style={{ padding: '32px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>YZ Analiz Raporu</h2>
            <div className="badge" style={{ background: '#eff6ff', color: '#2563eb', padding: '6px 12px', fontSize: '12px', fontWeight: 800 }}>V10 Engine</div>
          </div>

          {!result ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
              <FileImage size={48} color="#cbd5e1" />
              <div style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Analiz raporu burada görüntülenecektir.</div>
            </div>
          ) : (
            <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ padding: '20px', background: '#fff1f2', borderRadius: '16px', border: '1px solid #fecdd3' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <AlertOctagon size={24} color="#e11d48" />
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#e11d48' }}>Kritik Bulgu Tespit Edildi</span>
                </div>
                <p style={{ fontSize: '14px', color: '#be123c', lineHeight: '1.6', margin: 0, fontWeight: 500 }}>
                  Sağ akciğer alt lob superior segmentte, plevraya oturan yaklaşık 14x12 mm boyutlarında 
                  spiküle konturlu kitlesel lezyon imajı izlenmiştir. (Malignite şüphesi).
                </p>
              </div>

              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700, marginBottom: '16px' }}>ÖLÇÜMLER & SKORLAR</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'Lezyon Boyutu', val: '14x12 mm' },
                    { label: 'Hounsfield Ünitesi (HU)', val: '+45 HU' },
                    { label: 'Yapay Zeka Güven Skoru', val: '%92 Yüksek', highlight: true },
                    { label: 'RADS Kategori Önerisi', val: 'Lung-RADS 4B' }
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ color: '#475569', fontWeight: 500, fontSize: '14px' }}>{r.label}</span>
                      <span style={{ fontWeight: 800, color: r.highlight ? '#e11d48' : '#0f172a', fontSize: '14px' }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                <button className="btn" style={{ flex: 1, justifyContent: 'center', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '14px' }}>
                  Uzmana Konsülte Et
                </button>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', background: '#2563eb', fontWeight: 700, fontSize: '14px' }}>
                  Raporu Sisteme İşle
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
