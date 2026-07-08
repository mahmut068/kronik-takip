import React, { useState, useMemo } from 'react';
import { Star, MessageCircle, ThumbsUp, ThumbsDown, TrendingUp, BarChart2, Filter, Send, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const DEPARTMENTS = ['Kardiyoloji', 'Dahiliye', 'Acil Servis', 'Radyoloji', 'Cerrahi', 'YBÜ'];

const FEEDBACK_DATA = [
  { id: 1, patient: 'Ahmet Yılmaz',  dept: 'Kardiyoloji', date: '2026-07-05', rating: 5, category: 'Doktor', comment: 'Doktorum çok ilgili ve açıklayıcıydı. Tedavi süreci hakkında detaylı bilgi aldım.', sentiment: 'positive', nps: 9 },
  { id: 2, patient: 'Fatma Şahin',   dept: 'Acil Servis',  date: '2026-07-05', rating: 3, category: 'Bekleme',comment: 'Bekleme süresi çok uzundu, 2 saat bekledim. Ama sağlık personeli anlayışlıydı.', sentiment: 'neutral',  nps: 6 },
  { id: 3, patient: 'Mehmet Demir',  dept: 'Dahiliye',     date: '2026-07-04', rating: 5, category: 'Hemşire', comment: 'Hemşireler son derece özenli ve güler yüzlüydü. Teşekkür ederim.', sentiment: 'positive', nps: 10 },
  { id: 4, patient: 'Ayşe Kaya',     dept: 'Radyoloji',    date: '2026-07-04', rating: 4, category: 'Temizlik', comment: 'Bölüm temizdi ve personel yardımseverdi. Biraz daha hızlı olabilirdi.', sentiment: 'positive', nps: 8 },
  { id: 5, patient: 'Kemal Avcı',    dept: 'Cerrahi',      date: '2026-07-03', rating: 2, category: 'İletişim', comment: 'Ameliyat sonrası bilgilendirme yetersizdi. Sonuçları öğrenmekte güçlük çektim.', sentiment: 'negative', nps: 4 },
  { id: 6, patient: 'Selin Doğan',   dept: 'YBÜ',          date: '2026-07-03', rating: 5, category: 'Doktor',  comment: 'YBÜ ekibi inanılmaz. Her an yanımızdaydılar, çok teşekkür ederiz.', sentiment: 'positive', nps: 10 },
  { id: 7, patient: 'Turhan Bey',    dept: 'Kardiyoloji',  date: '2026-07-02', rating: 1, category: 'Bekleme', comment: 'Randevuma rağmen 3 saat bekletildim. Kabul edilemez bir durum.', sentiment: 'negative', nps: 2 },
  { id: 8, patient: 'Nilüfer Hanım', dept: 'Dahiliye',     date: '2026-07-01', rating: 4, category: 'Hemşire', comment: 'İyi bir deneyimdi. Hemşireler her zaman müsaitti.', sentiment: 'positive', nps: 8 },
];

const CATEGORIES = ['Doktor', 'Hemşire', 'Bekleme', 'Temizlik', 'İletişim'];

const RADAR_DATA = [
  { subject: 'Doktor',    value: 88 },
  { subject: 'Hemşire',   value: 92 },
  { subject: 'Temizlik',  value: 85 },
  { subject: 'Bekleme',   value: 64 },
  { subject: 'İletişim',  value: 76 },
  { subject: 'Konfor',    value: 80 },
];

const MONTHLY_SCORES = [
  { ay: 'Oca', puan: 4.1 }, { ay: 'Şub', puan: 4.2 }, { ay: 'Mar', puan: 4.0 },
  { ay: 'Nis', puan: 4.3 }, { ay: 'May', puan: 4.4 }, { ay: 'Haz', puan: 4.2 },
  { ay: 'Tem', puan: 4.35 },
];

const StarRating = ({ value, size = 14 }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[1,2,3,4,5].map(s => (
      <Star key={s} size={size} fill={s <= value ? '#f59e0b' : 'transparent'} color={s <= value ? '#f59e0b' : '#475569'} />
    ))}
  </div>
);

const SENTIMENT_CFG = {
  positive: { label: 'Olumlu', color: 'var(--success)', bg: 'rgba(16,185,129,0.1)',  icon: <ThumbsUp size={12}/> },
  neutral:  { label: 'Nötr',   color: '#f59e0b',        bg: 'rgba(245,158,11,0.1)', icon: <MessageCircle size={12}/> },
  negative: { label: 'Olumsuz',color: 'var(--danger)',  bg: 'rgba(244,63,94,0.1)',  icon: <ThumbsDown size={12}/> },
};

