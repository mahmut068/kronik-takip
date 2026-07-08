'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dna, HeartPulse, Activity, Zap, Brain, ShieldAlert,
  Database, Fingerprint, Loader2, PlayCircle, Syringe,
  Microscope, ScanLine, ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar, Legend
} from 'recharts';

// Animasyonlar ve özel CSS
const customCss = `
  .glass-panel {
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  }
  .neon-text {
    background: linear-gradient(to right, #00f2fe, #4facfe);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .dna-spin {
    animation: dnaSpin 4s linear infinite;
  }
  @keyframes dnaSpin {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(360deg); }
  }
  .pulse-ring {
    animation: pulsate 2s infinite ease-out;
  }
  @keyframes pulsate {
    0% { transform: scale(0.9); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
  }
  .scanning-line {
    position: absolute;
    width: 100%;
    height: 4px;
    background: #00e5ff;
    box-shadow: 0 0 15px #00e5ff;
    animation: scan 3s linear infinite;
    opacity: 0.7;
    z-index: 10;
  }
  @keyframes scan {
    0% { top: 0; }
    50% { top: 100%; }
    100% { top: 0; }
  }
`;

const PROJECTION_DATA = [
  { year: '2024', risk: 12, prediction: 15 },
  { year: '2025', risk: 18, prediction: 22 },
  { year: '2026', risk: 25, prediction: 35 },
  { year: '2027', risk: 40, prediction: 55 },
  { year: '2028', risk: 65, prediction: 80 },
];

const PHARMA_DATA = [
  { name: 'Uyumluluk', value: 92, fill: '#10b981' },
];

