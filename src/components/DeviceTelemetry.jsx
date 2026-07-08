import React, { useState, useEffect } from 'react';
import { Activity, Heart, Zap, Watch, Battery, Wifi, WifiOff, AlertTriangle, BarChart2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Sabit veriler
const DEVICE_TYPES = {
  watch: { icon: <Watch size={20} />, label: 'Akıllı Saat', color: 'var(--primary)' },
  cgm:   { icon: <Activity size={20} />, label: 'CGM (Glikoz)', color: 'var(--warning)' },
  bp:    { icon: <Heart size={20} />, label: 'Tansiyon Aleti', color: 'var(--danger)' },
  holter:{ icon: <Zap size={20} />, label: 'Holter Monitör', color: 'var(--success)' },
};

const initialDevices = [
  { id: 'DEV-101', patientName: 'Ahmet Yılmaz', type: 'watch', battery: 84, status: 'connected', lastSync: 'Şimdi', reading: '82 bpm', trend: 'stable', dataBuffer: [] },
  { id: 'DEV-204', patientName: 'Ayşe Kaya',    type: 'cgm',   battery: 45, status: 'connected', lastSync: '2 dk önce', reading: '142 mg/dL', trend: 'up', dataBuffer: [] },
  { id: 'DEV-305', patientName: 'Mehmet Demir', type: 'holter',battery: 12, status: 'warning',   lastSync: 'Şimdi', reading: 'Sinüs Ritmi', trend: 'stable', dataBuffer: [] },
  { id: 'DEV-412', patientName: 'Zeynep Çelik', type: 'bp',    battery: 95, status: 'disconnected', lastSync: '4 saat önce', reading: '135/85 mmHg', trend: 'stable', dataBuffer: [] },
];

const generateSineWave = (offset, length, frequency, amplitude, base) => {
  return Array.from({ length }, (_, i) => ({
    time: i,
    value: Math.round(base + Math.sin((i + offset) * frequency) * amplitude + (Math.random() * (amplitude * 0.2))),
  }));
};

const DeviceTelemetry = () => {
  const [devices, setDevices] = useState(initialDevices);
  const [tick, setTick] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Canlı akış simülasyonu
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
      setDevices(prev => prev.map(dev => {
        if (dev.status === 'disconnected') return dev;
        // Cihaza göre rastgele veri üretimi
        let newValue;
        if (dev.type === 'watch') newValue = `${Math.floor(70 + Math.random() * 20)} bpm`;
        else if (dev.type === 'cgm') newValue = `${Math.floor(130 + Math.random() * 30)} mg/dL`;
        else if (dev.type === 'holter') newValue = Math.random() > 0.95 ? 'Aritmi!' : 'Sinüs Ritmi';
        
        return { ...dev, reading: newValue || dev.reading, lastSync: 'Şimdi' };
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const chartData = generateSineWave(tick, 30, 0.5, 20, 80);

  const getStatusColor = (status) => {
    if (status === 'connected') return 'var(--success)';
    if (status === 'warning') return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Activity size={32} color="var(--primary)" /> IoT Cihaz & Telemetri
          </h1>
          <p className="text-muted">Bağlı giyilebilir cihazlardan gerçek zamanlı sağlık verisi akışı.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: 'var(--success)', fontWeight: 600, fontSize: '0.85rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', animation: 'pulse 2s infinite' }} />
            Canlı Akış Aktif
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        
        {/* Cihaz Listesi (Sol Panel) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '4px' }}>Bağlı Cihazlar ({devices.length})</h3>
          
          {devices.map(dev => {
            const dt = DEVICE_TYPES[dev.type];
            const isSelected = selectedDevice?.id === dev.id;
            return (
              <div key={dev.id} onClick={() => setSelectedDevice(dev)}
                style={{ padding: '16px', borderRadius: '12px', background: isSelected ? 'rgba(0,229,255,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--glass-border)'}`, cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '8px', borderRadius: '10px', background: `${dt.color}22`, color: dt.color }}>{dt.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{dev.patientName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{dt.label} · {dev.id}</div>
                    </div>
                  </div>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: getStatusColor(dev.status), boxShadow: `0 0 8px ${getStatusColor(dev.status)}` }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Son Okuma</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: dev.reading.includes('Aritmi') ? 'var(--danger)' : 'var(--text-main)', transition: 'color 0.3s' }}>
                      {dev.reading}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: dev.battery < 20 ? 'var(--danger)' : 'var(--text-muted)' }}>
                    <Battery size={14} /> {dev.battery}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cihaz Detay / Telemetri Ekranı (Sağ Panel) */}
        <div>
          {selectedDevice ? (
            <div className="glass-panel animate-fade-in" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '6px' }}>{selectedDevice.patientName}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>{DEVICE_TYPES[selectedDevice.type].icon} {DEVICE_TYPES[selectedDevice.type].label}</span>
                    <span>|</span>
                    <span>Cihaz ID: {selectedDevice.id}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                    {selectedDevice.status === 'connected' ? <Wifi size={16} color="var(--success)" /> : <WifiOff size={16} color="var(--danger)" />}
                    {selectedDevice.status === 'connected' ? 'Bağlı' : 'Bağlantı Koptu'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', background: selectedDevice.battery < 20 ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)', color: selectedDevice.battery < 20 ? 'var(--danger)' : 'var(--text-main)', fontSize: '0.85rem' }}>
                    <Battery size={16} /> PİL: %{selectedDevice.battery}
                  </div>
                </div>
              </div>

              {selectedDevice.battery < 20 && (
                <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontSize: '0.9rem' }}>
                  <AlertTriangle size={18} /> Cihaz pili kritik seviyede! Bağlantı kopabilir, lütfen hastayı uyarın.
                </div>
              )}

              {/* Anlık Veri Metrikleri */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {[
                  { label: 'Anlık Ölçüm', value: selectedDevice.reading, color: 'var(--primary)' },
                  { label: 'Son Senkronizasyon', value: selectedDevice.lastSync, color: 'var(--text-main)' },
                  { label: 'Sinyal Kalitesi', value: selectedDevice.status === 'connected' ? 'Mükemmel' : 'Zayıf', color: selectedDevice.status === 'connected' ? 'var(--success)' : 'var(--danger)' },
                ].map(m => (
                  <div key={m.label} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{m.label}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Canlı Grafik */}
              <div style={{ flex: 1, minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart2 size={18} color="var(--primary)" /> Canlı Telemetri Akışı
                </h3>
                {selectedDevice.status === 'disconnected' ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px dashed var(--glass-border)', color: 'var(--text-muted)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <WifiOff size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                      <p>Cihaz bağlantısı koptuğu için canlı veri alınamıyor.</p>
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1, position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={DEVICE_TYPES[selectedDevice.type].color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={DEVICE_TYPES[selectedDevice.type].color} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" hide />
                        <YAxis stroke="var(--text-muted)" fontSize={11} domain={['auto', 'auto']} />
                        <Tooltip 
                          contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                          itemStyle={{ color: 'var(--text-main)' }}
                          labelStyle={{ display: 'none' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={DEVICE_TYPES[selectedDevice.type].color} 
                          fill="url(#colorWave)" 
                          strokeWidth={2}
                          isAnimationActive={false} // Canlı akış için animasyonu kapat
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    
                    {/* Tarayıcı çizgisi animasyonu (Radar efekti) */}
                    <div style={{ position: 'absolute', top: 0, bottom: 0, width: '2px', background: 'rgba(255,255,255,0.8)', boxShadow: '0 0 10px rgba(255,255,255,0.5)', animation: 'scan 2s linear infinite' }} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <div style={{ textAlign: 'center' }}>
                <Activity size={48} color="var(--glass-border)" style={{ margin: '0 auto 16px' }} />
                <p>Detayları görmek için sol taraftan bir cihaz seçin.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default DeviceTelemetry;
