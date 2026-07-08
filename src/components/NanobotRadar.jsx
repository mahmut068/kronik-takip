import React, { useState, useEffect } from 'react';
import { Target, ActivitySquare, Shield, Crosshair } from 'lucide-react';

export default function NanobotRadar() {
  const [bots, setBots] = useState([]);
  
  useEffect(() => {
    // Generate initial swarm
    const initial = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // 10-90%
      y: Math.random() * 80 + 10,
      status: Math.random() > 0.8 ? 'engaging' : 'patrolling'
    }));
    setBots(initial);
    
    // Move bots randomly to simulate swarm
    const interval = setInterval(() => {
      setBots(current => current.map(bot => ({
        ...bot,
        x: Math.max(5, Math.min(95, bot.x + (Math.random() - 0.5) * 5)),
        y: Math.max(5, Math.min(95, bot.y + (Math.random() - 0.5) * 5)),
        status: Math.random() > 0.95 ? (bot.status === 'engaging' ? 'patrolling' : 'engaging') : bot.status
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const engagingCount = bots.filter(b => b.status === 'engaging').length;

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
            <Target /> Nanobot Swarm Control
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Real-time intra-vascular agent tracking</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '8px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{bots.length}M</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Active Units</div>
          </div>
          <div className="glass-panel" style={{ padding: '8px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>{engagingCount}M</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Engaging Pathogen</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
        {/* Radar Map */}
        <div style={{ flex: 2, position: 'relative', borderRadius: '50%', border: '2px solid var(--primary)', background: 'radial-gradient(circle, rgba(0,240,255,0.1) 0%, rgba(0,0,0,0) 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 0 30px rgba(0,240,255,0.1)' }}>
          {/* Radar Sweep */}
          <div style={{ position: 'absolute', width: '50%', height: '50%', top: 0, left: '50%', background: 'linear-gradient(90deg, rgba(0,240,255,0.8) 0%, rgba(0,0,0,0) 100%)', transformOrigin: 'bottom left', animation: 'spin 4s linear infinite', borderLeft: '2px solid var(--primary)' }} />
          
          {/* Grid Circles */}
          <div style={{ position: 'absolute', width: '33%', height: '33%', borderRadius: '50%', border: '1px dashed rgba(0,240,255,0.3)' }} />
          <div style={{ position: 'absolute', width: '66%', height: '66%', borderRadius: '50%', border: '1px dashed rgba(0,240,255,0.3)' }} />
          
          {/* Crosshair */}
          <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'rgba(0,240,255,0.3)' }} />
          <div style={{ position: 'absolute', width: '1px', height: '100%', background: 'rgba(0,240,255,0.3)' }} />

          {/* Bots */}
          {bots.map(bot => (
            <div 
              key={bot.id} 
              style={{
                position: 'absolute',
                top: `${bot.y}%`,
                left: `${bot.x}%`,
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: bot.status === 'engaging' ? 'var(--danger)' : 'var(--primary)',
                boxShadow: `0 0 8px ${bot.status === 'engaging' ? 'var(--danger)' : 'var(--primary)'}`,
                transition: 'top 1s linear, left 1s linear'
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Swarm Directives</h3>
          
          <button className="glass-button" style={{ justifyContent: 'flex-start', padding: '16px' }}>
            <ActivitySquare size={20} color="var(--primary)" /> 
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 'bold' }}>Patrol Mode</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Routine vascular scanning</div>
            </div>
          </button>
          
          <button className="glass-button" style={{ justifyContent: 'flex-start', padding: '16px', border: '1px solid var(--danger)' }}>
            <Crosshair size={20} color="var(--danger)" /> 
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 'bold' }}>Targeted Attack</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Focus on localized infection</div>
            </div>
          </button>

          <button className="glass-button" style={{ justifyContent: 'flex-start', padding: '16px' }}>
            <Shield size={20} color="var(--success)" /> 
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 'bold' }}>Tissue Repair</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deploy regenerative payload</div>
            </div>
          </button>

          <div className="glass-panel" style={{ marginTop: 'auto', padding: '16px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>System Integrity</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: '99.9%', backgroundColor: 'var(--success)' }} />
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px' }}>99.9%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
