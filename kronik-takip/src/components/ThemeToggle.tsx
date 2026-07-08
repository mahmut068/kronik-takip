'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className="btn"
      style={{ 
        background: theme === 'cyber' ? 'rgba(0, 242, 254, 0.1)' : 'rgba(15, 23, 42, 0.05)', 
        border: theme === 'cyber' ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid rgba(0,0,0,0.1)',
        color: theme === 'cyber' ? '#00f2fe' : '#475569',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: 700
      }}
    >
      {theme === 'cyber' ? (
        <><Sun size={16} /> Gündüz Modu</>
      ) : (
        <><Moon size={16} /> Siber Mod</>
      )}
    </button>
  );
}
