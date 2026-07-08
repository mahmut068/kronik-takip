import React, { useState } from 'react';
import { MapPin, Bed, Users, Activity, Wifi, AlertTriangle, CheckCircle, Thermometer, Zap } from 'lucide-react';

const FLOORS = [
  {
    id: 1,
    name: 'Zemin Kat (0)',
    rooms: [
      { id: 'R-01', name: 'Acil Servis',       type: 'emergency', status: 'busy',     capacity: 20, occupied: 17, temp: 22.1, devices: 8  },
      { id: 'R-02', name: 'Görüntüleme (MR)',   type: 'radiology', status: 'active',   capacity: 3,  occupied: 2,  temp: 19.5, devices: 4  },
      { id: 'R-03', name: 'Laboratuvar',         type: 'lab',       status: 'active',   capacity: 10, occupied: 6,  temp: 21.0, devices: 12 },
      { id: 'R-04', name: 'Eczane',              type: 'pharmacy',  status: 'active',   capacity: 5,  occupied: 3,  temp: 20.5, devices: 3  },
      { id: 'R-05', name: 'Kayıt & Kabul',       type: 'admin',     status: 'active',   capacity: 8,  occupied: 5,  temp: 22.8, devices: 6  },
    ],
  },
  {
    id: 2,
    name: '1. Kat — Dahiliye',
    rooms: [
      { id: 'R-11', name: 'Dahiliye Yatakhane A', type: 'ward',      status: 'busy',     capacity: 20, occupied: 18, temp: 23.2, devices: 20 },
      { id: 'R-12', name: 'Dahiliye Yatakhane B', type: 'ward',      status: 'active',   capacity: 20, occupied: 14, temp: 22.5, devices: 20 },
      { id: 'R-13', name: 'Poliklinik 1-2-3',     type: 'clinic',    status: 'busy',     capacity: 6,  occupied: 6,  temp: 22.0, devices: 9  },
      { id: 'R-14', name: 'Hemşire İstasyonu',    type: 'nurse',     status: 'active',   capacity: 4,  occupied: 3,  temp: 22.3, devices: 5  },
    ],
  },
  {
    id: 3,
    name: '2. Kat — Kardiyoloji',
    rooms: [
      { id: 'R-21', name: 'Kardiyoloji Yataklı',  type: 'ward',      status: 'busy',     capacity: 24, occupied: 22, temp: 22.8, devices: 24 },
      { id: 'R-22', name: 'Kardiyak Kateter Lab',  type: 'radiology', status: 'alert',    capacity: 2,  occupied: 2,  temp: 20.1, devices: 6  },
      { id: 'R-23', name: 'Holter Odası',          type: 'clinic',    status: 'active',   capacity: 4,  occupied: 2,  temp: 21.5, devices: 4  },
      { id: 'R-24', name: 'EKG Merkezi',           type: 'clinic',    status: 'active',   capacity: 6,  occupied: 4,  temp: 22.0, devices: 8  },
    ],
  },
  {
    id: 4,
    name: '3. Kat — Yoğun Bakım',
    rooms: [
      { id: 'R-31', name: 'YBÜ (6 Yatak)',         type: 'icu',       status: 'alert',    capacity: 6,  occupied: 4,  temp: 21.0, devices: 30 },
      { id: 'R-32', name: 'Koroner YBÜ',           type: 'icu',       status: 'busy',     capacity: 4,  occupied: 3,  temp: 21.2, devices: 18 },
      { id: 'R-33', name: 'Hemşire Kontrol',        type: 'nurse',     status: 'active',   capacity: 3,  occupied: 2,  temp: 22.0, devices: 8  },
    ],
  },
  {
    id: 5,
    name: '4. Kat — Ameliyathane',
    rooms: [
      { id: 'R-41', name: 'Ameliyathane 1',        type: 'surgery',   status: 'busy',     capacity: 1,  occupied: 1,  temp: 18.5, devices: 15 },
      { id: 'R-42', name: 'Ameliyathane 2',        type: 'surgery',   status: 'active',   capacity: 1,  occupied: 0,  temp: 18.8, devices: 15 },
      { id: 'R-43', name: 'Ameliyathane 3',        type: 'surgery',   status: 'active',   capacity: 1,  occupied: 1,  temp: 19.0, devices: 15 },
      { id: 'R-44', name: 'Sterilizasyon Ünitesi', type: 'admin',     status: 'active',   capacity: 4,  occupied: 2,  temp: 25.0, devices: 6  },
    ],
  },
];

const TYPE_CONFIG = {
  emergency: { color: '#f43f5e', label: 'Acil' },
  radiology: { color: '#a855f7', label: 'Görüntüleme' },
  lab:        { color: '#00e5ff', label: 'Lab' },
  pharmacy:   { color: '#10b981', label: 'Eczane' },
  admin:      { color: '#64748b', label: 'İdari' },
  ward:       { color: '#3b82f6', label: 'Yatakhane' },
  clinic:     { color: '#f59e0b', label: 'Poliklinik' },
  nurse:      { color: '#10b981', label: 'Hemşire İst.' },
  icu:        { color: '#f43f5e', label: 'YBÜ' },
  surgery:    { color: '#8b5cf6', label: 'Ameliyat' },
};

const STATUS_CONFIG = {
  active: { label: 'Normal',   color: 'var(--success)', bg: 'rgba(16,185,129,0.1)' },
  busy:   { label: 'Yoğun',   color: '#f59e0b',        bg: 'rgba(245,158,11,0.1)' },
  alert:  { label: 'Uyarı',   color: 'var(--danger)',  bg: 'rgba(244,63,94,0.1)' },
};

