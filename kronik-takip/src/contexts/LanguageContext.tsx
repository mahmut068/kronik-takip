'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import tr from '@/i18n/locales/tr.json';
import en from '@/i18n/locales/en.json';
import ar from '@/i18n/locales/ar.json';

const dictionaries: Record<string, any> = { tr, en, ar };

type LanguageContextType = {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState('tr');

  // Sayfa yenilendiğinde seçili dili hatırlamak için localStorage eklenebilir.
  useEffect(() => {
    const saved = localStorage.getItem('app_lang');
    if (saved && dictionaries[saved]) setLang(saved);
  }, []);

  const changeLang = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const t = (keyString: string) => {
    const keys = keyString.split('.');
    let result = dictionaries[lang];
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        // Eğer çeviri bulunamazsa key'in kendisini döndür
        return keyString;
      }
    }
    return result as string;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
