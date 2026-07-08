import React, { useState } from 'react';
import { User, Heart, Activity, CheckCircle, ChevronRight, ChevronLeft, Plus, X, AlertTriangle } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Kişisel Bilgiler', icon: <User size={18} /> },
  { id: 2, label: 'Tıbbi Geçmiş',    icon: <Heart size={18} /> },
  { id: 3, label: 'İzleme Ayarları', icon: <Activity size={18} /> },
  { id: 4, label: 'Onay & Kaydet',   icon: <CheckCircle size={18} /> },
];

const DISEASE_OPTIONS = [
  { value: 'Hipertansiyon', label: '🩺 Hipertansiyon', unit: 'mmHg', defaultThreshold: 140 },
  { value: 'Diyabet',       label: '🩸 Diyabet (Tip 2)', unit: 'mg/dL', defaultThreshold: 200 },
  { value: 'Kalp Yetmezliği', label: '❤️ Kalp Yetmezliği', unit: 'puan', defaultThreshold: 7 },
  { value: 'KOAH',          label: '🫁 KOAH', unit: 'puan', defaultThreshold: 6 },
  { value: 'Astım',         label: '💨 Astım', unit: 'L/min', defaultThreshold: 300 },
  { value: 'Böbrek Yetmezliği', label: '🟡 Böbrek Yetmezliği', unit: 'mg/dL', defaultThreshold: 1.5 },
];

const ALLERGY_OPTIONS = ['Penisilin', 'Aspirin', 'Sülfamid', 'İyot', 'Lateks', 'Polen', 'Fıstık'];

const emptyForm = {
  // Step 1
  name: '', tc: '', birthDate: '', gender: 'Erkek', phone: '', email: '',
  emergencyContact: '', emergencyPhone: '',
  // Step 2
  diseases: [], allergies: [], smoking: 'Hayır', alcohol: 'Hayır',
  chronicHistory: '', surgeryHistory: '',
  // Step 3
  primaryDisease: '', threshold: '', measureFrequency: 'Günlük',
  channel: 'SMS', question: '', literacy: 'true',
};

