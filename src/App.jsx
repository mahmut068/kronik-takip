import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { generateExtraPatients } from './utils/patientGenerator';
import { Activity, Users, Bell, Phone, Sun, Moon, CalendarDays, BarChart2, MessageSquare, Calendar, Settings, CheckSquare, Search, X, FileText, FileDown, Building2, Microscope, ClipboardList, UserPlus, LayoutDashboard, Pill, Sparkles, Siren, Landmark, Wifi, Package, Smartphone, ScanLine, ShieldCheck, Bed, DollarSign, MapPin, Droplets, CalendarRange, Scissors, Truck, Stethoscope, Shield, Apple, ChevronDown, ChevronRight, LifeBuoy, Zap, Dna, BrainCircuit, Target } from 'lucide-react';

// Always-loaded (core shell)
import DoctorDashboard from './components/DoctorDashboard';
import PatientSimulator from './components/PatientSimulator';
import AlertModal from './components/AlertModal';
import ToastNotification from './components/ToastNotification';

// Lazy-loaded (code split per route)
const NotificationCenter  = lazy(() => import('./components/NotificationCenter'));
const AppointmentManager  = lazy(() => import('./components/AppointmentManager'));
const AnalyticsPage       = lazy(() => import('./components/AnalyticsPage'));
const RiskCalendar        = lazy(() => import('./components/RiskCalendar'));
const LiveChat            = lazy(() => import('./components/LiveChat'));
const SettingsPage        = lazy(() => import('./components/SettingsPage'));
const TaskManager         = lazy(() => import('./components/TaskManager'));
const PatientNotes        = lazy(() => import('./components/PatientNotes'));
const ReportCenter        = lazy(() => import('./components/ReportCenter'));
const TeamManagement      = lazy(() => import('./components/TeamManagement'));
const LabResults          = lazy(() => import('./components/LabResults'));
const ClinicalProtocols   = lazy(() => import('./components/ClinicalProtocols'));
const PatientOnboarding   = lazy(() => import('./components/PatientOnboarding'));
const KPIDashboard        = lazy(() => import('./components/KPIDashboard'));
const MedicationManager   = lazy(() => import('./components/MedicationManager'));
const ClinicalAI          = lazy(() => import('./components/ClinicalAI'));
const EmergencyCenter     = lazy(() => import('./components/EmergencyCenter'));
const OperationsCenter    = lazy(() => import('./components/OperationsCenter'));
const DeviceTelemetry     = lazy(() => import('./components/DeviceTelemetry'));
const InventoryPharmacy   = lazy(() => import('./components/InventoryPharmacy'));
const PatientPortal       = lazy(() => import('./components/PatientPortal'));
const RadiologyCenter     = lazy(() => import('./components/RadiologyCenter'));
const QualityAssurance    = lazy(() => import('./components/QualityAssurance'));
const ICUMonitor          = lazy(() => import('./components/ICUMonitor'));
const FinancialCenter     = lazy(() => import('./components/FinancialCenter'));
const HospitalMap         = lazy(() => import('./components/HospitalMap'));
const StaffScheduling     = lazy(() => import('./components/StaffScheduling'));
const BloodBank           = lazy(() => import('./components/BloodBank'));
const SurgeryScheduler    = lazy(() => import('./components/SurgeryScheduler'));
const AmbulanceTracker    = lazy(() => import('./components/AmbulanceTracker'));
const WardRounds          = lazy(() => import('./components/WardRounds'));
const InfectionControl    = lazy(() => import('./components/InfectionControl'));
const NutritionDietetics  = lazy(() => import('./components/NutritionDietetics'));
const SupportCenter       = lazy(() => import('./components/SupportCenter'));
const DigitalTwin         = lazy(() => import('./components/DigitalTwin'));
const GenomicAI           = lazy(() => import('./components/GenomicAI'));
const NanobotRadar        = lazy(() => import('./components/NanobotRadar'));
const NeuralInterface     = lazy(() => import('./components/NeuralInterface'));

