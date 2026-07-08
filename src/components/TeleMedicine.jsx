import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, Stethoscope, Signal, MessageSquare, Send, X } from 'lucide-react';

const QUICK_MESSAGES = [
  'Sizi duyabiliyorum, devam edin.',
  'Lütfen tansiyon ölçümünüzü paylaşın.',
  'Bu semptom ne zamandır sürüyor?',
  'Endişelenmeyin, kontrol altında.',
  'Reçetenizi güncelliyorum.',
];

const TeleMedicine = ({ patient, onClose }) => {
  const [callState, setCallState] = useState('calling');
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [signalBars, setSignalBars] = useState(4);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, from: 'doctor', text: 'Merhaba, görüşmeye hoş geldiniz.', time: new Date().toLocaleTimeString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setCallState('connected'), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (callState === 'connected') {
      interval = setInterval(() => setCallDuration(d => d + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  useEffect(() => {
    const interval = setInterval(() => setSignalBars(Math.floor(Math.random() * 2) + 3), 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const formatDuration = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const handleEndCall = () => {
    setCallState('ended');
    setTimeout(onClose, 1500);
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const msg = { id: Date.now(), from: 'doctor', text: text.trim(), time: new Date().toLocaleTimeString() };
    setChatMessages(prev => [...prev, msg]);
    setChatInput('');
    // Simulated patient reply
    setTimeout(() => {
      const replies = ['Anlıyorum, teşekkürler.', 'Peki doktor bey.', 'Tamam, hemen bakacağım.', 'Evet, öyle hissediyorum.'];
      setChatMessages(prev => [...prev, { id: Date.now() + 1, from: 'patient', text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString() }]);
    }, 1800);
  };

  return (
    <div className="telemedicine-overlay animate-fade-in">

      {/* Status Bar */}
      <div style={{ height: '48px', background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: callState === 'connected' ? '#10b981' : '#f59e0b', boxShadow: callState === 'connected' ? '0 0 8px #10b981' : '0 0 8px #f59e0b' }} />
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
            MediTrack Tele-Tıp — {callState === 'calling' ? 'Bağlanılıyor...' : callState === 'connected' ? `Bağlı · ${formatDuration(callDuration)}` : 'Görüşme Sonlandı'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ width: '4px', height: `${i * 5}px`, borderRadius: '2px', background: i <= signalBars ? '#10b981' : 'rgba(255,255,255,0.2)' }} />
          ))}
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>HD</span>
        </div>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Video Area */}
        <div className="video-main" style={{ flex: 1 }}>
          {callState === 'calling' ? (
            <div style={{ textAlign: 'center' }}>
              <div className="calling-avatar" style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e3a5f, #0369a1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <User size={60} color="#00e5ff" />
              </div>
              <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '8px' }}>{patient.name}</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' }}>Aranıyor...</p>
              <div className="voice-wave-container" style={{ marginTop: '16px' }}>
                {Array(9).fill(0).map((_, i) => <div key={i} className="voice-bar" style={{ background: '#f59e0b' }} />)}
              </div>
            </div>
          ) : callState === 'ended' ? (
            <div style={{ textAlign: 'center' }}>
              <PhoneOff size={64} color="#ef4444" style={{ marginBottom: '16px' }} />
              <h2 style={{ color: '#fff', fontSize: '1.8rem' }}>Görüşme Sonlandırıldı</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>Süre: {formatDuration(callDuration)}</p>
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, #0c2a3a 0%, #050e14 100%)' }} />
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <div style={{ width: '180px', height: '180px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e3a5f, #0369a1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '3px solid rgba(0,229,255,0.4)', boxShadow: '0 0 40px rgba(0,229,255,0.15)' }}>
                  <User size={80} color="#00e5ff" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
                  <span style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>{patient.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>· {patient.disease}</span>
                </div>
                <div className="voice-wave-container" style={{ marginTop: '12px' }}>
                  {Array(9).fill(0).map((_, i) => <div key={i} className="voice-bar" />)}
                </div>
              </div>

              {/* HUD */}
              <div style={{ position: 'absolute', top: '20px', left: '20px', color: '#00e5ff', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ background: 'rgba(0,0,0,0.6)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.2)' }}>
                  <span style={{ opacity: 0.6 }}>Eşik:</span> <strong>{patient.threshold}</strong>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.6)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.2)' }}>
                  <span style={{ opacity: 0.6 }}>Son Ölçüm:</span> <strong style={{ color: patient.status === 'danger' ? '#ef4444' : '#10b981' }}>{patient.currentValue}</strong>
                </div>
              </div>

              {/* Doctor PiP */}
              <div className="video-pip">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #065f46, #047857)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                    <Stethoscope size={28} color="#6ee7b7" />
                  </div>
                  <p style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}>Doktor</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>Sen</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Panel */}
        {showChat && callState === 'connected' && (
          <div className="animate-slide-in" style={{ width: '320px', background: 'rgba(0,0,0,0.85)', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
            {/* Chat Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} color="var(--primary)" /> Görüşme Sohbeti
              </span>
              <button onClick={() => setShowChat(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}>
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chatMessages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'doctor' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: msg.from === 'doctor' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.from === 'doctor' ? 'rgba(0,180,216,0.3)' : 'rgba(255,255,255,0.1)',
                    border: `1px solid ${msg.from === 'doctor' ? 'rgba(0,229,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
                    color: '#fff', fontSize: '0.88rem', lineHeight: 1.4 }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '3px' }}>
                    {msg.from === 'doctor' ? 'Doktor' : patient.name} · {msg.time}
                  </span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Messages */}
            <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {QUICK_MESSAGES.slice(0, 3).map((qm, i) => (
                <button key={i} onClick={() => sendMessage(qm)}
                  style={{ padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(0,229,255,0.3)', background: 'rgba(0,229,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.73rem', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                  {qm}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px' }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(chatInput)}
                placeholder="Mesaj yaz..."
                style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none' }}
              />
              <button onClick={() => sendMessage(chatInput)}
                style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,229,255,0.2)', border: '1px solid rgba(0,229,255,0.4)', cursor: 'pointer', color: '#00e5ff' }}>
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="video-controls">
        <button className="video-control-btn" onClick={() => setMicOn(!micOn)} style={{ background: micOn ? 'rgba(255,255,255,0.15)' : '#ef4444' }}>
          {micOn ? <Mic size={22} color="#fff" /> : <MicOff size={22} color="#fff" />}
        </button>
        <button className="video-control-btn" onClick={() => setVideoOn(!videoOn)} style={{ background: videoOn ? 'rgba(255,255,255,0.15)' : '#ef4444' }}>
          {videoOn ? <Video size={22} color="#fff" /> : <VideoOff size={22} color="#fff" />}
        </button>
        <button className="video-control-btn" onClick={handleEndCall} style={{ background: '#ef4444', width: '72px', height: '72px', boxShadow: '0 0 20px rgba(239,68,68,0.5)' }}>
          <PhoneOff size={28} color="#fff" />
        </button>
        <button className="video-control-btn" onClick={() => setShowChat(!showChat)}
          style={{ background: showChat ? 'rgba(0,229,255,0.3)' : 'rgba(255,255,255,0.15)', border: showChat ? '2px solid var(--primary)' : 'none' }}>
          <MessageSquare size={22} color={showChat ? 'var(--primary)' : '#fff'} />
        </button>
        <button className="video-control-btn" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <Signal size={22} color="#10b981" />
        </button>
      </div>
    </div>
  );
};

export default TeleMedicine;