const PatientOnboarding = ({ _patients, setPatients, addNotification, onClose }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [allergyInput, setAllergyInput] = useState('');
  const [done, setDone] = useState(false);

  const update = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const toggleDisease = (d) => {
    update('diseases', form.diseases.includes(d)
      ? form.diseases.filter(x => x !== d)
      : [...form.diseases, d]);
  };

  const toggleAllergy = (a) => {
    update('allergies', form.allergies.includes(a)
      ? form.allergies.filter(x => x !== a)
      : [...form.allergies, a]);
  };

  const addCustomAllergy = () => {
    if (allergyInput.trim() && !form.allergies.includes(allergyInput.trim())) {
      update('allergies', [...form.allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };

  const handleDiseaseSelect = (val) => {
    const found = DISEASE_OPTIONS.find(d => d.value === val);
    update('primaryDisease', val);
    if (found) update('threshold', found.defaultThreshold);
  };

  const canNext = () => {
    if (step === 1) return form.name.trim() && form.phone.trim();
    if (step === 2) return true;
    if (step === 3) return form.primaryDisease && form.threshold && form.question.trim();
    return true;
  };

  const handleSubmit = () => {
    const diseaseFound = DISEASE_OPTIONS.find(d => d.value === form.primaryDisease);
    const newPatient = {
      id: Date.now(),
      name: form.name,
      disease: form.primaryDisease,
      threshold: parseFloat(form.threshold),
      currentValue: 0,
      literacy: form.literacy === 'true',
      questions: [form.question],
      status: 'safe',
      healthScore: 100,
      medications: [],
      history: [],
      // extended fields
      tc: form.tc,
      birthDate: form.birthDate,
      gender: form.gender,
      phone: form.phone,
      email: form.email,
      emergencyContact: form.emergencyContact,
      emergencyPhone: form.emergencyPhone,
      comorbidities: form.diseases,
      allergies: form.allergies,
      smoking: form.smoking,
      alcohol: form.alcohol,
      measureFrequency: form.measureFrequency,
      unit: diseaseFound?.unit || '',
    };
    setPatients(prev => [...prev, newPatient]);
    addNotification('success', `✅ ${form.name} sisteme başarıyla kaydedildi!`);
    setDone(true);
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--glass-border)', borderRadius: '10px',
    color: 'var(--text-main)', fontSize: '0.95rem', fontFamily: 'Outfit, sans-serif',
    outline: 'none', transition: 'border 0.2s',
  };
  const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 };

  if (done) return (
    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🎉</div>
      <h2 style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '12px' }}>Hasta Kaydedildi!</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        <strong style={{ color: 'var(--text-main)' }}>{form.name}</strong> başarıyla sisteme eklendi ve izlemeye alındı.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button className="glass-button primary" onClick={() => { setForm(emptyForm); setStep(1); setDone(false); }}>
          <Plus size={18} /> Yeni Hasta Ekle
        </button>
        {onClose && <button className="glass-button" onClick={onClose}><X size={18} /> Kapat</button>}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: '760px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Plus size={32} color="var(--primary)" /> Hasta Kayıt Sihirbazı
        </h1>
        <p className="text-muted">Yeni hastayı 4 adımda sisteme kaydedin.</p>
      </div>

      {/* Step Indicator */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '40px', position: 'relative' }}>
        {/* connecting line */}
        <div style={{ position: 'absolute', top: '22px', left: '24px', right: '24px', height: '2px', background: 'var(--glass-border)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '22px', left: '24px', height: '2px', width: `${((step - 1) / 3) * 100}%`, background: 'var(--primary)', zIndex: 1, transition: 'width 0.4s ease' }} />
        {STEPS.map(s => (
          <div key={s.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: step >= s.id ? 'var(--primary)' : 'var(--glass-bg)',
              border: `2px solid ${step >= s.id ? 'var(--primary)' : 'var(--glass-border)'}`,
              color: step >= s.id ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.3s', boxShadow: step === s.id ? '0 0 16px rgba(0,229,255,0.4)' : 'none',
            }}>
              {step > s.id ? <CheckCircle size={20} /> : s.icon}
            </div>
            <span style={{ fontSize: '0.78rem', color: step >= s.id ? 'var(--primary)' : 'var(--text-muted)', fontWeight: step === s.id ? 700 : 400, textAlign: 'center' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="glass-panel animate-fade-in" style={{ padding: '36px', marginBottom: '24px' }} key={step}>

        {/* ───── STEP 1: Kişisel Bilgiler ───── */}
        {step === 1 && (
          <div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '28px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <User size={22} /> Kişisel Bilgiler
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Ad Soyad *</label>
                <input style={inputStyle} value={form.name} onChange={e => update('name', e.target.value)} placeholder="Ahmet Yılmaz" />
              </div>
              <div>
                <label style={labelStyle}>TC Kimlik No</label>
                <input style={inputStyle} value={form.tc} onChange={e => update('tc', e.target.value)} placeholder="12345678901" maxLength={11} />
              </div>
              <div>
                <label style={labelStyle}>Doğum Tarihi</label>
                <input style={inputStyle} type="date" value={form.birthDate} onChange={e => update('birthDate', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Cinsiyet</label>
                <select style={inputStyle} value={form.gender} onChange={e => update('gender', e.target.value)}>
                  <option>Erkek</option><option>Kadın</option><option>Belirtmek İstemiyorum</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Telefon *</label>
                <input style={inputStyle} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+90 555 123 4567" />
              </div>
              <div>
                <label style={labelStyle}>E-posta</label>
                <input style={inputStyle} type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="ahmet@gmail.com" />
              </div>
              <div>
                <label style={labelStyle}>Acil Kişi (Ad Soyad)</label>
                <input style={inputStyle} value={form.emergencyContact} onChange={e => update('emergencyContact', e.target.value)} placeholder="Fatma Yılmaz" />
              </div>
              <div>
                <label style={labelStyle}>Acil Kişi Telefonu</label>
                <input style={inputStyle} value={form.emergencyPhone} onChange={e => update('emergencyPhone', e.target.value)} placeholder="+90 555 987 6543" />
              </div>
            </div>
          </div>
        )}

        {/* ───── STEP 2: Tıbbi Geçmiş ───── */}
        {step === 2 && (
          <div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '28px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Heart size={22} /> Tıbbi Geçmiş
            </h3>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Eşlik Eden Hastalıklar (birden fazla seçilebilir)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                {DISEASE_OPTIONS.map(d => (
                  <button key={d.value} onClick={() => toggleDisease(d.value)}
                    style={{
                      padding: '8px 16px', borderRadius: '20px', border: '1px solid',
                      borderColor: form.diseases.includes(d.value) ? 'var(--primary)' : 'var(--glass-border)',
                      background: form.diseases.includes(d.value) ? 'rgba(0,229,255,0.15)' : 'transparent',
                      color: form.diseases.includes(d.value) ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'Outfit', transition: 'all 0.2s',
                    }}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Alerjiler</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                {ALLERGY_OPTIONS.map(a => (
                  <button key={a} onClick={() => toggleAllergy(a)}
                    style={{
                      padding: '6px 14px', borderRadius: '20px', border: '1px solid',
                      borderColor: form.allergies.includes(a) ? 'var(--warning)' : 'var(--glass-border)',
                      background: form.allergies.includes(a) ? 'rgba(245,158,11,0.15)' : 'transparent',
                      color: form.allergies.includes(a) ? 'var(--warning)' : 'var(--text-muted)',
                      cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Outfit', transition: 'all 0.2s',
                    }}>
                    {a}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input style={{ ...inputStyle, flex: 1 }} value={allergyInput} onChange={e => setAllergyInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomAllergy()}
                  placeholder="Özel alerji ekle..." />
                <button className="glass-button primary" onClick={addCustomAllergy} style={{ padding: '10px 16px' }}>
                  <Plus size={16} />
                </button>
              </div>
              {form.allergies.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                  {form.allergies.map(a => (
                    <span key={a} style={{ padding: '4px 10px', borderRadius: '12px', background: 'rgba(245,158,11,0.15)', color: 'var(--warning)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      ⚠️ {a}
                      <button onClick={() => toggleAllergy(a)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, lineHeight: 1 }}><X size={12} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Sigara Kullanımı</label>
                <select style={inputStyle} value={form.smoking} onChange={e => update('smoking', e.target.value)}>
                  <option>Hayır</option><option>Eski İçici</option><option>Aktif İçici</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Alkol Kullanımı</label>
                <select style={inputStyle} value={form.alcohol} onChange={e => update('alcohol', e.target.value)}>
                  <option>Hayır</option><option>Ara Sıra</option><option>Düzenli</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Geçirilmiş Hastalıklar / Notlar</label>
              <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
                value={form.chronicHistory} onChange={e => update('chronicHistory', e.target.value)}
                placeholder="Örn: 2018'de MI geçirdi, koroner anjiyoplasti yapıldı..." />
            </div>
            <div>
              <label style={labelStyle}>Geçirilmiş Ameliyatlar</label>
              <textarea style={{ ...inputStyle, height: '70px', resize: 'vertical' }}
                value={form.surgeryHistory} onChange={e => update('surgeryHistory', e.target.value)}
                placeholder="Örn: 2020 apandisit operasyonu..." />
            </div>
          </div>
        )}

        {/* ───── STEP 3: İzleme Ayarları ───── */}
        {step === 3 && (
          <div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '28px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Activity size={22} /> İzleme Konfigürasyonu
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Birincil İzleme Hastalığı *</label>
                <select style={inputStyle} value={form.primaryDisease} onChange={e => handleDiseaseSelect(e.target.value)}>
                  <option value="">Seçiniz...</option>
                  {DISEASE_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Kritik Eşik Değeri *</label>
                <input style={inputStyle} type="number" value={form.threshold} onChange={e => update('threshold', e.target.value)}
                  placeholder={DISEASE_OPTIONS.find(d => d.value === form.primaryDisease)?.defaultThreshold || '—'} />
                {form.primaryDisease && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Birim: {DISEASE_OPTIONS.find(d => d.value === form.primaryDisease)?.unit}
                  </p>
                )}
              </div>
              <div>
                <label style={labelStyle}>Ölçüm Sıklığı</label>
                <select style={inputStyle} value={form.measureFrequency} onChange={e => update('measureFrequency', e.target.value)}>
                  <option>Günlük</option><option>Haftada 2</option><option>Haftalık</option><option>Gerektiğinde</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>İletişim Kanalı</label>
                <select style={inputStyle} value={form.channel} onChange={e => update('channel', e.target.value)}>
                  <option>SMS</option><option>Sesli Arama</option><option>E-posta</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Hasta Okur-Yazarlığı</label>
                <select style={inputStyle} value={form.literacy} onChange={e => update('literacy', e.target.value)}>
                  <option value="true">Yazılı (SMS, Uygulama)</option>
                  <option value="false">Sesli (Bot Arama)</option>
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>İzleme Sorusu *</label>
                <input style={inputStyle} value={form.question} onChange={e => update('question', e.target.value)}
                  placeholder={
                    form.primaryDisease === 'Hipertansiyon' ? 'Bugünkü büyük tansiyon ölçümünüz kaç?' :
                    form.primaryDisease === 'Diyabet' ? 'Bugünkü açlık kan şekeriniz kaç?' :
                    'Bugünkü durumunuzu 0–10 skalasında değerlendirin.'
                  } />
              </div>
            </div>
            {!form.primaryDisease && (
              <div style={{ marginTop: '20px', padding: '14px 18px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--warning)' }}>
                <AlertTriangle size={18} />
                <span style={{ fontSize: '0.88rem' }}>Devam edebilmek için birincil izleme hastalığı seçilmelidir.</span>
              </div>
            )}
          </div>
        )}

        {/* ───── STEP 4: Özet & Onay ───── */}
        {step === 4 && (
          <div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '28px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <CheckCircle size={22} /> Kayıt Özeti
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                ['👤 Ad Soyad', form.name],
                ['📱 Telefon', form.phone],
                ['🎂 Doğum Tarihi', form.birthDate || '—'],
                ['⚧ Cinsiyet', form.gender],
                ['🩺 Birincil Hastalık', form.primaryDisease],
                ['⚠️ Kritik Eşik', form.threshold],
                ['📏 Ölçüm Sıklığı', form.measureFrequency],
                ['📡 İletişim Kanalı', form.channel],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{k}</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{v || '—'}</div>
                </div>
              ))}
              {form.allergies.length > 0 && (
                <div style={{ gridColumn: '1/-1', padding: '14px 18px', background: 'rgba(245,158,11,0.06)', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.3)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--warning)', marginBottom: '8px' }}>⚠️ Alerjiler</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {form.allergies.map(a => (
                      <span key={a} style={{ padding: '4px 10px', borderRadius: '12px', background: 'rgba(245,158,11,0.15)', color: 'var(--warning)', fontSize: '0.82rem' }}>{a}</span>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ gridColumn: '1/-1', padding: '14px 18px', background: 'rgba(0,229,255,0.06)', borderRadius: '10px', border: '1px solid rgba(0,229,255,0.2)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--primary)', marginBottom: '4px' }}>💬 İzleme Sorusu</div>
                <div style={{ color: 'var(--text-main)', fontStyle: 'italic' }}>"{form.question}"</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="glass-button" onClick={() => setStep(s => s - 1)} disabled={step === 1}
          style={{ opacity: step === 1 ? 0.4 : 1 }}>
          <ChevronLeft size={18} /> Geri
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Adım {step} / {STEPS.length}</span>
        {step < 4 ? (
          <button className="glass-button primary" onClick={() => setStep(s => s + 1)} disabled={!canNext()}>
            İleri <ChevronRight size={18} />
          </button>
        ) : (
          <button className="glass-button primary" onClick={handleSubmit} style={{ padding: '12px 28px' }}>
            <CheckCircle size={18} /> Sisteme Kaydet
          </button>
        )}
      </div>
    </div>
  );
};

export default PatientOnboarding;