export default function PatientFeedback({ addNotification }) {
  const [filterDept, setFilterDept] = useState('all');
  const [filterSentiment, setFilterSentiment] = useState('all');
  const [tab, setTab] = useState('overview');
  const [replyText, setReplyText] = useState('');
  const [repliedIds, setRepliedIds] = useState(new Set());

  const filtered = useMemo(() => FEEDBACK_DATA.filter(f => {
    const matchDept = filterDept === 'all' || f.dept === filterDept;
    const matchSent = filterSentiment === 'all' || f.sentiment === filterSentiment;
    return matchDept && matchSent;
  }), [filterDept, filterSentiment]);

  const avgRating  = (FEEDBACK_DATA.reduce((s, f) => s + f.rating, 0) / FEEDBACK_DATA.length).toFixed(1);
  const positivePct= Math.round(FEEDBACK_DATA.filter(f => f.sentiment === 'positive').length / FEEDBACK_DATA.length * 100);
  const avgNPS     = Math.round(FEEDBACK_DATA.reduce((s, f) => s + f.nps, 0) / FEEDBACK_DATA.length);
  const promoters  = FEEDBACK_DATA.filter(f => f.nps >= 9).length;
  const detractors = FEEDBACK_DATA.filter(f => f.nps <= 6).length;
  const npsScore   = Math.round(((promoters - detractors) / FEEDBACK_DATA.length) * 100);

  const deptAvg = DEPARTMENTS.map(dept => ({
    dept: dept.length > 8 ? dept.substring(0,8) + '..' : dept,
    puan: parseFloat((FEEDBACK_DATA.filter(f => f.dept === dept).reduce((s, f) => s + f.rating, 0) / Math.max(1, FEEDBACK_DATA.filter(f => f.dept === dept).length)).toFixed(2)),
  }));

  const sendReply = (id) => {
    if (!replyText.trim()) return;
    setRepliedIds(prev => new Set([...prev, id]));
    setReplyText('');
    addNotification?.('success', 'Hasta geri bildirimine yanıt gönderildi.');
  };

  return (
    <div className="animate-fade-in" style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Star size={26} color="#f59e0b" fill="#f59e0b" /> Hasta Memnuniyeti
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            Geri bildirim analizi, NPS skoru ve bölüm karşılaştırması
          </p>
        </div>
      </div>

      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {[
          { label: 'Ortalama Puan',    value: avgRating,     sub: '5 üzerinden',    color: '#f59e0b', icon: <Star size={20} fill="#f59e0b"/> },
          { label: 'Olumlu Oran',      value: `${positivePct}%`, sub: 'Memnun hasta', color: 'var(--success)', icon: <ThumbsUp size={20}/> },
          { label: 'NPS Skoru',        value: npsScore,      sub: `${promoters} promoter`, color: 'var(--primary)', icon: <TrendingUp size={20}/> },
          { label: 'Toplam Geri Bildirim', value: FEEDBACK_DATA.length, sub: 'Bu ay', color: '#a855f7', icon: <MessageCircle size={20}/> },
        ].map((s, i) => (
          <div key={i} className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>{s.label}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', opacity: 0.7 }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { key: 'overview',  label: 'Genel Analiz' },
          { key: 'feedback',  label: `Geri Bildirimler (${FEEDBACK_DATA.length})` },
        ].map(t => (
          <button key={t.key} className={`glass-button ${tab === t.key ? 'primary' : ''}`} onClick={() => setTab(t.key)} style={{ fontSize: '0.85rem' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, minHeight: 0, overflowY: 'auto' }}>
          {/* Dept Scores Bar */}
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart2 size={16} color="var(--primary)"/> Bölüm Puan Ortalamaları
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptAvg} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false}/>
                <XAxis type="number" domain={[0, 5]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }}/>
                <YAxis type="category" dataKey="dept" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} width={70}/>
                <Tooltip formatter={v => [`${v} / 5`, 'Ortalama Puan']} contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-main)' }}/>
                <Bar dataKey="puan" fill="url(#deptGrad)" radius={[0,6,6,0]} name="Puan"/>
                <defs>
                  <linearGradient id="deptGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.6}/>
                    <stop offset="100%" stopColor="#00e5ff"/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar */}
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Memnuniyet Boyutları</div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius={80}>
                <PolarGrid stroke="rgba(255,255,255,0.1)"/>
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11 }}/>
                <PolarRadiusAxis angle={30} domain={[0,100]} tick={{ fill: 'var(--text-muted)', fontSize: 9 }}/>
                <Radar name="Puan" dataKey="value" stroke="#00e5ff" fill="#00e5ff" fillOpacity={0.2} strokeWidth={2}/>
                <Tooltip contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-main)' }}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trend */}
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Aylık Puan Trendi</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={MONTHLY_SCORES} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                <XAxis dataKey="ay" tick={{ fill: 'var(--text-muted)', fontSize: 11 }}/>
                <YAxis domain={[3.5, 5]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }}/>
                <Tooltip formatter={v => [v, 'Ortalama Puan']} contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-main)' }}/>
                <Bar dataKey="puan" fill="#f59e0b" radius={[4,4,0,0]} name="Puan"/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* NPS Breakdown */}
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>NPS Dağılımı</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Promoter (9-10)',  count: promoters,                                              color: 'var(--success)', bg: 'rgba(16,185,129,0.1)', pct: Math.round(promoters/FEEDBACK_DATA.length*100) },
                { label: 'Pasif (7-8)',      count: FEEDBACK_DATA.filter(f=>f.nps===7||f.nps===8).length,   color: '#f59e0b',        bg: 'rgba(245,158,11,0.1)', pct: Math.round(FEEDBACK_DATA.filter(f=>f.nps===7||f.nps===8).length/FEEDBACK_DATA.length*100) },
                { label: 'Detractor (0-6)', count: detractors,                                              color: 'var(--danger)',  bg: 'rgba(244,63,94,0.1)',  pct: Math.round(detractors/FEEDBACK_DATA.length*100) },
              ].map((row, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                    <span style={{ color: row.color, fontWeight: 700 }}>{row.count} kişi ({row.pct}%)</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${row.pct}%`, background: row.color, borderRadius: 4, transition: 'width 0.8s ease' }}/>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 8, padding: '12px 16px', background: 'rgba(0,229,255,0.06)', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: npsScore >= 50 ? 'var(--success)' : npsScore >= 0 ? '#f59e0b' : 'var(--danger)' }}>{npsScore > 0 ? '+' : ''}{npsScore}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Net Promoter Score</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback List Tab */}
      {tab === 'feedback' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={14} color="var(--text-muted)"/>
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '7px 12px', color: 'var(--text-main)', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', outline: 'none' }}>
              <option value="all">Tüm Bölümler</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 6 }}>
              {['all','positive','neutral','negative'].map(s => {
                const sc = s === 'all' ? null : SENTIMENT_CFG[s];
                return (
                  <button key={s} className={`glass-button ${filterSentiment === s ? 'primary' : ''}`}
                    onClick={() => setFilterSentiment(s)} style={{ fontSize: '0.8rem', padding: '7px 14px', gap: 5, color: sc ? sc.color : undefined }}>
                    {sc ? <>{sc.icon} {sc.label}</> : 'Tümü'}
                  </button>
                );
              })}
            </div>
            <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{filtered.length} kayıt</span>
          </div>

          {/* Feedback Cards */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(fb => {
              const sc = SENTIMENT_CFG[fb.sentiment];
              const replied = repliedIds.has(fb.id);
              return (
                <div key={fb.id} className="glass-panel" style={{ padding: '16px 20px', border: fb.sentiment === 'negative' ? '1px solid rgba(244,63,94,0.2)' : '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${sc.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: sc.color, fontWeight: 800, fontSize: '0.9rem' }}>
                        {fb.patient[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem' }}>{fb.patient}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{fb.dept} · {fb.date} · {fb.category}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <StarRating value={fb.rating}/>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700, color: sc.color, background: sc.bg }}>
                        {sc.icon} {sc.label}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: 6 }}>NPS: {fb.nps}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: 12, fontStyle: 'italic', opacity: 0.9 }}>
                    "{fb.comment}"
                  </p>
                  {!replied ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input value={replyText} onChange={e => setReplyText(e.target.value)}
                        placeholder="Yanıt yaz..."
                        style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-main)', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', outline: 'none' }}/>
                      <button className="glass-button primary" style={{ gap: 6, fontSize: '0.82rem' }} onClick={() => sendReply(fb.id)}>
                        <Send size={13}/> Gönder
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--success)' }}>
                      <CheckCircle size={13}/> Yanıt gönderildi
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
