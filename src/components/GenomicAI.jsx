import React, { useState } from 'react';
import { Microscope, Dna, CheckCircle2, ShieldAlert, Cpu, ActivitySquare } from 'lucide-react';

export default function GenomicAI() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResults({
        mutations: 3,
        crisprSuccessRate: '98.4%',
        risks: [
          { name: 'BRCA1 Modifier', probability: 'High', color: 'var(--danger)' },
          { name: 'APOE ε4', probability: 'Medium', color: 'var(--warning)' }
        ]
      });
    }, 2500);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)' }}>
            <Dna /> Genomic Profiling & CRISPR AI
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Real-time DNA sequence analysis & editing simulation</p>
        </div>
        {analyzing && (
          <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
            <ActivitySquare className="animate-pulse-danger" /> Sequencing...
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* Simulated DNA Helix Animation using CSS */}
          <div style={{ position: 'relative', height: '300px', width: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
            {[1,2,3,4,5,6,7].map(i => (
              <div key={i} style={{ width: '100%', height: '2px', background: 'rgba(0, 240, 255, 0.2)', position: 'relative', transform: analyzing ? `rotateY(${i*30}deg)` : 'none', transition: 'transform 2s linear', animation: analyzing ? 'spin 1s linear infinite' : 'none' }}>
                <div style={{ position: 'absolute', left: '-5px', top: '-4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />
                <div style={{ position: 'absolute', right: '-5px', top: '-4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--secondary)', boxShadow: '0 0 10px var(--secondary)' }} />
              </div>
            ))}
          </div>
          <button className="glass-button primary" onClick={runAnalysis} disabled={analyzing} style={{ marginTop: '20px' }}>
            <Microscope size={18} /> {analyzing ? 'Sequencing DNA...' : 'Run Full Sequence'}
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {results ? (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <CheckCircle2 /> Sequence Complete
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Anomalies Detected:</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--danger)' }}>{results.mutations}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>CRISPR-Cas9 Success Rate:</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>{results.crisprSuccessRate}</span>
                </div>
              </div>
              
              <h3 style={{ fontSize: '1.2rem', marginTop: '10px' }}>Genetic Risk Markers</h3>
              {results.risks.map((risk, i) => (
                <div key={i} className="glass-panel" style={{ padding: '16px', borderLeft: `4px solid ${risk.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>{risk.name}</span>
                    <span style={{ fontSize: '0.85rem', padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>{risk.probability} Risk</span>
                  </div>
                  <button className="glass-button" style={{ marginTop: '12px', width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
                    <Cpu size={14} /> Simulate Gene Edit
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <ShieldAlert size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <p>Awaiting sequence data to identify CRISPR targets.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
