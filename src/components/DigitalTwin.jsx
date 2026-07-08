import React, { useState, useEffect } from 'react';
import { Activity, Heart, Brain, Zap, AlertTriangle, ShieldAlert, Cpu } from 'lucide-react';

export default function DigitalTwin() {
  const [scanProgress, setScanProgress] = useState(0);
  const [alerts, setAlerts] = useState([]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setScanProgress(p => (p < 100 ? p + 1 : 0));
      if (Math.random() > 0.95 && alerts.length < 3) {
        setAlerts(prev => [{
          id: Date.now(),
          type: Math.random() > 0.5 ? 'cardiac' : 'neural',
          message: Math.random() > 0.5 ? 'Predictive Alert: 85% risk of arrhythmia in 45m' : 'Micro-clot detected in peripheral vascular',
          time: new Date().toLocaleTimeString()
        }, ...prev]);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [alerts.length]);

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
            <Activity className="animate-pulse-danger" /> 3D Digital Twin Sync
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Real-time physiological modeling & predictive telemetry</p>
        </div>
        <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)', boxShadow: '0 0 10px var(--success)' }} />
          <span>Sync: Active (1.2TB/s)</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
        {/* Left Stats */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-dark)', marginBottom: '12px' }}>
              <Heart size={18} /> Cardiac Engine
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>82 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>BPM</span></div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: '82%', backgroundColor: 'var(--danger)' }} />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--success)', marginTop: '8px' }}>Optimal Output</p>
          </div>
          
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)', marginBottom: '12px' }}>
              <Brain size={18} /> Neural Load
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>45 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>Hz (Gamma)</span></div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: '45%', backgroundColor: 'var(--secondary)' }} />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>Deep Cognitive State</p>
          </div>
        </div>

        {/* Center Hologram (CSS simulated) */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* Holographic Scanner Effect */}
          <div style={{ width: '200px', height: '400px', border: '1px solid rgba(0, 240, 255, 0.2)', borderRadius: '100px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, rgba(0, 240, 255, 0.05) 0%, rgba(0, 240, 255, 0) 100%)', boxShadow: 'inset 0 0 20px rgba(0,240,255,0.1)' }}>
            {/* Scanning Line */}
            <div style={{ width: '100%', height: '2px', backgroundColor: 'var(--primary)', boxShadow: '0 0 15px var(--primary)', position: 'absolute', top: `${scanProgress}%`, transition: 'top 0.1s linear' }} />
            
            {/* Grid Overlay */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,240,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.3 }} />
            
            {/* Simulated Body Nodes */}
            <div className="animate-pulse-danger" style={{ position: 'absolute', top: '25%', left: '45%', width: '12px', height: '12px', backgroundColor: 'var(--danger)', borderRadius: '50%', boxShadow: '0 0 10px var(--danger)' }} />
            <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '20px', backgroundColor: 'var(--secondary)', borderRadius: '50%', boxShadow: '0 0 15px var(--secondary)' }} />
          </div>
          
          <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
            <button className="glass-button primary"><Cpu size={16} /> Enhance Scan</button>
            <button className="glass-button"><Zap size={16} /> Run Diagnostics</button>
          </div>
        </div>

        {/* Right Alerts */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} /> Predictive Alerts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
            {alerts.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '16px', textAlign: 'center' }}>No immediate risks detected.</div>
            ) : (
              alerts.map(a => (
                <div key={a.id} className="glass-panel animate-fade-in" style={{ padding: '12px', borderLeft: '4px solid var(--danger)', backgroundColor: 'var(--danger-light)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{a.time} - {a.type.toUpperCase()}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{a.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
