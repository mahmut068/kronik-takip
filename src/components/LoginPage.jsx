import React, { useState } from 'react';
import {
  Activity,
  Stethoscope,
  Heart,
  Shield,
  User,
  Lock,
  CheckCircle,
  Wifi,
  ChevronRight,
  Loader2,
} from 'lucide-react';

// ─── Rol Konfigürasyonları ───────────────────────────────────────────────────
const ROLES = [
  {
    key: 'doktor',
    userId: 1,
    label: 'Doktor',
    name: 'Dr. Mehmet Öztürk',
    sub: 'Kardiyoloji Uzmanı',
    color: '#00e5ff',
    shadowColor: 'rgba(0,229,255,0.35)',
    bgColor: 'rgba(0,229,255,0.08)',
    Icon: Stethoscope,
  },
  {
    key: 'hemşire',
    userId: 2,
    label: 'Hemşire',
    name: 'Hemş. Ayşe Kılıç',
    sub: 'Dahiliye Birimi',
    color: '#10b981',
    shadowColor: 'rgba(16,185,129,0.35)',
    bgColor: 'rgba(16,185,129,0.08)',
    Icon: Heart,
  },
  {
    key: 'admin',
    userId: 3,
    label: 'Admin',
    name: 'Admin Kullanıcı',
    sub: 'BT Yönetimi',
    color: '#a78bfa',
    shadowColor: 'rgba(167,139,250,0.35)',
    bgColor: 'rgba(167,139,250,0.08)',
    Icon: Shield,
  },
  {
    key: 'hasta',
    userId: 4,
    label: 'Hasta',
    name: 'Hasta Portalı',
    sub: 'Kendi verilerinizi görün',
    color: '#f59e0b',
    shadowColor: 'rgba(245,158,11,0.35)',
    bgColor: 'rgba(245,158,11,0.08)',
    Icon: User,
  },
];

