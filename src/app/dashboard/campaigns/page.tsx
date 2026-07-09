'use client';

import { useState } from 'react';
import { Send, Stethoscope, Smartphone, FileText, CheckCircle2, MessageSquare, Bell, Users } from 'lucide-react';

const DEPARTMENTS = [
  { id: 'gastro', name: 'Gastroenteroloji', patients: 45 },
  { id: 'kardiyo', name: 'Kardiyoloji', patients: 120 },
  { id: 'nefro', name: 'Nefroloji', patients: 38 },
  { id: 'endokrin', name: 'Endokrinoloji', patients: 210 },
];

const TEMPLATES: Record<string, { title: string; content: string }[]> = {
  gastro: [
    { title: 'Beslenme Uyarısı: Gazlı İçecekler', content: 'Sayın hastamız, gastrit ve reflü şikayetlerinizin artmaması için gazlı içeceklerden kesinlikle uzak durunuz. Sağlıklı günler dileriz.' },
    { title: "Endoskopi Öncesi Hazırlık", content: "Sayın hastamız, yarın yapılacak olan endoskopi işleminiz için lütfen bu gece saat 22:00'dan sonra katı ve sıvı gıda alımını durdurunuz." }
  ],
  kardiyo: [
    { title: 'Tansiyon İlacı Hatırlatması', content: 'Sayın hastamız, havaların ısınmasıyla birlikte tansiyon dengesizlikleri yaşanabilir. Lütfen ilaçlarınızı düzenli saatlerinde almayı ihmal etmeyin.' },
    { title: 'Efor Testi Sonrası', content: 'Sayın hastamız, efor testiniz başarıyla tamamlanmıştır. Lütfen gün boyu ağır fiziksel aktivitelerden kaçının.' }
  ],
  nefro: [
    { title: 'Su Tüketimi (Yaz Ayları)', content: 'Sayın hastamız, böbrek fonksiyonlarınızın korunması için yaz aylarında günde en az 2.5 - 3 litre su tüketimine özen gösteriniz.' }
  ],
  endokrin: [
    { title: 'Şeker Ölçüm Hatırlatması', content: 'Sayın hastamız, son dönemde açlık kan şekeri ölçümlerinizi sisteme işlemediğinizi fark ettik. Lütfen ölçümlerinizi düzenli olarak uygulamaya giriniz.' }
  ],
};

