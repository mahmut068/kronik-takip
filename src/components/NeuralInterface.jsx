import React, { useState, useEffect } from 'react';
import { BrainCircuit, MessageSquare, Zap, Activity } from 'lucide-react';

export default function NeuralInterface() {
  const [messages, setMessages] = useState([]);
  const [isDecoding, setIsDecoding] = useState(false);
  const [brainwaves, setBrainwaves] = useState(Array.from({ length: 20 }).map(() => Math.random() * 100));

  useEffect(() => {
    // Simulate real-time EEG waves
    const waveInterval = setInterval(() => {
      setBrainwaves(prev => {
        const next = [...prev.slice(1), Math.random() * 100];
        return next;
      });
    }, 100);

    // Simulate incoming thoughts
    const thoughtInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsDecoding(true);
        setTimeout(() => {
          setIsDecoding(false);
          const thoughts = [
            "I need water.",
            "Pain level is at 4.",
            "Are my family here?",
            "Temperature is too cold.",
            "Thank you."
          ];
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: thoughts[Math.floor(Math.random() * thoughts.length)],
            time: new Date().toLocaleTimeString(),
            confidence: (Math.random() * 15 + 85).toFixed(1)
          }]);
        }, 1500);
      }
    }, 5000);

    return () => {
      clearInterval(waveInterval);
      clearInterval(thoughtInterval);
    };
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)' }}>
            <BrainCircuit /> Neural-Link Interface
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Direct cortical semantic decoding for locked-in patients</p>
        </div>
        <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
          <Activity size={18} /> Signal: Excellent
        </div>
      </div>

      {/* Real-time EEG Graph */}
      <div className="glass-panel" style={{ height: '100px', padding: '10px', display: 'flex', alignItems: 'flex-end', gap: '4px', overflow: 'hidden' }}>
        {brainwaves.map((val, i) => (
          <div key={i} style={{ 
            flex: 1, 
            height: `${val}%`, 
            backgroundColor: isDecoding ? 'var(--primary)' : 'var(--secondary)',
            transition: 'height 0.1s ease',
            borderRadius: '2px 2px 0 0',
            opacity: 0.8
          }} />
        ))}
      </div>
      
      {isDecoding && (
        <div style={{ textAlign: 'center', color: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <Zap className="animate-pulse-danger" size={16} color="var(--primary)" /> 
          <span style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>Decoding semantic intent...</span>
        </div>
      )}

      {/* Thought Log */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
        {messages.length === 0 && !isDecoding && (
          <div style={{ margin: 'auto', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MessageSquare size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <span>Waiting for cortical activity...</span>
          </div>
        )}
        {messages.slice().reverse().map(m => (
          <div key={m.id} className="glass-panel animate-fade-in" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid var(--secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>{m.time}</span>
              <span style={{ color: 'var(--success)' }}>{m.confidence}% Match</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '500' }}>"{m.text}"</div>
          </div>
        ))}
      </div>
    </div>
  );
}
