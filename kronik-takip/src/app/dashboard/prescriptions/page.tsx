'use client';

import { useState } from 'react';
import { Pill, AlertTriangle, CheckCircle2, ShieldAlert, Send, Plus, Search, Info } from 'lucide-react';

export default function PrescriptionsPage() {
  const [medications, setMedications] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [interactionWarning, setInteractionWarning] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const database = [
    { id: 1, name: 'Aspirin 100mg', type: 'Kan Sulandırıcı / Analjezik' },
    { id: 2, name: 'Warfarin 5mg', type: 'Antikoagülan (Kan Sulandırıcı)' },
    { id: 3, name: 'Metformin 1000mg', type: 'Antidiyabetik' },
    { id: 4, name: 'Lisinopril 10mg', type: 'Antihipertansif' },
    { id: 5, name: 'Atorvastatin 20mg', type: 'Kolesterol Düşürücü' },
  ];

  const handleAdd = (med: any) => {
    const newMeds = [...medications, med];
    setMedications(newMeds);
    
    // AI Drug Interaction Simulation
    const hasAspirin = newMeds.some(m => m.name.includes('Aspirin'));
    const hasWarfarin = newMeds.some(m => m.name.includes('Warfarin'));
    
    if (hasAspirin && hasWarfarin) {
      setInteractionWarning(true);
    }
  };

  const handleRemove = (index: number) => {
    const newMeds = [...medications];
    newMeds.splice(index, 1);
    setMedications(newMeds);
    
    const hasAspirin = newMeds.some(m => m.name.includes('Aspirin'));
    const hasWarfarin = newMeds.some(m => m.name.includes('Warfarin'));
    if (!(hasAspirin && hasWarfarin)) {
      setInteractionWarning(false);
    }
  };

  const handleSendToSGK = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setMedications([]);
      setInteractionWarning(false);
    }, 2000);
  };

  return (
    <div className="animate-in" style={{ paddingBottom: '60px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* ── Header ── */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px', color: '#0f172a', letterSpacing: '-0.5px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pill size={24} color="#10b981" />
            </div>
            Akıllı E-Reçete & SGK Entegrasyonu
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px', fontWeight: 500 }}>
            Reçete edilen ilaçları yapay zeka ile etkileşim testine sokun ve Medula sistemine anında iletin.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* ── İLAÇ SEÇİMİ ── */}
        <div className="card" style={{ padding: '32px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Veritabanında İlaç Ara</div>
          
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '14px', color: '#94a3b8' }} size={20} />
            <input 
              type="text" 
              className="input" 
              placeholder="Etken madde veya ticari isim girin..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: '48px', height: '48px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '15px', borderRadius: '12px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {database.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).map(med => (
              <div key={med.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', transition: 'border 0.2s', cursor: 'pointer' }}
                   onMouseOver={(e) => e.currentTarget.style.borderColor = '#93c5fd'}
                   onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{med.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>{med.type}</div>
                </div>
                <button onClick={() => handleAdd(med)} className="btn btn-ghost" style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%', background: '#eff6ff', color: '#2563eb' }}>
                  <Plus size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── AKTİF REÇETE ── */}
        <div className="card" style={{ padding: '32px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Oluşturulan Reçete Listesi</h2>
            <div style={{ background: '#f8fafc', color: '#475569', padding: '6px 12px', fontSize: '13px', fontWeight: 700, borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              {medications.length} İlaç
            </div>
          </div>

          {sent && (
            <div style={{ padding: '20px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={24} color="#059669" />
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#059669' }}>Başarıyla Gönderildi</div>
                <div style={{ fontSize: '13px', color: '#047857', fontWeight: 500, marginTop: '2px' }}>Reçete SGK Medula sistemine iletildi. E-Reçete No: ERS-2026-987</div>
              </div>
            </div>
          )}

          {interactionWarning && (
            <div className="animate-scale" style={{ padding: '20px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <ShieldAlert size={20} color="#e11d48" />
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#e11d48' }}>YZ Kritik Etkileşim Uyarısı</span>
              </div>
              <p style={{ fontSize: '13px', color: '#be123c', margin: 0, lineHeight: '1.6', fontWeight: 500 }}>
                **Aspirin** ve **Warfarin** kombinasyonu şiddetli kanama riskini artırır. Bu iki ilacın birlikte reçete edilmesi kontrendikedir. Lütfen alternatif bir antikoagülan tedavisi düşünün.
              </p>
            </div>
          )}

          {medications.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '40px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <Info size={40} color="#94a3b8" />
              <div style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Listeye eklenen ilaçlar burada görünecektir.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
              {medications.map((med, idx) => (
                <div key={idx} className="animate-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{med.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>1x1 (Günde 1 Tok Karnına)</div>
                  </div>
                  <button onClick={() => handleRemove(idx)} className="btn btn-ghost" style={{ color: '#e11d48', fontSize: '13px', fontWeight: 700 }}>
                    Kaldır
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
            <button 
              onClick={handleSendToSGK}
              disabled={medications.length === 0 || interactionWarning || sending}
              className="btn btn-primary" 
              style={{ width: '100%', height: '48px', justifyContent: 'center', fontSize: '15px', fontWeight: 800, background: interactionWarning ? '#cbd5e1' : '#2563eb' }}
            >
              {sending ? 'Medula\'ya İletiliyor...' : (
                <><Send size={18} /> SGK Medula Sistemine Gönder</>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