export default function MedicalAdvicePage() {
  const [deptId, setDeptId] = useState('gastro');
  const [templateIdx, setTemplateIdx] = useState(0);
  const [customMessage, setCustomMessage] = useState(TEMPLATES['gastro'][0].content);
  const [channel, setChannel] = useState('sms');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedDept = DEPARTMENTS.find(d => d.id === deptId);
  const currentTemplates = TEMPLATES[deptId] || [];

  const handleDeptChange = (newDept: string) => {
    setDeptId(newDept);
    setTemplateIdx(0);
    setCustomMessage(TEMPLATES[newDept]?.[0]?.content || '');
  };

  const handleTemplateChange = (idx: number) => {
    setTemplateIdx(idx);
    setCustomMessage(currentTemplates[idx].content);
  };

  const handleBroadcast = () => {
    if (!customMessage.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    }, 2000);
  };

  return (
    <div className="animate-in" style={{ paddingBottom: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* ── Header ── */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="text-gradient" style={{ fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageSquare size={30} color="#2563eb" />
          Klinik Tavsiye Yayını
        </h1>
        <p style={{ color: '#64748b', marginTop: '6px', fontSize: '14px', fontWeight: 500 }}>
          Uzmanlık alanınıza (Poliklinik) kayıtlı hastalarınızı toplu olarak bilgilendirin ve tıbbi tavsiyelerde bulunun.
        </p>
      </div>

      {success && (
        <div className="animate-in" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 20px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', marginBottom: '24px', color: '#059669', fontSize: '14px', fontWeight: 600 }}>
          <CheckCircle2 size={20} />
          {selectedDept?.name} bölümüne kayıtlı {selectedDept?.patients} hastaya tavsiyeleriniz başarıyla {channel === 'sms' ? 'SMS' : 'Mobil Bildirim'} olarak iletildi.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        
        {/* ── Configuration Panel ── */}
        <div className="card" style={{ padding: '32px' }}>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', marginBottom: '10px', fontWeight: 700 }}>
              <Stethoscope size={16} color="#2563eb" /> Poliklinik (Uzmanlık Alanınız)
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {DEPARTMENTS.map(d => (
                <button 
                  key={d.id}
                  onClick={() => handleDeptChange(d.id)}
                  className="btn btn-sm"
                  style={{
                    background: deptId === d.id ? 'rgba(37,99,235,0.1)' : 'rgba(0,0,0,0.03)',
                    color: deptId === d.id ? '#1e40af' : '#64748b',
                    border: `1px solid ${deptId === d.id ? 'rgba(37,99,235,0.3)' : 'transparent'}`,
                    fontWeight: deptId === d.id ? 700 : 500,
                  }}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', marginBottom: '10px', fontWeight: 700 }}>
              <FileText size={16} color="#2563eb" /> Tıbbi Tavsiye Şablonları
            </label>
            <select 
              value={templateIdx} 
              onChange={(e) => handleTemplateChange(Number(e.target.value))} 
              className="input" 
              style={{ width: '100%', background: '#fff', fontWeight: 600, color: '#0f172a' }}
            >
              {currentTemplates.map((tpl, i) => (
                <option key={i} value={i}>{tpl.title}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', marginBottom: '10px', fontWeight: 700 }}>
              <MessageSquare size={16} color="#2563eb" /> Hasta Mesajı (Düzenlenebilir)
            </label>
            <textarea 
              className="input"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              style={{ width: '100%', height: '140px', resize: 'none', background: '#fff', padding: '16px', fontSize: '14px', lineHeight: '1.5' }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', marginBottom: '10px', fontWeight: 700 }}>
              <Smartphone size={16} color="#2563eb" /> Gönderim Kanalı
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div 
                onClick={() => setChannel('sms')}
                style={{ flex: 1, padding: '16px', borderRadius: '12px', cursor: 'pointer', border: `1px solid ${channel === 'sms' ? '#2563eb' : 'rgba(0,0,0,0.08)'}`, background: channel === 'sms' ? 'rgba(37,99,235,0.05)' : '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <Smartphone size={20} color={channel === 'sms' ? '#2563eb' : '#94a3b8'} />
                <span style={{ fontSize: '14px', fontWeight: 700, color: channel === 'sms' ? '#1e40af' : '#64748b' }}>Standart SMS</span>
              </div>
              <div 
                onClick={() => setChannel('push')}
                style={{ flex: 1, padding: '16px', borderRadius: '12px', cursor: 'pointer', border: `1px solid ${channel === 'push' ? '#8b5cf6' : 'rgba(0,0,0,0.08)'}`, background: channel === 'push' ? 'rgba(139,92,246,0.05)' : '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <Bell size={20} color={channel === 'push' ? '#8b5cf6' : '#94a3b8'} />
                <span style={{ fontSize: '14px', fontWeight: 700, color: channel === 'push' ? '#6d28d9' : '#64748b' }}>Uygulama İçi (Push)</span>
              </div>
            </div>
          </div>

          <button onClick={handleBroadcast} disabled={sending || !customMessage.trim()} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: '54px', fontSize: '15px' }}>
            {sending ? (
              <><div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', borderTopColor: '#fff' }} /> Tavsiyeler İletiliyor...</>
            ) : (
              <><Send size={18} /> {selectedDept?.patients} Hastaya Tavsiye Gönder</>
            )}
          </button>

        </div>

        {/* ── Summary & Active Campaigns Panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(37,99,235,0.03) 0%, rgba(139,92,246,0.03) 100%)', border: '1px solid rgba(37,99,235,0.1)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1e40af', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} /> Hedef Kitle Özeti
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Seçilen Poliklinik</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{selectedDept?.name}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Aktif Hasta Sayısı</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{selectedDept?.patients} Kişi</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Gönderim Statüsü</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>Hazır</span>
            </div>
          </div>

          <div className="card" style={{ padding: '24px', flex: 1 }}>
             <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Son Yayınlanan Tavsiyeler</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               
               <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.05)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                   <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Kardiyoloji: Su Tüketimi</span>
                   <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>İletildi</span>
                 </div>
                 <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                   "Sayın hastamız, havaların ısınmasıyla birlikte su tüketiminize dikkat etmenizi..."
                 </div>
                 <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '8px', textAlign: 'right' }}>Dün, 14:30</div>
               </div>

             </div>
          </div>

        </div>

      </div>

    </div>
  );
}