function RoomCard({ room, selected, onClick }) {
  const tc = TYPE_CONFIG[room.type] || { color: '#fff', label: room.type };
  const sc = STATUS_CONFIG[room.status];
  const occPct = Math.round((room.occupied / room.capacity) * 100);

  return (
    <div onClick={onClick} className="glass-panel" style={{
      padding: '12px 14px', cursor: 'pointer',
      border: selected ? `1px solid ${tc.color}` : room.status === 'alert' ? '1px solid rgba(244,63,94,0.35)' : '1px solid var(--glass-border)',
      transition: 'all 0.2s',
      background: room.status === 'alert' ? 'rgba(244,63,94,0.04)' : undefined,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.88rem' }}>{room.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: tc.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{room.id} · {tc.label}</span>
          </div>
        </div>
        <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 700, color: sc.color, background: sc.bg }}>
          {sc.label}
        </span>
      </div>
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
          <span style={{ color: 'var(--text-muted)' }}>Doluluk</span>
          <span style={{ color: occPct >= 90 ? 'var(--danger)' : occPct >= 70 ? '#f59e0b' : 'var(--success)', fontWeight: 700 }}>
            {room.occupied}/{room.capacity}
          </span>
        </div>
        <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3 }}>
          <div style={{ height: '100%', width: `${occPct}%`, background: occPct >= 90 ? 'var(--danger)' : occPct >= 70 ? '#f59e0b' : tc.color, borderRadius: 3, transition: 'width 0.5s ease' }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Thermometer size={10} /> {room.temp}°C</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Wifi size={10} /> {room.devices} cihaz</span>
      </div>
    </div>
  );
}

export default function HospitalMap() {
  const [selectedFloor, setSelectedFloor] = useState(FLOORS[0]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const totalRooms    = FLOORS.flatMap(f => f.rooms).length;
  const alertRooms    = FLOORS.flatMap(f => f.rooms).filter(r => r.status === 'alert').length;
  const totalOccupied = FLOORS.flatMap(f => f.rooms).reduce((s, r) => s + r.occupied, 0);
  const totalCapacity = FLOORS.flatMap(f => f.rooms).reduce((s, r) => s + r.capacity, 0);
  const totalDevices  = FLOORS.flatMap(f => f.rooms).reduce((s, r) => s + r.devices, 0);

  const selRoom = selectedRoom ? selectedFloor.rooms.find(r => r.id === selectedRoom) : null;

  return (
    <div className="animate-fade-in" style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <MapPin size={28} color="var(--primary)" /> Hastane Haritası
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>Kat planı, oda dolulukları ve cihaz izleme</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'Toplam Oda',  value: totalRooms,    icon: <MapPin size={16}/>,    color: 'var(--primary)' },
            { label: 'Uyarı',       value: alertRooms,    icon: <AlertTriangle size={16}/>, color: 'var(--danger)' },
            { label: 'Doluluk',     value: `${Math.round((totalOccupied/totalCapacity)*100)}%`, icon: <Bed size={16}/>, color: '#f59e0b' },
            { label: 'Bağlı Cihaz', value: totalDevices,  icon: <Wifi size={16}/>,      color: 'var(--success)' },
          ].map((s, i) => (
            <div key={i} className="glass-panel" style={{ padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ color: s.color, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: 16, minHeight: 0 }}>
        {/* Floor selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: '0 0 200px' }}>
          {FLOORS.map(floor => {
            const hasAlert = floor.rooms.some(r => r.status === 'alert');
            return (
              <button key={floor.id} className={`glass-button ${selectedFloor.id === floor.id ? 'primary' : ''}`}
                onClick={() => { setSelectedFloor(floor); setSelectedRoom(null); }}
                style={{ width: '100%', justifyContent: 'space-between', padding: '12px 14px', fontSize: '0.82rem', textAlign: 'left' }}>
                <span>{floor.name}</span>
                {hasAlert && <AlertTriangle size={12} color="var(--danger)" />}
              </button>
            );
          })}
        </div>

        {/* Room grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, overflowY: 'auto', alignContent: 'start' }}>
          {selectedFloor.rooms.map(room => (
            <RoomCard key={room.id} room={room} selected={selectedRoom === room.id}
              onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)} />
          ))}
        </div>

        {/* Room detail panel */}
        {selRoom && (
          <div style={{ flex: '0 0 260px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="glass-panel" style={{ padding: 20 }}>
              <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem', marginBottom: 4 }}>{selRoom.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 16 }}>{selRoom.id} · {TYPE_CONFIG[selRoom.type]?.label}</div>
              {[
                { label: 'Durum',         value: STATUS_CONFIG[selRoom.status]?.label, color: STATUS_CONFIG[selRoom.status]?.color },
                { label: 'Doluluk',       value: `${selRoom.occupied} / ${selRoom.capacity}` },
                { label: 'Sıcaklık',      value: `${selRoom.temp}°C` },
                { label: 'Bağlı Cihaz',   value: `${selRoom.devices} adet` },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                  <span style={{ color: row.color || 'var(--text-main)', fontWeight: 700 }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 10 }}>Hızlı İşlemler</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button className="glass-button" style={{ width: '100%', fontSize: '0.8rem', gap: 6 }}>
                  <Users size={13} /> Personel Ata
                </button>
                <button className="glass-button" style={{ width: '100%', fontSize: '0.8rem', gap: 6 }}>
                  <Zap size={13} /> Cihaz Durumu
                </button>
                <button className="glass-button" style={{ width: '100%', fontSize: '0.8rem', gap: 6 }}>
                  <Activity size={13} /> Hasta Listesi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
