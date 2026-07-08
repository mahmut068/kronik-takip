import React, { useState } from 'react';
import { Apple, User, TrendingUp, AlertTriangle, CheckCircle, Plus, Edit3, Save, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PATIENTS = [
  { id: 1, name: 'Ahmet Yılmaz', age: 58, ward: 'Dahiliye', diagnosis: 'Diyabet Tip 2', weight: 84, height: 175, bmi: 27.4, dietType: 'Diyabetik', calories: 1800, protein: 90, status: 'stable', risk: 'low', dietitian: 'Dyt. Selin Ay', allergies: ['Fıstık'], supplements: ['Vitamin D', 'Omega-3'], notes: 'Şeker kontrolü iyi. Karbonhidrat sayımı eğitimi verildi.' },
  { id: 2, name: 'Fatma Şahin', age: 72, ward: 'YBÜ', diagnosis: 'Malnutrisyon + Sepsis', weight: 48, height: 160, bmi: 18.8, dietType: 'Enteral Beslenme', calories: 2200, protein: 120, status: 'critical', risk: 'high', dietitian: 'Dyt. Selin Ay', allergies: [], supplements: ['Glutamin', 'Arginin'], notes: 'Enteral beslenme tolere ediliyor. Kalorik hedef tutturuluyor.' },
  { id: 3, name: 'Mehmet Demir', age: 45, ward: 'Cerrahi', diagnosis: 'Post-op Kolon Rezeksiyonu', weight: 78, height: 178, bmi: 24.6, dietType: 'Aşamalı Oral', calories: 2000, protein: 100, status: 'improving', risk: 'medium', dietitian: 'Dyt. Can Kara', allergies: ['Gluten'], supplements: ['Probiyotik', 'Çinko'], notes: '3. post-op gün. Sıvı diyetten yumuşak diyete geçiş yapıldı.' },
  { id: 4, name: 'Ayşe Kılıç', age: 35, ward: 'Ortopedi', diagnosis: 'Diz Protezi Sonrası', weight: 92, height: 165, bmi: 33.8, dietType: 'Obezite / Hipokalorik', calories: 1500, protein: 110, status: 'stable', risk: 'medium', dietitian: 'Dyt. Can Kara', allergies: ['Süt'], supplements: ['Kalsiyum', 'Kolajen'], notes: 'Kilo yönetimi hedefleniyor. Yüksek proteinli hipokalorik diyet.' },
];

const MEAL_PLAN = [
  { meal: 'Kahvaltı', time: '08:00', items: ['Tam buğday ekmek (1 dilim)', 'Yumurta haşlama (2 adet)', 'Beyaz peynir (30g)', 'Domates + Salatalık', 'Yeşil çay (şekersiz)'], calories: 420, protein: 28 },
  { meal: 'Ara Öğün', time: '10:30', items: ['Elma (1 orta)', 'Badem (10 adet)'], calories: 180, protein: 4 },
  { meal: 'Öğle', time: '12:30', items: ['Zeytinyağlı mercimek çorbası', 'Izgara tavuk göğsü (120g)', 'Bulgur pilavı (4 yemek kaşığı)', 'Mevsim salatası', 'Ayran (200ml)'], calories: 580, protein: 42 },
  { meal: 'Ara Öğün', time: '15:30', items: ['Yoğurt (150g)', 'Yaban mersini (50g)'], calories: 150, protein: 8 },
  { meal: 'Akşam', time: '18:30', items: ['Izgara somon (150g)', 'Fırın sebze', 'Esmer pirinç (3 yemek kaşığı)', 'Tahin (1 tatlı kaşığı)'], calories: 470, protein: 38 },
];

const RISK_CFG = {
  low:    { label: 'Düşük Risk',  color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  medium: { label: 'Orta Risk',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  high:   { label: 'Yüksek Risk', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

const STATUS_CFG = {
  stable:    { label: 'Stabil',    color: '#10b981' },
  improving: { label: 'Düzeliyor', color: '#3b82f6' },
  critical:  { label: 'Kritik',    color: '#ef4444' },
};

const DEPT_DATA = [
  { dept: 'Dahiliye', patients: 12, malnourished: 3 },
  { dept: 'Cerrahi',  patients: 8,  malnourished: 4 },
  { dept: 'YBÜ',      patients: 6,  malnourished: 5 },
  { dept: 'Ortopedi', patients: 10, malnourished: 2 },
  { dept: 'Kardiyoloji', patients: 9, malnourished: 2 },
];

const PIE_DATA = [
  { name: 'Oral Diyet', value: 18, color: '#00e5ff' },
  { name: 'Enteral',    value: 6,  color: '#f59e0b' },
  { name: 'Parenteral', value: 2,  color: '#ef4444' },
  { name: 'Hipokalorik',value: 5,  color: '#a855f7' },
];

const BMI_COLOR = (bmi) => bmi < 18.5 ? '#ef4444' : bmi < 25 ? '#10b981' : bmi < 30 ? '#f59e0b' : '#ef4444';

export default function NutritionDietetics({ addNotification }) {
  const [patients] = useState(PATIENTS);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('patients');
  const [editNote, setEditNote] = useState(false);
  const [noteVal, setNoteVal] = useState('');

  const highRisk = patients.filter(p => p.risk === 'high').length;
  const enteral  = patients.filter(p => p.dietType.includes('Enteral')).length;
  const avgBmi   = (patients.reduce((s, p) => s + p.bmi, 0) / patients.length).toFixed(1);

  const selPat = patients.find(p => p.id === selected);

  return (
    <div className="animate-fade-in" style={{ padding: '0 0 60px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Apple size={30} color="var(--primary)"/> Beslenme & Diyetetik
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
            Nütrisyon değerlendirme · Diyet planı · Malnutrisyon taraması
          </p>
        </div>
        <button className="glass-button primary" onClick={() => addNotification?.('info', 'Yeni diyet konsültasyonu oluşturuldu.')} style={{ gap: 8 }}>
          <Plus size={16}/> Konsültasyon Ekle
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Takip Edilen Hasta', value: patients.length, color: 'var(--primary)', icon: <User size={20}/> },
          { label: 'Yüksek Risk',         value: highRisk,         color: '#ef4444',       icon: <AlertTriangle size={20}/> },
          { label: 'Enteral Beslenme',    value: enteral,          color: '#f59e0b',       icon: <TrendingUp size={20}/> },
          { label: 'Ort. VKİ',            value: avgBmi,           color: '#10b981',       icon: <BarChart2 size={20}/> },
        ].map((s, i) => (
          <div key={i} className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {[{ k: 'patients', l: '🥗 Hasta Listesi' }, { k: 'mealplan', l: '📋 Örnek Diyet Planı' }, { k: 'stats', l: '📊 İstatistikler' }].map(t => (
          <button key={t.k} className={`glass-button ${tab === t.k ? 'primary' : ''}`} onClick={() => setTab(t.k)} style={{ fontSize: '0.85rem' }}>{t.l}</button>
        ))}
      </div>

      {/* PATIENTS */}
      {tab === 'patients' && (
        <div style={{ display: 'grid', gridTemplateColumns: selPat ? '1fr 360px' : '1fr', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {patients.map(p => {
              const rc = RISK_CFG[p.risk];
              const sc = STATUS_CFG[p.status];
              const isSel = selected === p.id;
              return (
                <div key={p.id} className="glass-panel" onClick={() => setSelected(isSel ? null : p.id)}
                  style={{ padding: '16px 20px', cursor: 'pointer', border: isSel ? '1px solid var(--primary)' : '1px solid var(--glass-border)', background: isSel ? 'rgba(0,229,255,0.04)' : 'var(--glass-bg)', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 12, background: rc.bg, border: `1px solid ${rc.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: rc.color, fontSize: '1rem' }}>
                        {p.name[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.age} yaş · {p.ward} · {p.diagnosis}</div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 3 }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>🍽 {p.dietType}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>🔥 {p.calories} kcal</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>💪 {p.protein}g protein</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 700, color: rc.color, background: rc.bg }}>{rc.label}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: sc.color }}>{sc.label}</span>
                      <span style={{ fontSize: '0.72rem', color: BMI_COLOR(p.bmi), fontWeight: 700 }}>VKİ {p.bmi}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail Panel */}
          {selPat && (
            <div className="glass-panel" style={{ padding: 20, height: 'fit-content', position: 'sticky', top: 0 }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Apple size={18}/> {selPat.name}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { l: 'Kilo / Boy / VKİ', v: `${selPat.weight}kg / ${selPat.height}cm / ${selPat.bmi}` },
                  { l: 'Diyet Tipi', v: selPat.dietType },
                  { l: 'Günlük Kalori', v: `${selPat.calories} kcal` },
                  { l: 'Protein Hedefi', v: `${selPat.protein}g/gün` },
                  { l: 'Diyetisyen', v: selPat.dietitian },
                ].map((row, i) => (
                  <div key={i} style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{row.l}</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{row.v}</span>
                  </div>
                ))}
                {selPat.allergies.length > 0 && (
                  <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.82rem' }}>
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>⚠️ Alerji: </span>
                    <span style={{ color: 'var(--text-main)' }}>{selPat.allergies.join(', ')}</span>
                  </div>
                )}
                <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', fontSize: '0.82rem' }}>
                  <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Takviyeler</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {selPat.supplements.map(s => (
                      <span key={s} style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(0,229,255,0.12)', color: 'var(--primary)', fontSize: '0.72rem' }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Diyetisyen Notu</span>
                    {!editNote ? (
                      <button onClick={() => { setEditNote(true); setNoteVal(selPat.notes); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.72rem' }}>
                        <Edit3 size={11}/> Düzenle
                      </button>
                    ) : (
                      <button onClick={() => { setEditNote(false); addNotification?.('success', 'Not kaydedildi.'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#10b981', display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.72rem' }}>
                        <Save size={11}/> Kaydet
                      </button>
                    )}
                  </div>
                  {editNote ? (
                    <textarea value={noteVal} onChange={e => setNoteVal(e.target.value)} rows={3}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: 6, padding: 8, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', resize: 'vertical', outline: 'none' }}/>
                  ) : (
                    <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>{selPat.notes}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MEAL PLAN */}
      {tab === 'mealplan' && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ color: 'var(--text-main)', marginBottom: 8, fontWeight: 700 }}>Örnek Diyabetik Diyet Planı (1800 kcal)</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 24 }}>Diyabet Tip 2 · Ahmet Yılmaz · 84kg · 175cm</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MEAL_PLAN.map((meal, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)' }}>
                <div style={{ width: 80, flexShrink: 0, textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.88rem' }}>{meal.meal}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{meal.time}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {meal.items.map((item, j) => (
                      <span key={j} style={{ fontSize: '0.78rem', padding: '3px 10px', borderRadius: 8, background: 'rgba(0,229,255,0.08)', color: 'var(--text-main)', border: '1px solid rgba(0,229,255,0.15)' }}>{item}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f59e0b' }}>{meal.calories} kcal</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{meal.protein}g protein</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 20 }}>
            {[
              { l: 'Toplam Kalori', v: `${MEAL_PLAN.reduce((s,m) => s+m.calories,0)} kcal`, c: '#f59e0b' },
              { l: 'Toplam Protein', v: `${MEAL_PLAN.reduce((s,m) => s+m.protein,0)}g`, c: '#10b981' },
              { l: 'Öğün Sayısı', v: MEAL_PLAN.length, c: 'var(--primary)' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '14px', borderRadius: 10, background: `${s.c}12`, border: `1px solid ${s.c}33`, textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STATS */}
      {tab === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Bölüme Göre Malnutrisyon</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={DEPT_DATA} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                <XAxis dataKey="dept" tick={{ fill: 'var(--text-muted)', fontSize: 10 }}/>
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }}/>
                <Tooltip contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-main)' }}/>
                <Bar dataKey="patients" fill="rgba(0,229,255,0.3)" name="Toplam Hasta" radius={[4,4,0,0]}/>
                <Bar dataKey="malnourished" fill="#ef4444" name="Malnutrisyon" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 16, width: '100%' }}>Beslenme Tipi Dağılımı</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                  {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color}/>)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-main)' }}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
              {PIE_DATA.map(e => (
                <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: e.color }}/>
                  {e.name} ({e.value})
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
