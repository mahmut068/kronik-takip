'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Dna, Activity, ScanLine, ShieldAlert, CheckCircle, BrainCircuit, Globe, FlaskConical } from 'lucide-react';
import Link from 'next/link';

export default function QuantumDiagnosticsPage() {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const startQuantumScan = () => {
    setScanning(true);
    setProgress(0);
    setResults(null);
    
    // Simulate a 4-second quantum scan across millions of qubits
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          setResults({
            disease: "Atipik Paroksismal Nokturnal Hemoglobinüri (PNH)",
            confidence: "99.8%",
            qubits: "4,192 Qubit",
            variantsScanned: "3.2 Milyar",
            matchFound: true
          });
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 200);
  };

  return (
    <div className="gpu-accelerated fast-render" style={{ padding: '20px', maxWidth: '1300px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-1px', color: 'var(--text)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Cpu size={36} color="var(--primary)" /> Quantum Diagnostik Motoru
            <span style={{ fontSize: '12px', background: 'linear-gradient(90deg, #d946ef, #00f2fe)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontWeight: 800 }}>V15 SİBER-TIP</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px', fontWeight: 500, margin: 0 }}>
            Milyarlarca genetik, kan ve hücresel varyasyonu Kuantum Simülasyonu ile işleyerek teşhisi zor (Orphan) hastalıkları saptar.
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-ghost">Panele Dön</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px' }}>
        
        {/* Sol Panel: Qubit Kontrol Merkezi */}
        <div className="card gpu-accelerated animate-in delay-2" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--surface2)' }}>
           
           <div style={{ textAlign: 'center', padding: '32px 16px', background: 'var(--surface3)', borderRadius: '16px', border: '1px solid var(--border)' }}>
             <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 24px' }}>
                {/* 3D Hologram Simülasyonu */}
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px dashed var(--primary)', animation: 'spin 4s linear infinite', opacity: scanning ? 1 : 0.2 }} />
                <div style={{ position: 'absolute', inset: '10px', borderRadius: '50%', border: '2px solid var(--accent)', animation: 'spin 3s linear infinite reverse', opacity: scanning ? 0.8 : 0.1 }} />
                <div style={{ position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BrainCircuit size={48} color={scanning ? 'var(--primary)' : 'var(--muted)'} style={{ filter: scanning ? 'drop-shadow(0 0 10px var(--primary-glow))' : 'none' }} />
                </div>
             </div>
             <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text)' }}>Qubit Ağ Geçidi</h3>
             <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '8px' }}>Global Tıbbi Literatür Ağına (GMAN) senkronize edildi.</p>
           </div>

           <button 
             onClick={startQuantumScan} 
             disabled={scanning}
             className="btn" 
             style={{ 
               padding: '16px', fontSize: '16px', width: '100%', justifyContent: 'center',
               background: scanning ? 'transparent' : 'linear-gradient(135deg, var(--accent), var(--primary))',
               border: scanning ? '1px solid var(--border)' : 'none',
               color: scanning ? 'var(--muted)' : '#fff',
               boxShadow: scanning ? 'none' : '0 10px 25px var(--primary-dim)'
             }}
           >
             {scanning ? <><ScanLine className="spin" size={20} /> Tarama Devam Ediyor (%{progress})</> : <><Cpu size={20} /> Kuantum Taramasını Başlat</>}
           </button>
           
           {scanning && (
             <div style={{ height: '6px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
               <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--primary))', transition: 'width 0.2s linear' }} />
             </div>
           )}

           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-sub)' }}>
                 <span>Sunucu Durumu</span> <span style={{ color: 'var(--success)', fontWeight: 800 }}>Aktif (0 KELVIN)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-sub)' }}>
                 <span>Veri Havuzu</span> <span>3.2 Milyar Varyant</span>
              </div>
           </div>
        </div>

        {/* Sağ Panel: Canlı Tarama Akışı & Sonuç */}
        <div className="card gpu-accelerated animate-in delay-3" style={{ padding: '32px', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
           
           {!scanning && !results && (
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', textAlign: 'center' }}>
                <Globe size={64} style={{ opacity: 0.2, marginBottom: '24px' }} />
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>Teşhise Hazır</h2>
                <p style={{ maxWidth: '400px' }}>Nadir görülen genetik dizilimleri ve açıklanamayan semptomları Kuantum ağına yüklemek için taramayı başlatın.</p>
             </div>
           )}

           {scanning && (
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Activity size={20} color="var(--primary)" /> Gerçek Zamanlı Qubit İşlemi
                </h3>
                
                {/* Matrix benzeri log akışı simülasyonu */}
                <div style={{ flex: 1, background: '#050812', borderRadius: '12px', padding: '20px', fontFamily: 'monospace', color: '#00f2fe', fontSize: '13px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', border: '1px solid rgba(0, 242, 254, 0.2)', boxShadow: 'inset 0 0 20px rgba(0, 242, 254, 0.05)' }}>
                  <div style={{ opacity: 0.3 }}>[LOG] İnsan Genomu v38 dizilimi çözümleniyor...</div>
                  <div style={{ opacity: 0.5 }}>[LOG] 4,192 Kuantum biti bağlandı.</div>
                  <div style={{ opacity: 0.7 }}>[LOG] Dünya Tıp Veritabanı (WHO) çapraz sorgusu başladı.</div>
                  <div style={{ opacity: 0.9 }}>[LOG] Kan tahlillerinde anomali tespit edildi: LDH = Yüksek, Haptoglobin = Düşük.</div>
                  <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>[ALARM] Hedef varyantlar %{progress} oranında filtrelendi...</div>
                </div>
             </div>
           )}

           {results && (
             <div className="animate-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', background: 'var(--success-dim)', padding: '20px', borderRadius: '16px', border: '1px solid var(--success)' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 20px var(--success)' }}>
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--success)', letterSpacing: '1px', marginBottom: '4px' }}>TEŞHİS BULUNDU</div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text)' }}>{results.disease}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                   <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                     <div style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 700, marginBottom: '8px', display: 'flex', gap: '6px' }}><ShieldAlert size={14}/> Eşleşme Güveni</div>
                     <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--primary)' }}>{results.confidence}</div>
                   </div>
                   <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                     <div style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 700, marginBottom: '8px', display: 'flex', gap: '6px' }}><Cpu size={14}/> Kullanılan Güç</div>
                     <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--accent)' }}>{results.qubits}</div>
                   </div>
                   <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                     <div style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 700, marginBottom: '8px', display: 'flex', gap: '6px' }}><Dna size={14}/> Taranan Varyant</div>
                     <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--warning)' }}>{results.variantsScanned}</div>
                   </div>
                </div>

                <div style={{ padding: '24px', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '16px', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FlaskConical size={18} color="var(--primary)" /> Biyokimyasal Açıklama & Öneri
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-sub)', lineHeight: '1.6' }}>
                    Semptomlar ve genetik veriler analiz edildiğinde hastanın <strong>PIGA geninde</strong> somatik mutasyon olduğu tespit edildi. Hastanın intravasküler hemoliz yaşaması kuvvetle muhtemel. 
                    <br/><br/>
                    <strong>Kuantum Önerisi:</strong> Eculizumab veya Ravulizumab tabanlı monoklonal antikor tedavisine başlanması %94 başarı oranı (Mortalite Riskinde Düşüş) sağlayacaktır.
                  </p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
