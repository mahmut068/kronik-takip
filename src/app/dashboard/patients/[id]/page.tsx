'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ArrowLeft, Send, Plus, Trash2, AlertTriangle, CheckCircle,
  Clock, Volume2, PhoneCall, HeartPulse, Activity, TrendingUp,
  TrendingDown, Zap, Shield, User, Phone, MessageSquare, Edit3, Loader2,
  Ambulance, Calendar, Smartphone, Info, Contact2
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';

const CUSTOM_TOOLTIP = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
      <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color }} />
          <span style={{ color: '#0f172a', fontWeight: 800 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const DISEASE_COLOR: Record<string, string> = {
  'Hipertansiyon': '#0ea5e9',
  'Diyabet': '#10b981',
  'Tip 2 Diyabet': '#10b981',
  'Kalp Yetmezliği': '#f59e0b',
  'KOAH': '#8b5cf6',
  'Astım': '#3b82f6',
  'Kronik Böbrek Hastalığı': '#e11d48',
};

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sendingSms, setSendingSms] = useState(false);
  const [smsLink, setSmsLink] = useState('');
  
  // Takip Planı & Eşikler
  const [showQsForm, setShowQsForm] = useState(false);
  const [qsName, setQsName] = useState('Günlük Takip');
  const [qsSchedule, setQsSchedule] = useState('09:00');
  const [yellowThreshold, setYellowThreshold] = useState(''); // Doktor Randevusu
  const [redThreshold, setRedThreshold] = useState(''); // Acil Durum (Ambulans)
  const [questions, setQuestions] = useState([{ text: '', responseType: 'NUMERIC' }]);
  
  const { t, lang } = useLanguage();

  // V10.0 Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'patient', text: 'Hocam tansiyonum ilacı aldıktan sonra da yüksek çıkıyor, ne yapmalıyım?', time: '10:30' },
    { id: 2, sender: 'doctor', text: 'İlacı her gün aynı saatte mi alıyorsunuz? Yarım dozluk ek bir ilaç reçete edebilirim.', time: '10:35' }
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { id: Date.now(), sender: 'doctor', text: chatInput, time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
  };

  const fetchPatient = () => {
    fetch(`/api/patients/${params.id}`)
      .then(r => r.json())
      .then(d => { setPatient(d); setLoading(false); })
      .catch(e => { console.error(e); setLoading(false); });
  };
  
  useEffect(() => { fetchPatient(); }, [params.id]);

  const handleSendManual = async () => {
    setSendingSms(true); setSmsLink('');
    try {
      const res = await fetch('/api/send-questions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patientId: patient?.id }) });
      const data = await res.json();
      if (data.ok) setSmsLink(data.link);
    } catch (e) {}
    setSendingSms(false);
    fetchPatient();
  };

  const handleCreateQs = async () => {
    if (!questions[0].text) return;
    
    // API Call - Dual Threshold Logic (Mock or real implementation based on backend)
    await fetch('/api/question-sets', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ 
        patientId: patient?.id, 
        name: qsName, 
        schedule: qsSchedule, 
        days: '1,2,3,4,5,6,7', 
        yellowThreshold: Number(yellowThreshold),
        redThreshold: Number(redThreshold),
        questions: questions.map((q, i) => ({ ...q, orderIndex: i, isThreshold: true })) 
      }) 
    });
    
    setShowQsForm(false); 
    setQuestions([{ text: '', responseType: 'NUMERIC' }]); 
    setYellowThreshold(''); setRedThreshold('');
    fetchPatient();
  };

  const resolveAlert = async (id: string) => {
    await fetch('/api/alerts', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, resolvedNote: 'Doktor tarafından incelendi.' }) });
    fetchPatient();
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
      <Loader2 size={32} className="spin" color="#2563eb" />
      <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Hasta verileri derleniyor…</span>
    </div>
  );
  
  if (!patient) return <div style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontWeight: 500 }}>Sistemde böyle bir hasta bulunamadı.</div>;

  const color = DISEASE_COLOR[patient.disease] || '#2563eb';
  const hasAlerts = patient.alerts?.some((a: any) => !a.resolved);
  const healthScore = 85;

  // Mock Trend Verileri (Gerçekte backend'den alınabilir)
  const MOCK_TRENDS = [
    { date: '1 Tem', deger: 125 }, { date: '2 Tem', deger: 130 },
    { date: '3 Tem', deger: 128 }, { date: '4 Tem', deger: 142 },
    { date: '5 Tem', deger: 138 }, { date: '6 Tem', deger: 145 },
    { date: '7 Tem', deger: 135 }
  ];

  return (
    <div className="animate-in" style={{ paddingBottom: '60px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* ── Top Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.push('/dashboard/patients')} className="btn btn-ghost" style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <ArrowLeft size={20} color="#475569" />
          </button>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {patient.name}
              {hasAlerts && <span className="badge" style={{ background: '#fef2f2', color: '#e11d48', padding: '4px 10px', fontSize: '12px', fontWeight: 800, border: '1px solid #fecdd3' }}>KRİTİK UYARI</span>}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
              <span>{patient.tcNo}</span> • <span>{patient.age} Yaş</span> • <span>{patient.gender === 'M' ? 'Erkek' : 'Kadın'}</span>
            </div>
          </div>
        </div>
        
        {/* Okur Yazar Durumuna Göre Akıllı İletişim Butonu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
           {patient.literacyLevel === 'ILLITERATE' ? (
              <button disabled={sendingSms} onClick={handleSendManual} className="btn" style={{ background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe', padding: '12px 20px', fontWeight: 700 }}>
                {sendingSms ? <><Loader2 size={18} className="spin" /> {t('patient_detail.ai_call_loading')}</> : <><Volume2 size={18} /> {t('patient_detail.ai_call')}</>}
              </button>
           ) : (
              <button disabled={sendingSms} onClick={handleSendManual} className="btn" style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '12px 20px', fontWeight: 700 }}>
                {sendingSms ? <><Loader2 size={18} className="spin" /> {t('patient_detail.custom_sms_loading')}</> : <><Smartphone size={18} /> {t('patient_detail.custom_sms')}</>}
              </button>
           )}
           <button className="btn btn-primary" style={{ padding: '12px 24px', background: '#0f172a', color: '#ffffff', fontWeight: 700 }}>
              <Edit3 size={18} /> {t('patient_detail.edit_profile')}
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Main Info Card */}
          <div className="card" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', padding: '32px', display: 'flex', gap: '40px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: color }} />
            
            {/* Health Score Ring */}
            <div style={{ flexShrink: 0, textAlign: 'center' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: `conic-gradient(${color} ${healthScore}%, #f1f5f9 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', padding: '8px' }}>
                <div style={{ width: '100%', height: '100%', background: '#ffffff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{healthScore}</span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', marginTop: '2px', textTransform: 'uppercase' }}>SKOR</span>
                </div>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color, background: color+'15', padding: '4px 12px', borderRadius: '20px', display: 'inline-block' }}>
                {patient.disease}
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', alignContent: 'center' }}>
              {[
                { label: 'Son Ölçüm (Tansiyon)', val: '145/90', sub: '2 saat önce', icon: Activity, c: '#e11d48' },
                { label: 'Tedavi Uyumu', val: '%92', sub: 'Son 30 gün', icon: CheckCircle, c: '#10b981' },
                { label: 'Telefon Numarası', val: patient.phone, sub: patient.literacyLevel === 'ILLITERATE' ? 'Sesli Arama' : 'SMS Destekli', icon: Phone, c: '#2563eb' },
                { label: 'Son Yanıt Süresi', val: '12 dk', sub: 'Ortalama', icon: Clock, c: '#8b5cf6' },
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: m.c+'10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <m.icon size={20} color={m.c} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>{m.label}</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{m.val}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, marginTop: '2px' }}>{m.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Section */}
          <div className="card" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>Tarihsel Veri Analizi</h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontWeight: 500 }}>Sistolik Kan Basıncı (mmHg)</p>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                    <div style={{ width: '12px', height: '4px', background: color, borderRadius: '2px' }} /> Hasta Verisi
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#e11d48' }}>
                    <div style={{ width: '12px', height: '2px', background: '#e11d48', borderTop: '2px dashed #e11d48' }} /> Kritik Eşik (140)
                 </div>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_TRENDS} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDeger" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CUSTOM_TOOLTIP />} />
                  <ReferenceLine y={140} stroke="#e11d48" strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="deger" stroke={color} strokeWidth={3} fillOpacity={1} fill="url(#colorDeger)" activeDot={{ r: 6, fill: '#ffffff', stroke: color, strokeWidth: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secure Messaging */}
          <div className="card" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', height: '400px' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Klinik Mesajlaşma</h3>
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> Çevrimiçi (Uçtan Uca Şifreli)
                </span>
              </div>
            </div>
            
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#fafafa' }}>
              {chatMessages.map(m => (
                <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'doctor' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ 
                    maxWidth: '80%', padding: '12px 16px', borderRadius: '16px', fontSize: '14px', lineHeight: '1.5',
                    background: m.sender === 'doctor' ? '#2563eb' : '#e2e8f0',
                    color: m.sender === 'doctor' ? '#ffffff' : '#0f172a',
                    borderBottomRightRadius: m.sender === 'doctor' ? '4px' : '16px',
                    borderBottomLeftRadius: m.sender === 'patient' ? '4px' : '16px',
                  }}>
                    {m.text}
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', fontWeight: 500 }}>{m.time}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px', background: '#ffffff' }}>
              <input 
                type="text" 
                placeholder="Hastaya güvenli mesaj gönderin..." 
                className="input" 
                style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '0 20px', fontSize: '14px' }}
                value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage} className="btn btn-primary" style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0, justifyContent: 'center' }}>
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Hasta Yakını (Acil Durum İletişimi) */}
          <div className="card" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', padding: '24px' }}>
             <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Contact2 size={18} color="#64748b" />
               Hasta Yakını İletişimi
             </h3>
             <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                 <User size={20} color="#64748b" />
               </div>
               <div style={{ flex: 1 }}>
                 <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Ayşe Yılmaz (Kızı)</div>
                 <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>0532 999 88 77</div>
               </div>
             </div>
             <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
               <button className="btn" style={{ flex: 1, background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', fontSize: '13px', fontWeight: 700, padding: '10px' }}>
                 <Phone size={16} /> {t('patient_detail.relative_call')}
               </button>
               <button className="btn" style={{ flex: 1, background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', fontSize: '13px', fontWeight: 700, padding: '10px' }}>
                 <AlertTriangle size={16} /> {t('patient_detail.urgent_sms')}
               </button>
             </div>
          </div>

          {/* V10 AI Risk Modülü */}
          <div className="card" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} color="#f59e0b" />
                V10 Klinik Zeka Sentezi
              </h3>
            </div>
            
            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>Kümülatif Risk Skoru</span>
                <span style={{ fontSize: '14px', fontWeight: 900, color: '#10b981' }}>DÜŞÜK RİSK</span>
              </div>
              <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '25%', height: '100%', background: '#10b981', borderRadius: '4px' }} />
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '12px', lineHeight: '1.5', fontWeight: 500 }}>
                Model tahmini: Gelecek 7 gün içinde akut alevlenme riski <strong>%12</strong>. Mevcut tedavi planına uyum devam etmeli.
              </p>
            </div>
          </div>

          {/* Çift Eşikli Plan Formu */}
          <div className="card" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="#64748b" />
              Aktif Takip ve Eşik Değerler
            </h3>
            
            {!showQsForm ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {patient.questionSets?.map((qs: any) => (
                  <div key={qs.id} style={{ padding: '16px', background: '#fafafa', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{qs.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>Her gün saat {qs.scheduleTime}</div>
                  </div>
                ))}
                <button onClick={() => setShowQsForm(true)} className="btn btn-ghost" style={{ width: '100%', height: '48px', border: '1px dashed #cbd5e1', color: '#2563eb', fontWeight: 700, fontSize: '14px' }}>
                  <Plus size={18} /> Yeni Çift Eşikli Plan Ekle
                </button>
              </div>
            ) : (
              <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', display: 'block' }}>Plan Adı</label>
                  <input type="text" className="input" value={qsName} onChange={e => setQsName(e.target.value)} style={{ width: '100%', padding: '10px 16px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '10px' }} />
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                   <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={16} color="#f59e0b" /> Çift Eşik Sistemi
                   </div>
                   
                   <div>
                     <label style={{ fontSize: '12px', fontWeight: 700, color: '#b45309', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                       <span>Sarı Eşik (Randevu Aç)</span>
                     </label>
                     <input type="number" placeholder="Örn: 135" value={yellowThreshold} onChange={e => setYellowThreshold(e.target.value)} className="input" style={{ width: '100%', padding: '10px 16px', fontSize: '14px', border: '1px solid #fcd34d', background: '#fffbeb', borderRadius: '10px' }} />
                   </div>

                   <div>
                     <label style={{ fontSize: '12px', fontWeight: 700, color: '#be123c', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                       <span>Kırmızı Eşik (Acil / Ambulans)</span>
                     </label>
                     <input type="number" placeholder="Örn: 180" value={redThreshold} onChange={e => setRedThreshold(e.target.value)} className="input" style={{ width: '100%', padding: '10px 16px', fontSize: '14px', border: '1px solid #fecdd3', background: '#fff1f2', borderRadius: '10px' }} />
                   </div>
                </div>

                {questions.map((q, i) => (
                  <div key={i}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', display: 'block' }}>Sorulacak Soru</label>
                    <input type="text" className="input" placeholder="Örn: Tansiyonunuz kaç çıktı?" value={q.text} onChange={e => { const newQ = [...questions]; newQ[i].text = e.target.value; setQuestions(newQ); }} style={{ width: '100%', padding: '10px 16px', fontSize: '14px', border: '1px solid #e2e8f0', borderRadius: '10px' }} />
                  </div>
                ))}
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button onClick={() => setShowQsForm(false)} className="btn btn-ghost" style={{ flex: 1, border: '1px solid #e2e8f0', color: '#475569', fontWeight: 700 }}>İptal</button>
                  <button onClick={handleCreateQs} className="btn btn-primary" style={{ flex: 1, background: '#2563eb', fontWeight: 700 }}>Kaydet</button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
