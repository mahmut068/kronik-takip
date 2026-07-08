import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const RiskCalendar = ({ patients }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');

  const patient = patients.find(p => p.id === parseInt(selectedPatientId));

  const prevMonth = () => {
    setViewDate(v => {
      const d = new Date(v.year, v.month - 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };
  const nextMonth = () => {
    setViewDate(v => {
      const d = new Date(v.year, v.month + 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);
  const firstDay = getFirstDayOfMonth(viewDate.year, viewDate.month);

  // Build a map: "DD.MM" -> risk status from patient history
  const riskMap = {};
  if (patient) {
    patient.history.forEach(h => {
      const val = h.value;
      const status = val >= patient.threshold ? 'danger' : val >= patient.threshold * 0.85 ? 'warning' : 'safe';
      riskMap[h.date] = status;
    });
  }

  const monthLabel = new Date(viewDate.year, viewDate.month).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
  const weekDays = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  const getCellColor = (day) => {
    const key = `${String(day).padStart(2, '0')}.${String(viewDate.month + 1).padStart(2, '0')}`;
    const status = riskMap[key];
    if (status === 'danger') return { bg: 'rgba(239,68,68,0.25)', border: '#ef4444', dot: '#ef4444' };
    if (status === 'warning') return { bg: 'rgba(245,158,11,0.2)', border: '#f59e0b', dot: '#f59e0b' };
    if (status === 'safe') return { bg: 'rgba(16,185,129,0.2)', border: '#10b981', dot: '#10b981' };
    return null;
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px', maxWidth: '860px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <CalendarDays size={36} color="var(--primary)" /> Risk Takvimi
      </h1>
      <p className="text-muted" style={{ marginBottom: '28px' }}>Hastanın geçmiş ölçümlerini günlük risk renkleriyle takvim üzerinde takip edin.</p>

      {/* Patient Selector */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <label style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Hasta Seç:</label>
        <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.5)', maxWidth: '320px' }}
          value={selectedPatientId} onChange={e => setSelectedPatientId(e.target.value)}>
          {patients.map(p => <option key={p.id} value={p.id}>{p.name} — {p.disease}</option>)}
        </select>
        {/* Legend */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          {[['#10b981', 'Güvenli'], ['#f59e0b', 'Dikkat'], ['#ef4444', 'Kritik']].map(([color, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button className="glass-button" onClick={prevMonth} style={{ padding: '8px 14px' }}><ChevronLeft size={20} /></button>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', textTransform: 'capitalize' }}>{monthLabel}</h3>
          <button className="glass-button" onClick={nextMonth} style={{ padding: '8px 14px' }}><ChevronRight size={20} /></button>
        </div>

        {/* Weekday Labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '8px' }}>
          {weekDays.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', padding: '4px' }}>{d}</div>
          ))}
        </div>

        {/* Day Cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {/* Empty cells for offset */}
          {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}

          {Array(daysInMonth).fill(null).map((_, i) => {
            const day = i + 1;
            const isToday = day === today.getDate() && viewDate.month === today.getMonth() && viewDate.year === today.getFullYear();
            const cell = getCellColor(day);

            return (
              <div key={day} style={{
                aspectRatio: '1',
                borderRadius: '10px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: cell ? cell.bg : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isToday ? 'var(--primary)' : cell ? cell.border : 'var(--glass-border)'}`,
                boxShadow: isToday ? '0 0 8px var(--primary)' : 'none',
                transition: 'all 0.2s',
                cursor: cell ? 'pointer' : 'default',
                position: 'relative'
              }}>
                <span style={{ fontSize: '0.9rem', fontWeight: isToday ? '700' : '400', color: isToday ? 'var(--primary)' : 'var(--text-main)' }}>{day}</span>
                {cell && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: cell.dot, marginTop: '3px' }} />}
              </div>
            );
          })}
        </div>

        {/* Stats Footer */}
        {patient && (
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { label: '🟢 Güvenli Gün', count: Object.values(riskMap).filter(s => s === 'safe').length, color: 'var(--success)' },
              { label: '🟡 Dikkat Günü', count: Object.values(riskMap).filter(s => s === 'warning').length, color: 'var(--warning)' },
              { label: '🔴 Kritik Gün', count: Object.values(riskMap).filter(s => s === 'danger').length, color: 'var(--danger)' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>{s.label}</p>
                <h3 style={{ fontSize: '2rem', color: s.color }}>{s.count}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskCalendar;
