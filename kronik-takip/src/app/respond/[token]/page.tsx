'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Activity, CheckCircle, AlertTriangle, Mic, Volume2, RotateCcw, Check, X } from 'lucide-react';

// ─── Tipler ────────────────────────────────────────────────────────────────────
type Question = { id: string; text: string };
type Answers = Record<string, string>;

// ─── Speech yardımcıları ───────────────────────────────────────────────────────
function speak(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'tr-TR';
  utt.rate = 0.95;
  utt.pitch = 1;
  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
}

function stopSpeaking() {
  if (typeof window !== 'undefined') window.speechSynthesis.cancel();
}

// ─── Ana bileşen ───────────────────────────────────────────────────────────────
export default function RespondPage() {
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [patientName, setPatientName] = useState('');
  const [literacyLevel, setLiteracyLevel] = useState('LITERATE');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alertTriggered, setAlertTriggered] = useState(false);

  // ── Yazılı mod state ──────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(0);          // şu anki soru index
  const [currentInput, setCurrentInput] = useState('');       // geçici giriş
  const [showConfirm, setShowConfirm] = useState(false);      // onay modal
  const [confirmedAnswers, setConfirmedAnswers] = useState<Answers>({}); // onaylananlar

  // ── Sesli mod state ───────────────────────────────────────────────────────
  const [callStarted, setCallStarted] = useState(false);
  const [voiceStep, setVoiceStep] = useState(0);
  const [voicePhase, setVoicePhase] = useState<
    'speaking' | 'listening' | 'confirming' | 'confirm_listen' | 'idle'
  >('idle');
  const [voiceAnswers, setVoiceAnswers] = useState<Answers>({});
  const [lastHeard, setLastHeard] = useState('');             // son duyulan cevap
  const [voiceError, setVoiceError] = useState('');

  const recognitionRef = useRef<any>(null);
  const listenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Veri yükleme ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`/api/token-info?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); }
        else {
          setPatientName(data.patientName);
          setLiteracyLevel(data.literacyLevel || 'LITERATE');
          setQuestions(data.questions);
        }
        setLoading(false);
      });
  }, [token]);

  // ─── Form gönderimi ───────────────────────────────────────────────────────
  const handleSubmit = async (ans: Answers) => {
    setSubmitting(true);
    const formatted = questions.map(q => ({
      questionId: q.id,
      value: null,
      rawAnswer: ans[q.id] || '',
    }));
    const res = await fetch('/api/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, answers: formatted }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.error) setError(data.error);
    else { setSuccess(true); setAlertTriggered(data.alert); }
  };

  // ════════════════════════════════════════════════════════════════════════════
  //  YAZILI MOD – adım adım onaylı form
  // ════════════════════════════════════════════════════════════════════════════
  const handleInputChange = (val: string) => setCurrentInput(val);

  const handleNextStep = () => {
    if (!currentInput.trim()) return;
    setShowConfirm(true);
  };

  const handleConfirmYes = () => {
    const q = questions[currentStep];
    const updated = { ...confirmedAnswers, [q.id]: currentInput };
    setConfirmedAnswers(updated);
    setShowConfirm(false);
    setCurrentInput('');

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tüm sorular bitti → gönder
      setAnswers(updated);
      handleSubmit(updated);
    }
  };

  const handleConfirmNo = () => {
    setShowConfirm(false);
    // input temizlenmez, hasta düzeltebilir
  };

  const progressPercent = questions.length > 0
    ? Math.round((currentStep / questions.length) * 100)
    : 0;

  // ════════════════════════════════════════════════════════════════════════════
  //  SESLİ MOD – Speech Recognition + Synthesis
  // ════════════════════════════════════════════════════════════════════════════

  // Sessiz dinlemeyi temizle
  const clearListenTimeout = useCallback(() => {
    if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current);
  }, []);

  // Tanıma durdur
  const stopRecognition = useCallback(() => {
    clearListenTimeout();
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* */ }
      recognitionRef.current = null;
    }
  }, [clearListenTimeout]);

  // Sesli cevap dinle
  const listenForAnswer = useCallback((idx: number, onResult: (text: string) => void) => {
    stopRecognition();
    setVoiceError('');
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setVoiceError('Tarayıcınız sesli tanımayı desteklemiyor.'); return; }

    const rec = new SR() as any;
    rec.lang = 'tr-TR';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    recognitionRef.current = rec;

    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript.trim();
      clearListenTimeout();
      onResult(transcript);
    };

    rec.onerror = () => {
      clearListenTimeout();
      setVoiceError('Ses anlaşılamadı, lütfen tekrar söyleyin.');
      setVoicePhase('listening');
      // 1 sn sonra tekrar başlat
      setTimeout(() => listenForAnswer(idx, onResult), 1000);
    };

    rec.onend = () => { recognitionRef.current = null; };

    rec.start();

    // 15 sn sonra otomatik hata
    listenTimeoutRef.current = setTimeout(() => {
      stopRecognition();
      setVoiceError('Yanıt alınamadı, lütfen tekrar söyleyin.');
      setVoicePhase('listening');
      setTimeout(() => listenForAnswer(idx, onResult), 1000);
    }, 15000);
  }, [stopRecognition, clearListenTimeout]);

  // Soruyu sor
  const askQuestion = useCallback((idx: number, currentVoiceAnswers: Answers) => {
    if (idx >= questions.length) return;
    setVoiceStep(idx);
    setVoicePhase('speaking');
    setVoiceError('');
    stopSpeaking();

    const questionText = `${idx + 1}. soru: ${questions[idx].text}`;
    speak(questionText, () => {
      setVoicePhase('listening');
      listenForAnswer(idx, (heard) => {
        setLastHeard(heard);
        setVoicePhase('confirming');
        stopSpeaking();
        // Duyduğunu tekrar oku ve onay sor
        const confirmText = `${heard} dediniz. Doğru mu? Evet veya Hayır deyin.`;
        speak(confirmText, () => {
          setVoicePhase('confirm_listen');
          listenForAnswer(idx, (confirmation) => {
            const lower = confirmation.toLowerCase();
            if (lower.includes('evet') || lower.includes('doğru') || lower.includes('tamam') || lower.includes('evet doğru')) {
              // Onaylandı
              const updated = { ...currentVoiceAnswers, [questions[idx].id]: heard };
              setVoiceAnswers(updated);
              setVoicePhase('speaking');
              setVoiceError('');

              if (idx < questions.length - 1) {
                speak('Harika! Bir sonraki soruya geçiyoruz.', () => {
                  askQuestion(idx + 1, updated);
                });
              } else {
                speak('Tüm sorular tamamlandı. Sonuçlarınız iletiliyor.', () => {
                  setVoicePhase('idle');
                  handleSubmit(updated);
                });
              }
            } else {
              // Onaylanmadı – soruyu tekrar sor
              setVoiceError('');
              speak('Tamam, soruyu tekrar soruyorum.', () => {
                askQuestion(idx, currentVoiceAnswers);
              });
            }
          });
        });
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, listenForAnswer]);

  const startVoiceCall = () => {
    setCallStarted(true);
    askQuestion(0, {});
  };

  // Cleanup
  useEffect(() => () => stopRecognition(), [stopRecognition]);

  // ════════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════════════════════════

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#080c14]">
      <div className="spinner h-8 w-8" />
    </div>
  );

  if (error) return (
    <div className="flex h-screen items-center justify-center bg-[#080c14] p-4 text-center text-white">
      <div className="card p-8 w-full max-w-md">
        <AlertTriangle size={32} className="mx-auto mb-4 text-[var(--danger)]" />
        <h1 className="text-xl font-bold mb-2">Hata</h1>
        <p className="text-[#6b8fa8]">{error}</p>
      </div>
    </div>
  );

  if (success) return (
    <div className="flex h-screen items-center justify-center bg-[#080c14] p-4 text-center text-white">
      <div className="card p-8 w-full max-w-md animate-in">
        {alertTriggered ? (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(244,63,94,0.1)] text-[var(--danger)]">
              <AlertTriangle size={32} />
            </div>
            <h1 className="text-xl font-bold text-[var(--danger)] mb-2">Dikkat!</h1>
            <p className="text-[#e8f4f8]">Ölçüm değerleriniz kritik eşiğin üzerinde. Doktorunuza bilgi verildi. Lütfen iletişime geçmesini bekleyiniz veya hastaneye başvurunuz.</p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(16,185,129,0.1)] text-[var(--success)]">
              <CheckCircle size={32} />
            </div>
            <h1 className="text-xl font-bold text-[var(--success)] mb-2">Teşekkürler</h1>
            <p className="text-[#6b8fa8]">Yanıtlarınız doktorunuza başarıyla iletildi.</p>
          </>
        )}
      </div>
    </div>
  );

  // ── OKUMA YAZMA BİLMEYEN – Sesli Mod ──────────────────────────────────────
  if (literacyLevel === 'ILLITERATE') {
    const voiceProgress = questions.length > 0
      ? Math.round((voiceStep / questions.length) * 100)
      : 0;

    const isSpeaking = voicePhase === 'speaking' || voicePhase === 'confirming';
    const isListening = voicePhase === 'listening';
    const isConfirmListen = voicePhase === 'confirm_listen';

    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Arka plan parıltısı */}
        <div className={`absolute inset-0 opacity-20 transition-all duration-1000 ${isSpeaking ? 'bg-[radial-gradient(circle_at_center,var(--primary),transparent_70%)] scale-110' : 'bg-[radial-gradient(circle_at_center,#3b82f6,transparent_50%)] scale-100'}`} />

        <div className="z-10 text-center w-full max-w-md flex flex-col items-center">

          {/* ─── Arama bekleniyor ─────────────────────────────────────────── */}
          {!callStarted ? (
            <div className="animate-in slide-in-from-bottom-4">
              <div className="w-24 h-24 rounded-full bg-[rgba(0,229,255,0.1)] flex items-center justify-center mx-auto mb-6 border-2 border-[rgba(0,229,255,0.3)]">
                <Volume2 size={40} className="text-[var(--primary)]" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Gelen Çağrı</h1>
              <p className="text-[#6b8fa8] mb-12">Yapay Zeka Asistanı Sizi Arıyor</p>
              <button
                onClick={startVoiceCall}
                className="w-20 h-20 rounded-full bg-[var(--success)] flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] mx-auto hover:scale-105 transition-transform animate-pulse"
              >
                <Activity size={32} color="#fff" />
              </button>
              <p className="text-white font-bold mt-4">Cevapla</p>
            </div>

          /* ─── Gönderiliyor ──────────────────────────────────────────────── */
          ) : submitting ? (
            <div className="animate-in fade-in">
              <div className="spinner h-12 w-12 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-6" />
              <h2 className="text-xl text-white">Sonuçlarınız iletiliyor...</h2>
            </div>

          /* ─── Arama devam ediyor ─────────────────────────────────────────── */
          ) : (
            <div className="animate-in fade-in flex flex-col items-center w-full gap-6">

              {/* İlerleme */}
              {questions.length > 0 && (
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs text-[#6b8fa8] mb-1">
                    <span>Soru {Math.min(voiceStep + 1, questions.length)} / {questions.length}</span>
                    <span>{voiceProgress}%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill bg-[var(--primary)]" style={{ width: `${voiceProgress}%` }} /></div>
                </div>
              )}

              {/* Durum başlığı */}
              <h2 className="text-xl text-white font-medium min-h-[2rem]">
                {voicePhase === 'speaking' && 'Asistan soruyu soruyor...'}
                {voicePhase === 'listening' && 'Sizi dinliyorum...'}
                {voicePhase === 'confirming' && 'Cevabınızı tekrarlıyorum...'}
                {voicePhase === 'confirm_listen' && '"Evet" veya "Hayır" deyin'}
                {voicePhase === 'idle' && 'İşleniyor...'}
              </h2>

              {/* Ses dalgaları */}
              <div className="flex items-end justify-center gap-2 h-20">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div
                    key={i}
                    className={`w-3 rounded-full transition-all duration-300 ${
                      isSpeaking
                        ? 'bg-[var(--primary)] animate-wave'
                        : (isListening || isConfirmListen)
                        ? 'bg-[#3b82f6] animate-wave'
                        : 'bg-[#334155]'
                    }`}
                    style={{
                      animationDelay: `${i * 0.12}s`,
                      height: (isSpeaking || isListening || isConfirmListen) ? undefined : '10px',
                    }}
                  />
                ))}
              </div>

              {/* Soru metni */}
              {voicePhase === 'speaking' && questions[voiceStep] && (
                <div className="card px-5 py-4 w-full text-white text-base font-medium text-center">
                  {questions[voiceStep].text}
                </div>
              )}

              {/* Onay aşaması – duyulan cevap göster */}
              {(voicePhase === 'confirming' || voicePhase === 'confirm_listen') && lastHeard && (
                <div className="card px-5 py-4 w-full text-center">
                  <p className="text-xs text-[#6b8fa8] mb-1">Duyulan cevap</p>
                  <p className="text-2xl font-bold text-[var(--primary)]">{lastHeard}</p>
                  <p className="text-sm text-[#6b8fa8] mt-2">
                    {voicePhase === 'confirm_listen'
                      ? '→ Onaylamak için "Evet", tekrarlamak için "Hayır" deyin'
                      : 'Lütfen bekleyin...'}
                  </p>
                </div>
              )}

              {/* Hata mesajı */}
              {voiceError && (
                <p className="text-[var(--danger)] text-sm bg-[rgba(244,63,94,0.1)] px-4 py-2 rounded-lg">
                  {voiceError}
                </p>
              )}

              {/* Mikrofon göstergesi */}
              {(isListening || isConfirmListen) && (
                <div className="flex items-center gap-2 text-[#3b82f6] font-semibold">
                  <Mic size={20} className="animate-pulse" />
                  <span>Dinleniyor...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  OKUMA YAZMA BİLEN – Yazılı Mod (adım adım + onay modal)
  // ════════════════════════════════════════════════════════════════════════════
  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-screen bg-[#080c14] p-4 flex flex-col items-center pt-10">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-2">
        <Activity size={24} color="var(--primary)" />
        <span className="text-xl font-bold text-white tracking-wide">KronikTakip</span>
      </div>

      <div className="card w-full max-w-md p-6 animate-in">
        {/* Karşılama */}
        <h1 className="text-lg font-bold text-white mb-1">Merhaba {patientName},</h1>
        <p className="text-sm text-[#6b8fa8] mb-5">
          Lütfen doktorunuzun sizin için hazırladığı soruları yanıtlayın.
        </p>

        {/* İlerleme çubuğu */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-[#6b8fa8] mb-2">
            <span>Soru {currentStep + 1} / {questions.length}</span>
            <span>{progressPercent}% tamamlandı</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill bg-[var(--primary)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Mevcut soru */}
        {currentQuestion && !submitting && (
          <div className="animate-in">
            <label className="mb-3 block text-[16px] font-semibold text-white leading-snug">
              {currentStep + 1}. {currentQuestion.text}
            </label>
            <input
              type="number"
              step="0.1"
              value={currentInput}
              onChange={e => handleInputChange(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleNextStep(); }}
              className="input text-lg py-3 mb-4"
              placeholder="Yanıtınızı girin..."
              autoFocus
            />

            {/* Önceki onaylananları göster */}
            {Object.keys(confirmedAnswers).length > 0 && (
              <div className="mb-4 rounded-lg bg-[rgba(0,229,255,0.04)] border border-[rgba(0,229,255,0.1)] p-3">
                <p className="text-xs text-[#6b8fa8] mb-2 font-semibold uppercase tracking-wide">Onaylanan Cevaplar</p>
                {questions.slice(0, currentStep).map((q, i) => (
                  <div key={q.id} className="flex items-center justify-between py-1">
                    <span className="text-xs text-[#6b8fa8] truncate mr-2">{i + 1}. {q.text}</span>
                    <span className="text-sm font-bold text-[var(--primary)] whitespace-nowrap">{confirmedAnswers[q.id]}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleNextStep}
              disabled={!currentInput.trim()}
              className="btn btn-primary w-full py-3 justify-center text-[15px]"
            >
              {currentStep < questions.length - 1 ? 'Devam Et →' : 'Gönder'}
            </button>
          </div>
        )}

        {/* Gönderiliyor */}
        {submitting && (
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="spinner h-10 w-10" />
            <p className="text-[#6b8fa8]">Yanıtlarınız iletiliyor...</p>
          </div>
        )}
      </div>

      {/* ── ONAY MODALI ─────────────────────────────────────────────────────── */}
      {showConfirm && currentQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="card w-full max-w-sm p-6 animate-in shadow-2xl border border-[rgba(0,229,255,0.2)]">
            {/* Başlık */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[rgba(0,229,255,0.1)] flex items-center justify-center flex-shrink-0">
                <CheckCircle size={20} className="text-[var(--primary)]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Cevabınızı onaylıyor musunuz?</h2>
                <p className="text-xs text-[#6b8fa8]">Göndermeden önce kontrol edin</p>
              </div>
            </div>

            {/* Soru ve cevap özeti */}
            <div className="rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] p-4 mb-5">
              <p className="text-xs text-[#6b8fa8] mb-1">Soru</p>
              <p className="text-sm text-white font-medium mb-3">{currentQuestion.text}</p>
              <p className="text-xs text-[#6b8fa8] mb-1">Cevabınız</p>
              <p className="text-2xl font-bold text-[var(--primary)]">{currentInput}</p>
            </div>

            {/* Butonlar */}
            <div className="flex gap-3">
              <button
                onClick={handleConfirmNo}
                className="btn btn-ghost flex-1 justify-center gap-2"
              >
                <RotateCcw size={16} />
                Hayır, Düzelteceğim
              </button>
              <button
                onClick={handleConfirmYes}
                className="btn btn-primary flex-1 justify-center gap-2"
              >
                <Check size={16} />
                Evet, Onaylıyorum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
