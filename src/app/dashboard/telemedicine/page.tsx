'use client';

import { useState, useEffect, useRef } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, MonitorUp, Users, HeartPulse, FileText } from 'lucide-react';

export default function TelemedicinePage() {
  const [camActive, setCamActive] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [callStatus, setCallStatus] = useState('waiting'); // waiting, connecting, connected
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let timer: any;
    if (callStatus === 'connected') {
      timer = setInterval(() => setDuration(p => p + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  const toggleCamera = async () => {
    if (!camActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCamActive(true);
      } catch (err) {
        alert("Kamera izni alınamadı. Simülasyon modunda açılıyor.");
        setCamActive(true);
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setCamActive(false);
    }
  };

  const startCall = () => {
    setCallStatus('connecting');
    setTimeout(() => {
      setCallStatus('connected');
    }, 2000);
  };

  const endCall = () => {
    setCallStatus('waiting');
    setDuration(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return m + ':' + s;
  };

  return (
    <div className="animate-in" style={{ paddingBottom: '60px', height: '100%', display: 'flex', flexDirection: 'column', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* ── Header ── */}
      <div style={{ marginBottom: '28px' }}>
        <h1 className="text-gradient" style={{ fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a' }}>
          <Video size={30} color="#2563eb" />
          <span>Tele-Tıp & Sanal Muayenehane</span>
        </h1>
        <p style={{ color: '#64748b', marginTop: '8px', fontSize: '14px', fontWeight: 500 }}>
          Hastalarınızla klinik kalitesinde (End-to-End Encrypted) canlı görüntülü görüşme yapın.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', flex: 1 }}>
        
        {/* ── Video Call UI (Light Mode) ── */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          
          <div style={{ padding: '16px 24px', background: '#f8fafc', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'url(https://i.pravatar.cc/150?img=68) center/cover', border: '2px solid #ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Ahmet Yılmaz (Hipertansiyon)</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Planlanmış Randevu: 14:00 - Kontrol</div>
              </div>
            </div>
            {callStatus === 'connected' && (
              <div style={{ background: '#fff1f2', color: '#e11d48', border: '1px solid #fda4af', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e11d48', animation: 'pulseRing 1s infinite' }} />
                CANLI {formatTime(duration)}
              </div>
            )}
          </div>

          <div style={{ flex: 1, background: '#e2e8f0', position: 'relative', minHeight: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            
            {/* Patient Video */}
            {callStatus === 'connected' ? (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'url(https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800) center/cover' }} />
            ) : callStatus === 'connecting' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div className="spinner" style={{ width: '36px', height: '36px', borderWidth: '3px', borderColor: '#2563eb', borderTopColor: 'transparent' }} />
                <div style={{ color: '#1e40af', fontSize: '15px', fontWeight: 700 }}>Güvenli Bağlantı Kuruluyor...</div>
              </div>
            ) : (
              <div style={{ color: '#64748b', fontSize: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', fontWeight: 600 }}>
                <Users size={48} opacity={0.4} />
                <span>Hasta Görüşme Odasında Sizi Bekliyor</span>
                <button onClick={startCall} className="btn btn-primary" style={{ marginTop: '12px', padding: '12px 24px', fontSize: '15px' }}><Video size={18} /> Görüşmeyi Başlat</button>
              </div>
            )}

            {/* Doctor PIP Video (Real Camera) */}
            <div style={{ 
              position: 'absolute', bottom: '24px', right: '24px', width: '180px', height: '135px', 
              background: '#000000', borderRadius: '16px', border: '3px solid #ffffff', overflow: 'hidden',
              boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
            }}>
              {camActive ? (
                <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', background: '#f1f5f9' }}>
                  <VideoOff size={32} />
                </div>
              )}
            </div>
            
          </div>

          {/* Call Controls */}
          <div style={{ padding: '24px', background: '#ffffff', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button onClick={() => setMicActive(!micActive)} style={{ width: '54px', height: '54px', borderRadius: '50%', background: micActive ? '#f1f5f9' : '#fff1f2', color: micActive ? '#475569' : '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', border: micActive ? '1px solid #cbd5e1' : '1px solid #fda4af', cursor: 'pointer', transition: 'all 0.2s' }}>
              {micActive ? <Mic size={22} /> : <MicOff size={22} />}
            </button>
            <button onClick={toggleCamera} style={{ width: '54px', height: '54px', borderRadius: '50%', background: camActive ? '#f1f5f9' : '#fff1f2', color: camActive ? '#475569' : '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', border: camActive ? '1px solid #cbd5e1' : '1px solid #fda4af', cursor: 'pointer', transition: 'all 0.2s' }}>
              {camActive ? <Video size={22} /> : <VideoOff size={22} />}
            </button>
            <button style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #cbd5e1', cursor: 'pointer' }}>
              <MonitorUp size={22} />
            </button>
            <button onClick={endCall} disabled={callStatus === 'waiting'} style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#e11d48', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: callStatus === 'waiting' ? 'not-allowed' : 'pointer', opacity: callStatus === 'waiting' ? 0.5 : 1, boxShadow: '0 4px 12px rgba(225,29,72,0.3)' }}>
              <PhoneOff size={22} />
            </button>
          </div>
        </div>

        {/* ── Patient Live Data & Notes ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '24px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HeartPulse size={20} color="#059669" /> Canlı Telemetri (IoT)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Anlık Nabız</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#059669' }}>{callStatus === 'connected' ? '74 BPM' : '--'}</span>
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Tansiyon (Son 1 Saat)</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>120 / 80</span>
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Kan Oksijeni (SpO2)</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#2563eb' }}>{callStatus === 'connected' ? '%98' : '--'}</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
             <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="#8b5cf6" /> Muayene Notları
            </h3>
            <textarea 
              className="input" 
              placeholder="Görüşme sırasında hastanın şikayetlerini ve reçete detaylarını buraya not alın..." 
              style={{ flex: 1, width: '100%', resize: 'none', background: '#f8fafc', padding: '16px', fontSize: '14px', lineHeight: '1.6', border: '1px solid rgba(0,0,0,0.05)' }} 
            />
            <button className="btn" style={{ width: '100%', marginTop: '16px', justifyContent: 'center', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', fontWeight: 700 }}>
               HYS Sistemine Kaydet
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
