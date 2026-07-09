'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Send, Plus, Trash2, AlertTriangle, CheckCircle,
  Clock, Volume2, PhoneCall, HeartPulse, Activity, TrendingUp,
  TrendingDown, Zap, Shield, User, Phone, MessageSquare,
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
    <div style={{ background: 'rgba(8,14,26,0.97)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px' }}>
      <div style={{ color: '#8aafc7', fontSize: '11px', marginBottom: '6px' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: p.color }} />
          <span style={{ color: '#e2f0f9', fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const DISEASE_COLOR: Record<string, string> = {
  'Hipertansiyon': '#00e5ff', 'Diyabet': '#10b981',
  'Kalp Yetmezliği': '#f59e0b', 'KOAH': '#a78bfa', 'Astım': '#3b82f6',
};

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sendingSms, setSendingSms] = useState(false);
  const [smsLink, setSmsLink] = useState('');
  const [showQsForm, setShowQsForm] = useState(false);
  const [qsName, setQsName] = useState('Günlük Takip');
  const [qsSchedule, setQsSchedule] = useState('09:00');
  const [questions, setQuestions] = useState([{ text: '', responseType: 'NUMERIC' }]);

  const fetchPatient = () => {
    fetch(`/api/patients/${params.id}`)
      .then(r => r.json())
      .then(d => { setPatient(d); setLoading(false); });
  };
  useEffect(() => { fetchPatient(); }, [params.id]);

  const handleSendManual = async () => {
    setSendingSms(true); setSmsLink('');
    const res = await fetch('/api/send-questions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patientId: patient.id }) });
    const data = await res.json();
    if (data.ok) setSmsLink(data.link);
    setSendingSms(false); fetchPatient();
  };

  const handleCreateQs = async () => {
    if (!questions[0].text) return;
    await fetch('/api/question-sets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patientId: patient.id, name: qsName, schedule: qsSchedule, days: '1,2,3,4,5,6,7', questions: questions.map((q, i) => ({ ...q, orderIndex: i, isThreshold: true })) }) });
    setShowQsForm(false); setQuestions([{ text: '', responseType: 'NUMERIC' }]); fetchPatient();
  };

  const resolveAlert = async (id: string) => {
    await fetch('/api/alerts', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, resolvedNote: 'Doktor tarafından incelendi.' }) });
    fetchPatient();
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
      <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }} />
      <span style={{ color: '#4d6b82', fontSize: '14px' }}>Hasta verileri yükleniyor…</span>
    </div>
  );
  if (!patient) return <div style={{ padding: '60px', textAlign: 'center', color: '#4d6b82' }}>Hasta bulunamadı.</div>;

  const activeAlerts = patient.alerts?.filter((a: any) => !a.resolvedAt) || [];
  const color = DISEASE_COLOR[patient.disease] || '#00e5ff';

  /* chart data */
  const responses = [...(patient.responses || [])].filter(r => r.value !== null).sort((a, b) => new Date(a.respondedAt).getTime() - new Date(b.respondedAt).getTime());
  const chartData = responses.map(r => ({
    date: new Date(r.respondedAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
    value: r.value,
  }));

  const lastVal = responses.length ? responses[responses.length - 1].value : null;
  const avgVal  = responses.length ? Math.round(responses.reduce((s, r) => s + r.value, 0) / responses.length) : null;
  const criticalCount = patient.alerts?.filter((a: any) => !a.resolvedAt).length ?? 0;
  const lastResponse  = responses.length ? new Date(responses[responses.length - 1].respondedAt).toLocaleDateString('tr-TR') : '—';

  /* health score */
  const healthScore = criticalCount > 0 ? 28 : lastVal !== null && avgVal !== null
    ? Math.max(0, Math.min(100, 100 - Math.round(((lastVal - patient.thresholdValue) / patient.thresholdValue) * 100)))
    : 82;
  const hsColor = healthScore > 70 ? '#10b981' : healthScore > 40 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="animate-in" style={{ paddingBottom: '48px' }}>

      {/* ── Back + Hero ── */}
      <div style={{ marginBottom: '24px' }}>
        <Link href="/dashboard/patients" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4d6b82', textDecoration: 'none', marginBottom: '16px', fontWeight: 500 }}>
          <ArrowLeft size={15} />Hasta Listesine Dön
        </Link>

        {/* Hero card */}
        <div className="card" style={{ padding: '28px 32px', position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, rgba(8,14,26,0.9) 0%, ${color}08 100%)`, borderColor: `${color}20` }}>
          {/* Background glow */}
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: color, filter: 'blur(60px)', opacity: 0.06, pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{ width: '68px', height: '68px', borderRadius: '18px', background: `${color}18`, border: `2px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 800, color, flexShrink: 0 }}>
              {patient.name[0]}
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e2f0f9', letterSpacing: '-0.3px' }}>{patient.name}</h1>
                {activeAlerts.length > 0
                  ? <div className="badge badge-danger badge-pulse"><AlertTriangle size={11} />Kritik Alarm</div>
                  : patient.isActive
                  ? <div className="badge badge-success"><CheckCircle size={11} />Aktif Takip</div>
                  : <div className="badge badge-muted">Pasif</div>}
              </div>
              <div style={{ fontSize: '13px', color: '#4d6b82', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />{patient.disease}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Phone size={11} />{patient.phone}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MessageSquare size={11} />{patient.literacyLevel === 'LITERATE' ? 'SMS Takip' : 'Sesli Arama'}</span>
              </div>
            </div>

            {/* Health ring */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ position: 'relative', width: '72px', height: '72px' }}>
                <svg viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)', width: '72px', height: '72px' }}>
                  <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                  <circle cx="36" cy="36" r="30" fill="none" stroke={hsColor} strokeWidth="6"
                    strokeDasharray={`${(healthScore / 100) * 188.5} 188.5`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(0.22,1,0.36,1)' }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: hsColor, lineHeight: 1 }}>{healthScore}</div>
                </div>
              </div>
              <div style={{ fontSize: '10px', color: '#4d6b82', fontWeight: 600, textAlign: 'center' }}>Sağlık Skoru</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metric cards row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Son Ölçüm',    value: lastVal !== null ? `${lastVal} ${patient.thresholdLabel?.split(' ')[0]}` : '—', icon: Activity,    color: '#00e5ff', dim: 'rgba(0,229,255,0.08)',   sub: 'En güncel değer' },
          { label: 'Ortalama',     value: avgVal !== null ? `${avgVal} ${patient.thresholdLabel?.split(' ')[0]}` : '—',  icon: TrendingUp,  color: '#a78bfa', dim: 'rgba(167,139,250,0.08)', sub: `${responses.length} ölçüm üzerinden` },
          { label: 'Kritik Alarm', value: criticalCount,                                                                   icon: AlertTriangle,color: criticalCount > 0 ? '#f43f5e' : '#10b981', dim: criticalCount > 0 ? 'rgba(244,63,94,0.08)' : 'rgba(16,185,129,0.08)', sub: 'Açık alarm sayısı' },
          { label: 'Son Yanıt',    value: lastResponse,                                                                    icon: Clock,       color: '#f59e0b', dim: 'rgba(245,158,11,0.08)', sub: 'Son ölçüm tarihi' },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="card animate-in" style={{ padding: '18px 20px', animationDelay: `${i * 0.05}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: m.dim, border: `1px solid ${m.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={m.color} />
                </div>
                <span style={{ fontSize: '11px', color: '#4d6b82', fontWeight: 600 }}>{m.label}</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: m.color, letterSpacing: '-0.3px', lineHeight: 1 }}>{m.value}</div>
              <div style={{ fontSize: '10px', color: '#2d4255', marginTop: '5px' }}>{m.sub}</div>
            </div>
          );
        })}
      </div>

      {/* ── Main grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>

        {/* Left col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Settings + Send */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2f0f9', marginBottom: '14px' }}>Takip Ayarları</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              {[
                { label: 'Kritik Eşik',  val: `${patient.thresholdValue} ${patient.thresholdLabel}` },
                { label: 'Kanal',        val: patient.contactMethod },
                { label: 'Okuryazarlık',val: patient.literacyLevel === 'LITERATE' ? 'Okuryazar (SMS)' : 'Sesli Arama' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: '#4d6b82' }}>{row.label}</span>
                  <span style={{ fontWeight: 600, color: '#e2f0f9', textAlign: 'right', maxWidth: '60%' }}>{row.val}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleSendManual}
              disabled={sendingSms || patient.questionSets.length === 0}
              className="btn"
              style={{ marginTop: '18px', width: '100%', justifyContent: 'center', fontSize: '13px', background: patient.literacyLevel === 'ILLITERATE' ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#00e5ff,#00c4e0)', color: '#000', fontWeight: 700, boxShadow: patient.literacyLevel === 'ILLITERATE' ? '0 4px 16px rgba(245,158,11,0.35)' : '0 4px 16px rgba(0,229,255,0.3)' }}
            >
              {sendingSms
                ? <><div className="spinner" style={{ width: '15px', height: '15px', borderWidth: '2px' }} />Gönderiliyor…</>
                : patient.literacyLevel === 'ILLITERATE'
                ? <><Volume2 size={15} />YZ Araması Başlat</>
                : <><Send size={15} />Soruları Gönder (SMS)</>}
            </button>

            {patient.questionSets.length === 0 && (
              <p style={{ fontSize: '11px', color: '#f43f5e', textAlign: 'center', marginTop: '8px' }}>Önce bir soru seti oluşturun.</p>
            )}

            {smsLink && (
              <div style={{ marginTop: '14px', padding: '12px', borderRadius: '10px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', marginBottom: '6px' }}>✓ SMS Gönderildi! Simülasyon linki:</div>
                <a href={smsLink} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#e2f0f9', wordBreak: 'break-all', textDecoration: 'underline' }}>{smsLink}</a>
              </div>
            )}
          </div>

          {/* AI Risk */}
          <div className="card" style={{ padding: '22px', background: 'linear-gradient(135deg,rgba(167,139,250,0.06),rgba(59,130,246,0.06))', borderColor: 'rgba(167,139,250,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(167,139,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={14} color="#a78bfa" />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#e2f0f9' }}>YZ Risk Analizi</span>
              <div className="badge badge-purple" style={{ marginLeft: 'auto', fontSize: '10px' }}>Beta</div>
            </div>
            <div style={{ fontSize: '12px', color: '#8aafc7', lineHeight: '1.7', marginBottom: '14px' }}>
              {criticalCount > 0
                ? `⚠️ Hastanın son ölçümleri kritik eşiği aşmaktadır. Acil klinik müdahale önerilir. Gerekirse ambulans talebi yapılabilir.`
                : `✅ Hasta parametreleri normal aralıkta seyrediyor. Mevcut tedavi planının sürdürülmesi önerilir. Sonraki kontrol: 7 gün.`}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', background: criticalCount > 0 ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)', border: `1px solid ${criticalCount > 0 ? 'rgba(244,63,94,0.2)' : 'rgba(16,185,129,0.2)'}` }}>
                <div style={{ fontSize: '10px', color: '#4d6b82', marginBottom: '3px' }}>Risk Seviyesi</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: criticalCount > 0 ? '#f43f5e' : '#10b981' }}>{criticalCount > 0 ? 'YÜKSEK' : 'DÜŞÜK'}</div>
              </div>
              <div style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)' }}>
                <div style={{ fontSize: '10px', color: '#4d6b82', marginBottom: '3px' }}>Güven Skoru</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#a78bfa' }}>87%</div>
              </div>
            </div>
          </div>

          {/* Active alerts */}
          {activeAlerts.length > 0 && (
            <div className="card card-danger" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <AlertTriangle size={18} color="#f43f5e" />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#f43f5e' }}>Açık Alarmlar ({activeAlerts.length})</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeAlerts.map((a: any) => (
                  <div key={a.id} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2f0f9', marginBottom: '4px' }}>Ölçüm: {a.triggerValue}</div>
                    <div style={{ fontSize: '11px', color: '#f43f5e', marginBottom: '8px' }}>{a.message}</div>
                    <div style={{ fontSize: '10px', color: '#4d6b82', marginBottom: '10px' }}>{new Date(a.createdAt).toLocaleString('tr-TR')}</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button className="btn btn-danger btn-sm"><PhoneCall size={12} />Ambulans</button>
                      <button className="btn btn-success btn-sm"><HeartPulse size={12} />Reçete</button>
                      <button onClick={() => resolveAlert(a.id)} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                        <CheckCircle size={12} />Kapat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Line chart */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#e2f0f9' }}>Ölçüm Trendi</div>
                <div style={{ fontSize: '12px', color: '#4d6b82', marginTop: '2px' }}>Zamana göre değer değişimi</div>
              </div>
              <div style={{ fontSize: '11px', color: '#4d6b82', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f43f5e' }} />Kritik Eşik: {patient.thresholdValue}
              </div>
            </div>
            {chartData.length > 0 ? (
              <div style={{ height: '230px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="date" stroke="#4d6b82" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4d6b82" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<CUSTOM_TOOLTIP />} />
                    <ReferenceLine y={patient.thresholdValue} stroke="#f43f5e" strokeDasharray="4 4" label={{ position: 'top', value: 'Kritik', fill: '#f43f5e', fontSize: 10 }} />
                    <Area type="monotone" dataKey="value" stroke={color} strokeWidth={3} fill="url(#gVal)" dot={{ r: 4, fill: '#0b1626', stroke: color, strokeWidth: 2 }} activeDot={{ r: 6, fill: color }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px' }}>
                <Activity size={32} color="#2d4255" />
                <span style={{ color: '#4d6b82', fontSize: '13px' }}>Henüz ölçüm verisi yok.</span>
              </div>
            )}
          </div>

          {/* Question sets */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#e2f0f9' }}>Aktif Soru Seti</div>
              {!showQsForm && patient.questionSets.length === 0 && (
                <button onClick={() => setShowQsForm(true)} className="btn btn-primary btn-sm"><Plus size={14} />Set Oluştur</button>
              )}
            </div>

            {showQsForm && (
              <div style={{ marginBottom: '16px', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', marginBottom: '12px' }}>
                  <div><label className="input-label">Set Adı</label><input value={qsName} onChange={e => setQsName(e.target.value)} className="input" placeholder="Günlük Takip" /></div>
                  <div><label className="input-label">Saat</label><input type="time" value={qsSchedule} onChange={e => setQsSchedule(e.target.value)} className="input" style={{ width: '110px' }} /></div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label className="input-label">Soru</label>
                  <input value={questions[0].text} onChange={e => { const n = [...questions]; n[0].text = e.target.value; setQuestions(n); }} className="input" placeholder="Örn: Bugünkü büyük tansiyonunuz kaç?" />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleCreateQs} className="btn btn-primary btn-sm"><CheckCircle size={13} />Kaydet</button>
                  <button onClick={() => setShowQsForm(false)} className="btn btn-ghost btn-sm">İptal</button>
                </div>
              </div>
            )}

            {patient.questionSets.length > 0 ? patient.questionSets.map((qs: any) => (
              <div key={qs.id} className="card card-primary" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ fontWeight: 700, color: '#e2f0f9', fontSize: '13px' }}>{qs.name}</div>
                  <div className="badge badge-primary"><Clock size={11} />Her gün {qs.schedule}</div>
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {qs.questions.map((q: any) => (
                    <li key={q.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#8aafc7' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0, marginTop: '5px' }} />
                      {q.text}
                    </li>
                  ))}
                </ul>
              </div>
            )) : !showQsForm && (
              <div style={{ textAlign: 'center', padding: '24px 16px', color: '#4d6b82', fontSize: '13px' }}>
                Bu hasta için soru seti tanımlanmamış. Sistem otomatik soru gönderemez.
              </div>
            )}
          </div>

          {/* Recent responses */}
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#e2f0f9', marginBottom: '14px' }}>Son Yanıtlar</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {patient.responses?.slice(0, 6).map((r: any) => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.015)' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2f0f9' }}>{r.rawAnswer}</div>
                    <div style={{ fontSize: '11px', color: '#4d6b82', marginTop: '2px' }}>{r.question?.text}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#4d6b82' }}>{new Date(r.respondedAt).toLocaleDateString('tr-TR')}</div>
                    <div style={{ marginTop: '4px' }}>
                      {r.triggeredAlert
                        ? <span className="badge badge-danger" style={{ fontSize: '10px' }}>Eşik Aşıldı</span>
                        : <span className="badge badge-success" style={{ fontSize: '10px' }}>Normal</span>}
                    </div>
                  </div>
                </div>
              ))}
              {(!patient.responses || patient.responses.length === 0) && (
                <div style={{ textAlign: 'center', padding: '24px', color: '#4d6b82', fontSize: '13px' }}>Kayıt yok.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
