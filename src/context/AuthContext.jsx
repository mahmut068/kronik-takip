import React, { createContext, useContext, useState } from 'react';

// ─── Sistem Kullanıcıları ───────────────────────────────────────────────────────
const USERS = [
  {
    id: 1,
    name: 'Dr. Mehmet Öztürk',
    role: 'doktor',
    specialty: 'Kardiyoloji',
    avatar: 'MÖ',
    color: '#00e5ff',
  },
  {
    id: 2,
    name: 'Hemş. Ayşe Kılıç',
    role: 'hemşire',
    unit: 'Dahiliye',
    avatar: 'AK',
    color: '#10b981',
  },
  {
    id: 3,
    name: 'Admin Kullanıcı',
    role: 'admin',
    department: 'BT Yönetimi',
    avatar: 'AD',
    color: '#a78bfa',
  },
  {
    id: 4,
    name: 'Hasta - Ahmet Yılmaz',
    role: 'hasta',
    avatar: 'AY',
    color: '#f59e0b',
  },
];

// ─── Rol Erişim Tablosu ──────────────────────────────────────────────────────
// null = tüm modüllere tam erişim (admin)
const ROLE_ACCESS = {
  doktor: [
    'doctor',
    'patient',
    'kpi',
    'ai',
    'emergency',
    'appointments',
    'protocols',
    'medications',
    'lab',
    'tasks',
    'notes',
    'reports',
    'calendar',
    'chat',
    'analytics',
    'notifications',
    'settings',
    'live',
    'audit',
    'onboarding',
    'rounds',
    'infection',
    'nutrition',
  ],
  hemşire: [
    'doctor',
    'patient',
    'appointments',
    'tasks',
    'notes',
    'medications',
    'notifications',
    'chat',
    'live',
    'calendar',
    'lab',
  ],
  admin: null,
  hasta: ['portal'],
};

// ─── Context ─────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('meditrack_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  /**
   * Kullanıcı girişi — userId: 1-4 arası ya da role string ('doktor' | 'hemşire' | 'admin' | 'hasta')
   */
  function login(userIdOrRole) {
    let user;

    if (typeof userIdOrRole === 'number') {
      user = USERS.find((u) => u.id === userIdOrRole);
    } else {
      user = USERS.find((u) => u.role === userIdOrRole);
    }

    if (!user) {
      console.error('[AuthContext] Geçersiz kullanıcı:', userIdOrRole);
      return;
    }

    setCurrentUser(user);
    try {
      localStorage.setItem('meditrack_user', JSON.stringify(user));
    } catch {
      // localStorage mevcut değilse sessizce geç
    }
  }

  /** Oturumu sonlandır */
  function logout() {
    setCurrentUser(null);
    try {
      localStorage.removeItem('meditrack_user');
    } catch {
      // ignore
    }
  }

  /**
   * Belirtilen modül anahtarına erişim var mı?
   * @param {string} key - Modül anahtarı (örn. 'lab', 'portal', 'ai')
   * @returns {boolean}
   */
  function hasAccess(key) {
    if (!currentUser) return false;
    const allowed = ROLE_ACCESS[currentUser.role];
    if (allowed === null) return true; // admin — tam erişim
    if (!Array.isArray(allowed)) return false;
    return allowed.includes(key);
  }

  const value = {
    currentUser,
    login,
    logout,
    hasAccess,
    USERS,
    ROLE_ACCESS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Custom Hook ─────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth() must be used inside <AuthProvider>');
  }
  return ctx;
}

export default AuthContext;