export default function BiometricTwinPage() {
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAnalyzing(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ paddingBottom: '60px', maxWidth: '1400px', margin: '0 auto', color: '#f8fafc', minHeight: '100vh', padding: '20px' }}>
      <style>{customCss}</style>

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(0, 242, 254, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
              <Fingerprint size={24} color="#00f2fe" />
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }} className="neon-text">
              Biyometrik Dijital İkiz
            </h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '15px', margin: 0, fontWeight: 500 }}>
            Genomik veriler ve IoT entegrasyonu ile hastanın gelecekteki sağlık projeksiyonu.
          </p>
        </div>

        <button className="glass-panel" style={{ padding: '12px 24px', color: '#00f2fe', fontWeight: 800, display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
          <ScanLine size={18} /> Yeni Genom Taraması Başlat
        </button>
      </div>

      {analyzing ? (
        <div className="glass-panel" style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
          <div style={{ position: 'relative' }}>
             <Dna size={80} color="#00f2fe" className="dna-spin" />
             <div className="pulse-ring" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '4px solid #00f2fe', borderRadius: '50%' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Genomik Dizi Çözümleniyor...</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Hücresel yaşlanma ve farmakogenomik veriler işleniyor (V13.0)</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '24px' }} className="animate-in fade-in zoom-in duration-500">
          
          {/* ── LEFT: 3D HOLOGRAPHIC MOCK ── */}
          <div className="glass-panel" style={{ padding: '32px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', zIndex: 20 }}>
               <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Brain size={20} color="#c084fc" /> Holografik Vücut Analizi
               </h3>
               <span style={{ fontSize: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 700 }}>CANLI VERİ</span>
             </div>
             
             {/* Hologram Simulator */}
             <div style={{ flex: 1, minHeight: '400px', background: 'radial-gradient(circle, rgba(15,23,42,1) 0%, rgba(2,6,23,1) 100%)', borderRadius: '16px', position: 'relative', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="scanning-line" />
                
                {/* SVG Vücut Taslağı / Dijital İkiz (Mock) */}
                <div style={{ position: 'relative', width: '200px', height: '350px', opacity: 0.8 }}>
                   {/* Kafa */}
                   <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '50px', borderRadius: '40%', border: '2px solid #00f2fe', boxShadow: '0 0 10px #00f2fe inset' }} />
                   {/* Gövde */}
                   <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', width: '80px', height: '120px', borderRadius: '30%', border: '2px solid #00f2fe', boxShadow: '0 0 10px #00f2fe inset' }} />
                   {/* Kalp Noktası */}
                   <div style={{ position: 'absolute', top: '35%', left: '42%', transform: 'translateX(-50%)', width: '15px', height: '15px', borderRadius: '50%', background: '#e11d48', boxShadow: '0 0 20px #e11d48' }}>
                      <div className="pulse-ring" style={{ width: '100%', height: '100%', background: '#e11d48', borderRadius: '50%' }} />
                   </div>
                   {/* Kollar */}
                   <div style={{ position: 'absolute', top: '28%', left: '25%', transform: 'rotate(20deg)', width: '20px', height: '100px', borderRadius: '20px', border: '2px solid #00f2fe' }} />
                   <div style={{ position: 'absolute', top: '28%', right: '25%', transform: 'rotate(-20deg)', width: '20px', height: '100px', borderRadius: '20px', border: '2px solid #00f2fe' }} />
                   {/* Bacaklar */}
                   <div style={{ position: 'absolute', top: '55%', left: '35%', width: '25px', height: '120px', borderRadius: '20px', border: '2px solid #00f2fe' }} />
                   <div style={{ position: 'absolute', top: '55%', right: '35%', width: '25px', height: '120px', borderRadius: '20px', border: '2px solid #00f2fe' }} />
                </div>

                {/* Floating Metrics */}
                <div style={{ position: 'absolute', top: '30%', right: '10%', background: 'rgba(2,6,23,0.8)', padding: '12px', borderRadius: '12px', border: '1px solid #e11d48', backdropFilter: 'blur(4px)' }}>
                   <div style={{ fontSize: '10px', color: '#e11d48', fontWeight: 800 }}>KORONER RİSK</div>
                   <div style={{ fontSize: '20px', color: '#fff', fontWeight: 900 }}>%42</div>
                </div>
                
                <div style={{ position: 'absolute', bottom: '20%', left: '10%', background: 'rgba(2,6,23,0.8)', padding: '12px', borderRadius: '12px', border: '1px solid #10b981', backdropFilter: 'blur(4px)' }}>
                   <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 800 }}>HÜCRE YENİLENME</div>
                   <div style={{ fontSize: '20px', color: '#fff', fontWeight: 900 }}>98<span style={{fontSize: '12px'}}>bpm</span></div>
                </div>
             </div>
          </div>

          {/* ── RIGHT: GENOMIC & PREDICTIVE ANALYTICS ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
               {/* Pharmacogenomics Match */}
               <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                 <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <Syringe size={18} color="#3b82f6" /> Farmakogenomik Eşleşme
                 </h3>
                 <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '160px', height: '160px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="80%" outerRadius="100%" barSize={10} data={PHARMA_DATA} startAngle={90} endAngle={-270}>
                          <RadialBar background={{ fill: 'rgba(255,255,255,0.05)' }} cornerRadius={10} dataKey="value" />
                          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="progress-label" fill="#fff" fontSize="32" fontWeight="900">
                            %92
                          </text>
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                 </div>
                 <div style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>
                   Reçete edilen <strong>Metformin</strong> hastanın <em>CYP2C9</em> geni ile yüksek derecede uyumludur. Toksisite riski yok.
                 </div>
               </div>

               {/* Vitals Summary */}
               <div className="glass-panel" style={{ padding: '24px' }}>
                 <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <Database size={18} color="#f59e0b" /> Hücresel Skorlar
                 </h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {[
                      { l: 'Metabolik Yaş', v: '42', c: '#10b981', m: 'Gerçek yaş: 45' },
                      { l: 'Oksidatif Stres', v: 'DÜŞÜK', c: '#3b82f6', m: 'Referans aralığında' },
                      { l: 'Kardiyovasküler Yük', v: 'RİSKLİ', c: '#e11d48', m: 'Müdahale öneriliyor' }
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>{item.l}</div>
                          <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{item.m}</div>
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 900, color: item.c }}>{item.v}</div>
                      </div>
                    ))}
                 </div>
               </div>
            </div>

            {/* 5-Year Predictive Chart */}
            <div className="glass-panel" style={{ padding: '32px', flex: 1 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <Activity size={20} color="#00f2fe" /> 5 Yıllık Organ Tahribat Projeksiyonu
                 </h3>
                 <button style={{ background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.3)', color: '#00f2fe', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                   Detaylı Rapor İndir
                 </button>
               </div>
               
               <div style={{ height: '240px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PROJECTION_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#00f2fe" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                      <Area type="monotone" name="Müdahalesiz Risk (%)" dataKey="prediction" stroke="#e11d48" strokeWidth={3} fill="url(#colorRisk)" />
                      <Area type="monotone" name="Tedavi ile Öngörülen (%)" dataKey="risk" stroke="#00f2fe" strokeWidth={3} fill="url(#colorPred)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