// ─── Inline Keyframes (enjekte — sadece bir kez) ─────────────────────────────
const STYLE_ID = 'meditrack-login-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes gradientShift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes orb1 {
      0%,100% { transform: translate(0,0) scale(1); }
      33%      { transform: translate(80px,-60px) scale(1.15); }
      66%      { transform: translate(-60px,80px) scale(0.9); }
    }
    @keyframes orb2 {
      0%,100% { transform: translate(0,0) scale(1); }
      33%      { transform: translate(-100px,50px) scale(0.85); }
      66%      { transform: translate(70px,-80px) scale(1.1); }
    }
    @keyframes orb3 {
      0%,100% { transform: translate(0,0) scale(1); }
      50%      { transform: translate(40px,60px) scale(1.2); }
    }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeSlideLeft {
      from { opacity: 0; transform: translateX(-32px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeSlideRight {
      from { opacity: 0; transform: translateX(32px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(0.9); opacity: 1; }
      100% { transform: scale(1.5); opacity: 0; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes logoGlow {
      0%,100% { filter: drop-shadow(0 0 8px #00e5ff80); }
      50%      { filter: drop-shadow(0 0 20px #00e5ffcc); }
    }
    @keyframes badgePulse {
      0%,100% { opacity: 0.7; }
      50%      { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

// ─── LoginPage Component ──────────────────────────────────────────────────────
export default function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hoveredRole, setHoveredRole] = useState(null);

  const selectedConfig = ROLES.find((r) => r.key === selectedRole);

  function handleLogin() {
    if (!selectedRole || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(selectedRole);
    }, 1000);
  }

  const btnColor = selectedConfig ? selectedConfig.color : '#00e5ff';
  const btnShadow = selectedConfig ? selectedConfig.shadowColor : 'rgba(0,229,255,0.35)';

  // ── Styles ──────────────────────────────────────────────────────────────────
  const s = {
    // Wrapper — full screen animated background
    wrapper: {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg,#060b18 0%,#0a0f1c 40%,#0d1526 70%,#060b18 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      overflow: 'hidden',
      padding: '24px',
      fontFamily: "'Outfit', sans-serif",
    },

    // Ambient orbs
    orb1: {
      position: 'absolute',
      width: '520px',
      height: '520px',
      borderRadius: '50%',
      background: 'radial-gradient(circle,rgba(0,229,255,0.12) 0%,transparent 70%)',
      top: '-120px',
      left: '-120px',
      animation: 'orb1 18s ease-in-out infinite',
      pointerEvents: 'none',
    },
    orb2: {
      position: 'absolute',
      width: '600px',
      height: '600px',
      borderRadius: '50%',
      background: 'radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%)',
      bottom: '-180px',
      right: '-100px',
      animation: 'orb2 22s ease-in-out infinite',
      pointerEvents: 'none',
    },
    orb3: {
      position: 'absolute',
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background: 'radial-gradient(circle,rgba(167,139,250,0.08) 0%,transparent 70%)',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      animation: 'orb3 14s ease-in-out infinite',
      pointerEvents: 'none',
    },

    // Main card
    card: {
      position: 'relative',
      display: 'flex',
      flexWrap: 'wrap',
      width: '100%',
      maxWidth: '960px',
      minHeight: '580px',
      background: 'rgba(10,15,28,0.75)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '24px',
      boxShadow:
        '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
      animation: 'fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both',
      overflow: 'hidden',
    },

    // ── LEFT PANEL ──
    leftPanel: {
      flex: '1.2',
      minWidth: '280px',
      padding: '52px 44px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background:
        'linear-gradient(160deg,rgba(0,229,255,0.06) 0%,rgba(59,130,246,0.04) 60%,transparent 100%)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      animation: 'fadeSlideLeft 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both',
    },

    logoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      marginBottom: '8px',
    },
    logoIconWrap: {
      position: 'relative',
      width: '52px',
      height: '52px',
      borderRadius: '14px',
      background: 'rgba(0,229,255,0.12)',
      border: '1px solid rgba(0,229,255,0.25)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoIconPulse: {
      position: 'absolute',
      inset: 0,
      borderRadius: '14px',
      border: '1px solid rgba(0,229,255,0.4)',
      animation: 'pulse-ring 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
    },
    brandName: {
      fontSize: '26px',
      fontWeight: '700',
      color: '#f8fafc',
      letterSpacing: '-0.5px',
      lineHeight: '1.1',
    },
    brandVersion: {
      fontSize: '12px',
      fontWeight: '400',
      color: '#94a3b8',
      marginTop: '2px',
    },

    headline: {
      fontSize: '36px',
      fontWeight: '700',
      color: '#f8fafc',
      lineHeight: '1.15',
      letterSpacing: '-0.8px',
      marginTop: '32px',
      marginBottom: '8px',
    },
    headlinePrimary: {
      color: '#00e5ff',
      display: 'block',
    },
    subHeadline: {
      fontSize: '14px',
      color: '#94a3b8',
      lineHeight: '1.6',
      marginBottom: '36px',
    },

    // Feature list
    featureList: {
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '14px 18px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '12px',
    },
    featureEmoji: {
      fontSize: '22px',
      lineHeight: '1',
      flexShrink: 0,
    },
    featureText: {
      fontSize: '14px',
      color: '#cbd5e1',
      fontWeight: '500',
    },
    featureSub: {
      fontSize: '12px',
      color: '#64748b',
      marginTop: '2px',
    },

    // Security badge
    securityBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '36px',
      padding: '10px 16px',
      background: 'rgba(16,185,129,0.08)',
      border: '1px solid rgba(16,185,129,0.2)',
      borderRadius: '40px',
      width: 'fit-content',
      animation: 'badgePulse 3s ease-in-out infinite',
    },
    securityText: {
      fontSize: '11px',
      color: '#10b981',
      fontWeight: '600',
      letterSpacing: '0.4px',
    },

    // ── RIGHT PANEL ──
    rightPanel: {
      flex: '1',
      minWidth: '280px',
      padding: '52px 40px',
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeSlideRight 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s both',
    },

    rightTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#f8fafc',
      marginBottom: '6px',
    },
    rightSub: {
      fontSize: '13px',
      color: '#64748b',
      marginBottom: '28px',
    },

    // Role grid
    roleGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
      marginBottom: '28px',
    },

    // Login button
    loginBtn: (color, shadow, disabled) => ({
      width: '100%',
      padding: '16px',
      borderRadius: '12px',
      border: 'none',
      background: disabled
        ? 'rgba(255,255,255,0.05)'
        : `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
      color: disabled ? '#4b5563' : '#000',
      fontSize: '15px',
      fontWeight: '700',
      fontFamily: "'Outfit', sans-serif",
      letterSpacing: '0.3px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      boxShadow: disabled ? 'none' : `0 4px 24px ${shadow}`,
      transform: disabled ? 'none' : 'translateY(0)',
      marginBottom: '16px',
    }),

  };

  // ── Role Card ──────────────────────────────────────────────────────────────
  function RoleCard({ role }) {
    const isSelected = selectedRole === role.key;
    const isHovered = hoveredRole === role.key;
    const { Icon } = role;

    return (
      <div
        onClick={() => setSelectedRole(role.key)}
        onMouseEnter={() => setHoveredRole(role.key)}
        onMouseLeave={() => setHoveredRole(null)}
        style={{
          padding: '18px 14px',
          borderRadius: '14px',
          cursor: 'pointer',
          border: isSelected
            ? `1.5px solid ${role.color}`
            : '1.5px solid rgba(255,255,255,0.07)',
          background: isSelected
            ? role.bgColor
            : isHovered
            ? 'rgba(255,255,255,0.04)'
            : 'rgba(255,255,255,0.02)',
          boxShadow: isSelected
            ? `0 0 24px ${role.shadowColor}, inset 0 1px 0 rgba(255,255,255,0.06)`
            : 'none',
          transform: isHovered && !isSelected ? 'scale(1.02)' : isSelected ? 'scale(1.01)' : 'scale(1)',
          transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {isSelected && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: role.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle size={12} color="#000" />
          </div>
        )}

        {/* Icon */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: isSelected ? `${role.color}22` : 'rgba(255,255,255,0.05)',
            border: `1px solid ${isSelected ? role.color + '44' : 'rgba(255,255,255,0.08)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.25s ease',
          }}
        >
          <Icon size={20} color={isSelected ? role.color : '#64748b'} strokeWidth={1.8} />
        </div>

        {/* Text */}
        <div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: '700',
              color: isSelected ? role.color : '#cbd5e1',
              marginBottom: '3px',
              transition: 'color 0.2s ease',
            }}
          >
            {role.name}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#475569',
              fontWeight: '400',
            }}
          >
            {role.sub}
          </div>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={s.wrapper}>
      {/* Ambient Orbs */}
      <div style={s.orb1} />
      <div style={s.orb2} />
      <div style={s.orb3} />

      {/* Main Card */}
      <div style={s.card}>

        {/* ══════ LEFT PANEL ══════ */}
        <div style={s.leftPanel}>
          <div>
            {/* Logo */}
            <div style={s.logoRow}>
              <div style={s.logoIconWrap}>
                <div style={s.logoIconPulse} />
                <Activity
                  size={26}
                  color="#00e5ff"
                  strokeWidth={2}
                  style={{ animation: 'logoGlow 3s ease-in-out infinite' }}
                />
              </div>
              <div>
                <div style={s.brandName}>MediTrack</div>
                <div style={s.brandVersion}>Enterprise Edition</div>
              </div>
            </div>

            {/* Headline */}
            <div style={s.headline}>
              Akıllı<br />
              <span style={s.headlinePrimary}>Sağlık Yönetimi</span>
            </div>
            <div style={s.subHeadline}>
              v11.0 — Kronik Hasta Takip Sistemi
            </div>

            {/* Features */}
            <ul style={s.featureList}>
              {[
                {
                  emoji: '🏥',
                  text: '200 aktif hasta izleniyor',
                  sub: 'Gerçek zamanlı durum güncellemeleri',
                },
                {
                  emoji: '🤖',
                  text: 'YZ destekli risk analizi',
                  sub: 'Erken uyarı ve karar destek sistemi',
                },
                {
                  emoji: '📊',
                  text: 'Gerçek zamanlı vital takibi',
                  sub: 'SpO₂, EKG, tansiyon, nabız izleme',
                },
              ].map(({ emoji, text, sub }) => (
                <li key={text} style={s.featureItem}>
                  <span style={s.featureEmoji}>{emoji}</span>
                  <div>
                    <div style={s.featureText}>{text}</div>
                    <div style={s.featureSub}>{sub}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Security Badge */}
          <div style={s.securityBadge}>
            <Lock size={13} color="#10b981" />
            <Wifi size={13} color="#10b981" />
            <span style={s.securityText}>
              Güvenli Bağlantı &nbsp;•&nbsp; KVKK Uyumlu &nbsp;•&nbsp; ISO 27001
            </span>
          </div>
        </div>

        {/* ══════ RIGHT PANEL ══════ */}
        <div style={s.rightPanel}>
          <div style={s.rightTitle}>Rol Seçin ve Giriş Yapın</div>
          <div style={s.rightSub}>Sisteme erişmek istediğiniz rolü seçin</div>

          {/* Role Cards Grid */}
          <div style={s.roleGrid}>
            {ROLES.map((role) => (
              <RoleCard key={role.key} role={role} />
            ))}
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={!selectedRole || loading}
            style={s.loginBtn(btnColor, btnShadow, !selectedRole || loading)}
            onMouseEnter={(e) => {
              if (!selectedRole || loading) return;
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
              e.currentTarget.style.boxShadow = `0 8px 32px ${btnShadow}`;
            }}
            onMouseLeave={(e) => {
              if (!selectedRole || loading) return;
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = `0 4px 24px ${btnShadow}`;
            }}
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  style={{ animation: 'spin 0.8s linear infinite' }}
                />
                <span>Giriş yapılıyor…</span>
              </>
            ) : (
              <>
                <span>
                  {selectedRole
                    ? `${selectedConfig.label} Olarak Giriş Yap`
                    : 'Sisteme Giriş Yap'}
                </span>
                <ChevronRight size={18} />
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}
