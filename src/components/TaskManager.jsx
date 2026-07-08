import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Clock, User, AlertCircle, CheckCircle2, Circle, ClipboardList, Filter } from 'lucide-react';

const PRIORITIES = [
  { value: 'urgent', label: '🔴 Acil', color: 'var(--danger)' },
  { value: 'high',   label: '🟠 Yüksek', color: '#f97316' },
  { value: 'normal', label: '🟡 Normal', color: 'var(--warning)' },
  { value: 'low',    label: '🟢 Düşük', color: 'var(--success)' },
];

const CATEGORIES = ['İlaç Takibi', 'Ölçüm', 'Kontrol', 'Diyet', 'Egzersiz', 'Diğer'];

const TaskManager = ({ patients, addNotification, tasks = [], setTasks }) => {
  const [showForm, setShowForm] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterDone, setFilterDone] = useState('all'); // all | pending | done
  const [newTask, setNewTask] = useState({
    patientId: patients[0]?.id || '',
    title: '',
    category: 'Ölçüm',
    priority: 'normal',
    dueDate: new Date().toISOString().split('T')[0],
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.patientId) return;
    const patient = patients.find(p => p.id === parseInt(newTask.patientId));
    const task = {
      id: Date.now(),
      patientId: parseInt(newTask.patientId),
      patientName: patient?.name || 'Bilinmiyor',
      title: newTask.title,
      category: newTask.category,
      priority: newTask.priority,
      done: false,
      dueDate: newTask.dueDate,
      createdAt: new Date().toLocaleTimeString(),
    };
    setTasks(prev => [task, ...prev]);
    addNotification('info', `Yeni görev oluşturuldu: "${task.title}" — ${patient?.name}`);
    setShowForm(false);
    setNewTask({ patientId: patients[0]?.id || '', title: '', category: 'Ölçüm', priority: 'normal', dueDate: new Date().toISOString().split('T')[0] });
  };

  const toggleDone = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, done: !t.done };
        addNotification(updated.done ? 'success' : 'info', `Görev ${updated.done ? 'tamamlandı' : 'yeniden açıldı'}: "${t.title}"`);
        return updated;
      }
      return t;
    }));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    addNotification('info', 'Görev silindi.');
  };

  const filtered = tasks
    .filter(t => filterPriority === 'all' || t.priority === filterPriority)
    .filter(t => filterDone === 'all' ? true : filterDone === 'done' ? t.done : !t.done);

  const pending = tasks.filter(t => !t.done).length;
  const done = tasks.filter(t => t.done).length;
  const urgent = tasks.filter(t => t.priority === 'urgent' && !t.done).length;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div className="flex-between mb-4">
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <CheckSquare size={36} color="var(--primary)" /> Görev & Hatırlatma
          </h1>
          <p className="text-muted">Hastalara atanan tüm görevleri ve tedavi hatırlatmalarını yönetin.</p>
        </div>
        <button className="glass-button primary" onClick={() => setShowForm(!showForm)} style={{ padding: '12px 20px' }}>
          <Plus size={20} /> Yeni Görev
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '14px', background: 'rgba(245,158,11,0.2)', borderRadius: '50%' }}>
            <Clock size={28} color="var(--warning)" />
          </div>
          <div>
            <p className="text-muted">Bekleyen</p>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--warning)' }}>{pending}</h2>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '14px', background: 'rgba(239,68,68,0.2)', borderRadius: '50%' }}>
            <AlertCircle size={28} color="var(--danger)" />
          </div>
          <div>
            <p className="text-muted">Acil</p>
            <h2 style={{ fontSize: '2.2rem', color: urgent > 0 ? 'var(--danger)' : 'var(--text-main)' }}>{urgent}</h2>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '14px', background: 'rgba(16,185,129,0.2)', borderRadius: '50%' }}>
            <CheckCircle2 size={28} color="var(--success)" />
          </div>
          <div>
            <p className="text-muted">Tamamlanan</p>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--success)' }}>{done}</h2>
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <div className="glass-panel animate-fade-in" style={{ padding: '28px', marginBottom: '28px', borderColor: 'rgba(0,229,255,0.3)' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardList size={20} /> Yeni Görev Oluştur
          </h3>
          <form onSubmit={handleAddTask} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Görev Başlığı *</label>
              <input
                className="glass-input" required
                placeholder="Örn: Akşam tansiyonunu ölç"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Hasta</label>
              <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} value={newTask.patientId} onChange={e => setNewTask({ ...newTask, patientId: e.target.value })}>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Kategori</label>
              <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} value={newTask.category} onChange={e => setNewTask({ ...newTask, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Öncelik</label>
              <select className="glass-input" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Son Tarih</label>
              <input type="date" className="glass-input" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} style={{ colorScheme: 'dark' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
              <button type="submit" className="glass-button primary" style={{ flex: 1 }}>Kaydet</button>
              <button type="button" className="glass-button" onClick={() => setShowForm(false)} style={{ flex: 1 }}>İptal</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <Filter size={16} /> Filtrele:
        </div>
        <div style={{ display: 'flex', background: 'var(--glass-bg)', borderRadius: '8px', padding: '4px', border: '1px solid var(--glass-border)' }}>
          {['all', 'pending', 'done'].map(f => (
            <button key={f} onClick={() => setFilterDone(f)}
              style={{ padding: '6px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
                background: filterDone === f ? 'var(--primary-dark)' : 'transparent',
                color: filterDone === f ? '#fff' : 'var(--text-main)' }}>
              {f === 'all' ? 'Tümü' : f === 'pending' ? '⏳ Bekleyen' : '✅ Tamamlanan'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', background: 'var(--glass-bg)', borderRadius: '8px', padding: '4px', border: '1px solid var(--glass-border)' }}>
          <button onClick={() => setFilterPriority('all')}
            style={{ padding: '6px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
              background: filterPriority === 'all' ? 'rgba(255,255,255,0.1)' : 'transparent', color: 'var(--text-main)' }}>
            Tüm Öncelikler
          </button>
          {PRIORITIES.map(p => (
            <button key={p.value} onClick={() => setFilterPriority(p.value)}
              style={{ padding: '6px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
                background: filterPriority === p.value ? p.color + '33' : 'transparent', color: filterPriority === p.value ? p.color : 'var(--text-muted)' }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length === 0 ? (
          <div className="glass-panel flex-center" style={{ padding: '60px', color: 'var(--text-muted)' }}>
            <div style={{ textAlign: 'center' }}>
              <CheckSquare size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p>Filtreye uygun görev bulunamadı.</p>
            </div>
          </div>
        ) : filtered.map(task => {
          const prio = PRIORITIES.find(p => p.value === task.priority);
          return (
            <div key={task.id} className="glass-panel animate-fade-in task-card"
              style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px',
                borderLeft: `4px solid ${task.done ? 'var(--glass-border)' : prio?.color}`,
                opacity: task.done ? 0.6 : 1, transition: 'all 0.3s' }}>
              <button onClick={() => toggleDone(task.id)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: task.done ? 'var(--success)' : 'var(--text-muted)', flexShrink: 0 }}>
                {task.done ? <CheckCircle2 size={26} color="var(--success)" /> : <Circle size={26} />}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '600', fontSize: '1.05rem', color: 'var(--text-main)', textDecoration: task.done ? 'line-through' : 'none' }}>
                    {task.title}
                  </span>
                  <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', background: prio?.color + '22', color: prio?.color, border: `1px solid ${prio?.color}44` }}>
                    {prio?.label}
                  </span>
                  <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid var(--glass-border)' }}>
                    {task.category}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={13} /> {task.patientName}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} /> Son: {task.dueDate}</span>
                  <span>Oluşturuldu: {task.createdAt}</span>
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskManager;