const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px', color: 'var(--text-muted)' }}>
    <div style={{ width: '32px', height: '32px', border: '3px solid rgba(0,229,255,0.2)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <span style={{ fontSize: '1rem', fontFamily: 'Outfit, sans-serif' }}>Yükleniyor...</span>
  </div>
);

// Sabit 3 hasta — modül seviyesinde bir kez tanımlanır
const INITIAL_PATIENTS = [
  {
    id: 1, name: 'Ahmet Yılmaz', disease: 'Hipertansiyon',
    threshold: 140, currentValue: 120, literacy: true,
    questions: ['Bugünkü büyük tansiyon ölçümünüz kaç çıktı?'],
    status: 'safe', healthScore: 85, medications: [],
    history: [
      { date: '01.07', value: 130 }, { date: '02.07', value: 135 },
      { date: '03.07', value: 128 }, { date: '04.07', value: 120 }
    ]
  },
  {
    id: 2, name: 'Ayşe Kaya', disease: 'Diyabet',
    threshold: 200, currentValue: 145, literacy: false,
    questions: ['Bugünkü tokluk kan şekeriniz kaç çıktı?'],
    status: 'safe', healthScore: 78, medications: [],
    history: [
      { date: '01.07', value: 160 }, { date: '02.07', value: 155 },
      { date: '03.07', value: 140 }, { date: '04.07', value: 145 }
    ]
  },
  {
    id: 3, name: 'Mehmet Demir', disease: 'Kalp Yetmezliği',
    threshold: 100, currentValue: 75, literacy: true,
    questions: ['Bugün nefes darlığı yaşadınız mı? (0-10)'],
    status: 'safe', healthScore: 91, medications: [
      { id: 1, name: 'Furosemid', dosage: '40mg', frequency: 'Günde 1' }
    ],
    history: [
      { date: '02.07', value: 80 }, { date: '03.07', value: 72 }, { date: '04.07', value: 75 }
    ]
  },
];

function App() {
  const [activeView, setActiveView]             = useState('doctor');
  const [theme, setTheme]                       = useState('dark');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandSearch, setCommandSearch]       = useState('');
  const [showOtherModules, setShowOtherModules] = useState(false);
  const [toasts, setToasts]                     = useState([]);

  // ─── Toast yönetimi ───
  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    if (theme === 'light') document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');
  }, [theme]);

  // Command palette keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
        setCommandSearch('');
      }
      if (e.key === 'Escape') setShowCommandPalette(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Lazy initializer — sadece ilk mount'ta çalışır, 997 ek hasta üretir
  const [patients, setPatients] = useState(() => [
    ...INITIAL_PATIENTS,
    ...generateExtraPatients(197, 4),
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, patientId: 1, patientName: 'Ahmet Yılmaz', title: 'Sabah tansiyonunu ölç ve gönder', category: 'Ölçüm', priority: 'urgent', done: false, dueDate: new Date().toISOString().split('T')[0], createdAt: new Date().toLocaleTimeString() },
    { id: 2, patientId: 2, patientName: 'Ayşe Kaya', title: 'Metformin 500mg öğle dozu', category: 'İlaç Takibi', priority: 'high', done: false, dueDate: new Date().toISOString().split('T')[0], createdAt: new Date().toLocaleTimeString() },
    { id: 3, patientId: 3, patientName: 'Mehmet Demir', title: 'Haftalık kardiyoloji kontrolüne git', category: 'Kontrol', priority: 'normal', done: true, dueDate: new Date().toISOString().split('T')[0], createdAt: new Date().toLocaleTimeString() },
  ]);

  const [appointments, setAppointments] = useState([
    { id: 1, patientId: 1, patientName: 'Ahmet Yılmaz', type: 'Tansiyon Takibi', date: '2026-07-10', time: '09:30', status: 'upcoming', note: 'Son ilaç değişikliği sonrası kontrol.' },
    { id: 2, patientId: 2, patientName: 'Ayşe Kaya', type: 'Diyabet Kontrolü', date: '2026-07-12', time: '14:00', status: 'upcoming', note: 'Tokluk şekeri ölçümü getirilecek.' },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'Sistem başlatıldı. 3 aktif hasta izleniyor.', time: new Date().toLocaleTimeString(), read: false }
  ]);
  const [alertState, setAlertState] = useState({ triggered: false, message: '', patientName: '' });

  const unreadCount = notifications.filter(n => !n.read).length;

  const calculateHealthScore = (newValue, threshold) => {
    if (newValue >= threshold) return Math.max(0, 100 - ((newValue - threshold) * 2) - 40);
    return Math.min(100, Math.round(100 - (newValue / threshold) * 30));
  };

  const handlePatientSubmit = (patientId, answerValue) => {
    const idx = patients.findIndex(p => p.id === patientId);
    if (idx === -1) return;
    const patient = patients[idx];
    const newValue = parseInt(answerValue, 10);
    if (isNaN(newValue)) return;
    const newStatus = newValue >= patient.threshold ? 'danger' : 'safe';
    const today = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
    const updatedHistory = [...patient.history, { date: today, value: newValue }];
    const newHealthScore = calculateHealthScore(newValue, patient.threshold);
    const newPatients = [...patients];
    newPatients[idx] = { ...patient, currentValue: newValue, status: newStatus, history: updatedHistory, healthScore: newHealthScore };
    setPatients(newPatients);
    addNotification(newStatus === 'danger' ? 'danger' : 'success',
      `${patient.name} ölçüm gönderdi: ${newValue}. Sağlık Skoru: ${newHealthScore}`);
    if (newStatus === 'danger') {
      addNotification('danger', `ACİL: ${patient.name} kritik eşiği aştı!`);
      setAlertState({ triggered: true, message: `Kritik Eşik Aşıldı! Ölçüm: ${newValue} (Sınır: ${patient.threshold})`, patientName: patient.name });
      addToast('danger', `🚨 ACİL: ${patient.name} kritik eşiği aştı! (${newValue}/${patient.threshold})`);
    } else {
      addToast('success', `✅ ${patient.name} ölçüm gönderdi: ${newValue}`);
    }
  };

  const addNotification = (type, message) => {
    setNotifications(prev => [{ id: Date.now(), type, message, time: new Date().toLocaleTimeString(), read: false }, ...prev]);
  };

  const NAV = [
    { key: 'digitaltwin',   icon: <Activity size={18} />,        label: 'Dijital İkiz (3D)' },
    { key: 'genomic',       icon: <Dna size={18} />,             label: 'Genomik AI & CRISPR' },
    { key: 'nanobot',       icon: <Target size={18} />,          label: 'Nanobot Sürü' },
    { key: 'neural',        icon: <BrainCircuit size={18} />,    label: 'Nöral Arayüz (BCI)' },
    { key: 'doctor',        icon: <Users size={18} />,           label: 'Doktor Paneli' },
    { key: 'kpi',           icon: <LayoutDashboard size={18} />, label: 'KPI Panosu' },
    { key: 'ai',            icon: <Sparkles size={18} />,        label: 'MediAI Asistan' },
    { key: 'emergency',     icon: <Siren size={18} />,           label: 'Acil & Triyaj' },
    { key: 'operations',    icon: <Landmark size={18} />,        label: 'Operasyon Merkezi' },
    { key: 'financial',     icon: <DollarSign size={18} />,      label: 'Finansal Merkez' },
    { key: 'hospitalmap',   icon: <MapPin size={18} />,          label: 'Hastane Haritası' },
    { key: 'bloodbank',     icon: <Droplets size={18} />,        label: 'Kan Bankası' },
    { key: 'scheduling',    icon: <CalendarRange size={18} />,   label: 'Personel Çizelge' },
    { key: 'surgery',       icon: <Scissors size={18} />,        label: 'Ameliyat Planlama' },
    { key: 'ambulance',     icon: <Truck size={18} />,           label: 'Ambulans Takip' },
    { key: 'rounds',        icon: <Stethoscope size={18} />,     label: 'Vizit Yönetimi' },
    { key: 'infection',     icon: <Shield size={18} />,          label: 'Enfeksiyon Kontrol' },
    { key: 'nutrition',     icon: <Apple size={18} />,           label: 'Beslenme & Diyetet' },
    { key: 'telemetry',     icon: <Wifi size={18} />,            label: 'IoT Telemetri' },
    { key: 'inventory',     icon: <Package size={18} />,         label: 'Stok & Eczane' },
    { key: 'portal',        icon: <Smartphone size={18} />,      label: 'Hasta Portalı' },
    { key: 'radiology',     icon: <ScanLine size={18} />,        label: 'Radyoloji' },
    { key: 'quality',       icon: <ShieldCheck size={18} />,     label: 'Kalite & Güvenlik' },
    { key: 'icu',           icon: <Bed size={18} />,             label: 'Yoğun Bakım (YBÜ)' },
    { key: 'onboarding',    icon: <UserPlus size={18} />,        label: 'Hasta Kayıt' },
    { key: 'patient',       icon: <Phone size={18} />,           label: 'Hasta Simülatörü' },
    { key: 'appointments',  icon: <CalendarDays size={18} />,    label: 'Randevular' },
    { key: 'protocols',     icon: <ClipboardList size={18} />,   label: 'Klinik Protokoller' },
    { key: 'medications',   icon: <Pill size={18} />,            label: 'İlaç Yönetimi' },
    { key: 'lab',           icon: <Microscope size={18} />,      label: 'Laboratuvar' },
    { key: 'team',          icon: <Building2 size={18} />,       label: 'Personel Yönetimi' },
    { key: 'tasks',         icon: <CheckSquare size={18} />,     label: 'Görevler' },
    { key: 'notes',         icon: <FileText size={18} />,        label: 'Klinik Notlar' },
    { key: 'reports',       icon: <FileDown size={18} />,        label: 'Raporlar' },
    { key: 'calendar',      icon: <Calendar size={18} />,        label: 'Risk Takvimi' },
    { key: 'chat',          icon: <MessageSquare size={18} />,   label: 'Mesajlaşma' },
    { key: 'analytics',     icon: <BarChart2 size={18} />,       label: 'Analitik' },
    { key: 'notifications', icon: <Bell size={18} />,            label: 'Bildirimler', badge: unreadCount },
    { key: 'settings',      icon: <Settings size={18} />,        label: 'Ayarlar' },
    { key: 'support',       icon: <LifeBuoy size={18} />,         label: 'Yazılım Desteği' },
  ];

  // Command palette items
  const COMMANDS = [
    ...NAV.map(n => ({ label: `📍 ${n.label}`, action: () => { setActiveView(n.key); setShowCommandPalette(false); } })),
    ...patients.map(p => ({ label: `👤 ${p.name} — ${p.disease}`, action: () => { setActiveView('doctor'); setShowCommandPalette(false); } })),
    { label: `🌙 Tema Değiştir (${theme === 'dark' ? 'Gündüz' : 'Gece'})`, action: () => { setTheme(t => t === 'dark' ? 'light' : 'dark'); setShowCommandPalette(false); } },
  ];

  const filteredCommands = commandSearch
    ? COMMANDS.filter(c => c.label.toLowerCase().includes(commandSearch.toLowerCase()))
    : COMMANDS;

  /* ─── Sidebar nav item renderer ─── */
  const NavItem = ({ item, compact = false }) => {
    const isActive = activeView === item.key;
    return (
      <button
        key={item.key}
        onClick={() => setActiveView(item.key)}
        className={`glass-button nav-item ${isActive ? 'nav-item-active' : ''}`}
        style={{
          width: '100%',
          justifyContent: 'space-between',
          padding: compact ? '9px 14px' : '11px 14px',
          fontSize: compact ? '0.85rem' : '0.92rem',
          fontWeight: isActive ? 700 : 400,
          marginBottom: compact ? 2 : 3,
          borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
          borderRadius: '0 8px 8px 0',
          background: isActive
            ? 'rgba(0,229,255,0.1)'
            : 'transparent',
          borderTop: 'none',
          borderRight: 'none',
          borderBottom: 'none',
          transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
          color: isActive ? 'var(--primary)' : 'var(--text-main)',
          opacity: compact && !isActive ? 0.8 : 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <span style={{ transition: 'transform 0.2s ease', transform: isActive ? 'scale(1.15)' : 'scale(1)' }}>
            {item.icon}
          </span>
          {item.label}
        </div>
        {item.badge > 0 && (
          <span style={{
            background: 'var(--danger)', color: '#fff',
            padding: '1px 7px', borderRadius: '10px', fontSize: '0.72rem',
            fontWeight: 700, boxShadow: '0 0 8px rgba(239,68,68,0.5)',
          }}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className={`app-container ${theme === 'light' ? 'light-mode' : ''}`}>

      {/* ─── Sidebar ─── */}
      <div className="sidebar glass-panel" style={{ borderRadius: 0, borderTop: 0, borderBottom: 0, borderLeft: 0, display: 'flex', flexDirection: 'column', width: '220px' }}>

        {/* Logo */}
        <div className="flex-center mb-4" style={{ flexDirection: 'column', gap: '10px' }}>
          <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '14px', boxShadow: '0 0 20px rgba(0,229,255,0.4)' }}>
            <Activity size={28} color="#fff" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1rem', letterSpacing: '1px', color: 'var(--text-main)', fontWeight: 800 }}>MediTrack</h2>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Enterprise v10.0</p>
          </div>
        </div>

        {/* Command Palette Trigger */}
        <button className="glass-button" onClick={() => setShowCommandPalette(true)}
          style={{ width: '100%', justifyContent: 'space-between', padding: '8px 12px', fontSize: '0.8rem', marginBottom: '12px', opacity: 0.7 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
            <Search size={14} /> Ara...
          </div>
          <kbd style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontFamily: 'Outfit' }}>⌘K</kbd>
        </button>

        {/* Nav Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', flex: 1, overflowY: 'auto' }} className="thin-scroll">

          {/* Kronik Takip bölümü */}
          <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '1px', marginBottom: 6, marginTop: 4, paddingLeft: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Activity size={12} /> KRONİK TAKİP
          </div>
          {NAV.filter(item => item.key === 'doctor' || item.key === 'patient').map(item => (
            <NavItem key={item.key} item={item} compact={false} />
          ))}

          {/* Diğer modüller */}
          <div
            onClick={() => setShowOtherModules(!showOtherModules)}
            style={{
              fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)',
              letterSpacing: '0.5px', marginBottom: 6, marginTop: 20, paddingLeft: 8,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              transition: 'color 0.2s ease',
              userSelect: 'none',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <span style={{ transition: 'transform 0.2s ease', display: 'inline-flex', transform: showOtherModules ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
              <ChevronDown size={13} />
            </span>
            DİĞER HASTANE MODÜLLERİ
          </div>

          {showOtherModules && NAV.filter(item => item.key !== 'doctor' && item.key !== 'patient' && item.key !== 'support').map(item => (
            <NavItem key={item.key} item={item} compact={true} />
          ))}

          {/* ─── Destek Merkezi (her zaman görünür) ─── */}
          <div style={{ marginTop: 'auto', paddingTop: '14px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#10b981', letterSpacing: '1px', marginBottom: 6, paddingLeft: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
              <LifeBuoy size={12} /> YAZILIM DESTEĞİ
            </div>
            <NavItem key="support" item={NAV.find(n => n.key === 'support')} compact={false} />
          </div>
        </div>

        {/* Alt Bölüm: Tema Toggle */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            MediTrack Enterprise v10.0
          </div>

          {/* Pill Toggle */}
          <div
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: '50px',
              background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              border: '1px solid var(--glass-border)',
              cursor: 'pointer', transition: 'all 0.3s ease',
              userSelect: 'none',
            }}
            onMouseEnter={e => e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
          >
            {/* Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Moon size={14} style={{ color: theme === 'dark' ? 'var(--primary)' : 'var(--text-muted)', transition: 'color 0.3s' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'Outfit' }}>Gece</span>
            </div>

            {/* Toggle Track */}
            <div style={{
              width: '36px', height: '20px', borderRadius: '10px', position: 'relative',
              background: theme === 'dark' ? 'rgba(0,229,255,0.3)' : 'rgba(245,158,11,0.35)',
              transition: 'background 0.3s ease', border: '1px solid var(--glass-border)',
            }}>
              <div style={{
                width: '14px', height: '14px', borderRadius: '50%', position: 'absolute',
                top: '2px', left: theme === 'dark' ? '3px' : '19px',
                background: theme === 'dark' ? 'var(--primary)' : '#f59e0b',
                transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: `0 0 6px ${theme === 'dark' ? 'rgba(0,229,255,0.6)' : 'rgba(245,158,11,0.6)'}`,
              }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'Outfit' }}>Gündüz</span>
              <Sun size={14} style={{ color: theme === 'light' ? '#f59e0b' : 'var(--text-muted)', transition: 'color 0.3s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="main-content">
        <Suspense fallback={<PageLoader />}>
          {activeView === 'doctor'        && <DoctorDashboard patients={patients} setPatients={setPatients} addNotification={addNotification} addToast={addToast} theme={theme} tasks={tasks} setTasks={setTasks} appointments={appointments} setAppointments={setAppointments} />}
          {activeView === 'kpi'           && <KPIDashboard patients={patients} />}
          {activeView === 'ai'            && <ClinicalAI patients={patients} />}
          {activeView === 'emergency'     && <EmergencyCenter patients={patients} addNotification={addNotification} />}
          {activeView === 'operations'    && <OperationsCenter addNotification={addNotification} />}
          {activeView === 'financial'     && <FinancialCenter addNotification={addNotification} />}
          {activeView === 'hospitalmap'   && <HospitalMap />}
          {activeView === 'bloodbank'     && <BloodBank addNotification={addNotification} />}
          {activeView === 'scheduling'    && <StaffScheduling addNotification={addNotification} />}
          {activeView === 'surgery'       && <SurgeryScheduler addNotification={addNotification} />}
          {activeView === 'ambulance'     && <AmbulanceTracker addNotification={addNotification} />}
          {activeView === 'rounds'        && <WardRounds addNotification={addNotification} />}
          {activeView === 'infection'     && <InfectionControl addNotification={addNotification} />}
          {activeView === 'nutrition'     && <NutritionDietetics addNotification={addNotification} />}
          {activeView === 'telemetry'     && <DeviceTelemetry />}
          {activeView === 'inventory'     && <InventoryPharmacy />}
          {activeView === 'portal'        && <PatientPortal />}
          {activeView === 'radiology'     && <RadiologyCenter />}
          {activeView === 'quality'       && <QualityAssurance />}
          {activeView === 'icu'           && <ICUMonitor />}
          {activeView === 'onboarding'    && <PatientOnboarding patients={patients} setPatients={setPatients} addNotification={addNotification} />}
          {activeView === 'patient'       && <PatientSimulator patients={patients} onSubmit={handlePatientSubmit} addToast={addToast} />}
          {activeView === 'appointments'  && <AppointmentManager patients={patients} addNotification={addNotification} appointments={appointments} setAppointments={setAppointments} />}
          {activeView === 'protocols'     && <ClinicalProtocols patients={patients} setPatients={setPatients} tasks={tasks} setTasks={setTasks} appointments={appointments} setAppointments={setAppointments} addNotification={addNotification} />}
          {activeView === 'medications'   && <MedicationManager patients={patients} addNotification={addNotification} />}
          {activeView === 'lab'           && <LabResults patients={patients} />}
          {activeView === 'team'          && <TeamManagement addNotification={addNotification} />}
          {activeView === 'tasks'         && <TaskManager patients={patients} addNotification={addNotification} tasks={tasks} setTasks={setTasks} />}
          {activeView === 'notes'         && <PatientNotes patients={patients} addNotification={addNotification} />}
          {activeView === 'reports'       && <ReportCenter patients={patients} addNotification={addNotification} />}
          {activeView === 'calendar'      && <RiskCalendar patients={patients} />}
          {activeView === 'chat'          && <LiveChat patients={patients} />}
          {activeView === 'analytics'     && <AnalyticsPage patients={patients} />}
          {activeView === 'notifications' && <NotificationCenter notifications={notifications} setNotifications={setNotifications} />}
          {activeView === 'settings'      && <SettingsPage addNotification={addNotification} />}
          {activeView === 'support'       && <SupportCenter addNotification={addNotification} addToast={addToast} />}
          {activeView === 'digitaltwin'   && <DigitalTwin />}
          {activeView === 'genomic'       && <GenomicAI />}
          {activeView === 'nanobot'       && <NanobotRadar />}
          {activeView === 'neural'        && <NeuralInterface />}
        </Suspense>
      </div>

      {/* ─── Alert Modal ─── */}
      {alertState.triggered && (
        <AlertModal
          patientName={alertState.patientName}
          message={alertState.message}
          onClose={() => setAlertState({ triggered: false, message: '', patientName: '' })}
        />
      )}

      {/* ─── Command Palette ─── */}
      {showCommandPalette && (
        <div className="animate-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '80px' }}
          onClick={() => setShowCommandPalette(false)}>
          <div className="glass-panel animate-slide-in" style={{ width: '600px', maxWidth: '92vw', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid var(--glass-border)' }}>
              <Search size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
              <input autoFocus value={commandSearch} onChange={e => setCommandSearch(e.target.value)}
                placeholder="Sayfa, hasta veya işlem ara..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '1.1rem', color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }} />
              <button onClick={() => setShowCommandPalette(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '8px' }}>
              {filteredCommands.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Sonuç bulunamadı.</div>
              ) : filteredCommands.map((cmd, i) => (
                <button key={i} onClick={cmd.action}
                  style={{ width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', color: 'var(--text-main)', fontSize: '0.95rem', fontFamily: 'Outfit, sans-serif', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {cmd.label}
                </button>
              ))}
            </div>
            <div style={{ padding: '10px 20px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              <span><kbd style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', fontFamily: 'Outfit' }}>↵</kbd> seç</span>
              <span><kbd style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', fontFamily: 'Outfit' }}>Esc</kbd> kapat</span>
              <span><kbd style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', fontFamily: 'Outfit' }}>⌘K</kbd> aç/kapat</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Global Toast Bildirimleri ─── */}
      <ToastNotification toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
