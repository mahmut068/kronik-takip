'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
      <span 
        onClick={() => setLang('tr')}
        style={{ 
          fontSize: '9px', padding: '2px 4px', borderRadius: '4px', cursor: 'pointer',
          background: lang === 'tr' ? 'rgba(255,255,255,0.1)' : 'transparent',
          color: lang === 'tr' ? '#fff' : '#8b9bb4'
        }}
      >
        TR
      </span>
      <span 
        onClick={() => setLang('en')}
        style={{ 
          fontSize: '9px', padding: '2px 4px', borderRadius: '4px', cursor: 'pointer',
          background: lang === 'en' ? 'rgba(255,255,255,0.1)' : 'transparent',
          color: lang === 'en' ? '#fff' : '#8b9bb4'
        }}
      >
        EN
      </span>
      <span 
        onClick={() => setLang('ar')}
        style={{ 
          fontSize: '9px', padding: '2px 4px', borderRadius: '4px', cursor: 'pointer',
          background: lang === 'ar' ? 'rgba(255,255,255,0.1)' : 'transparent',
          color: lang === 'ar' ? '#fff' : '#8b9bb4'
        }}
      >
        AR
      </span>
    </div>
  );
}
