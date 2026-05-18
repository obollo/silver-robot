import { createContext, useContext, useState, useCallback } from 'react';
import { translations, LANGUAGES } from './translations';

const LanguageContext = createContext(null);

function detectInitialLang() {
  try {
    const saved = localStorage.getItem('lang');
    if (saved && translations[saved]) return saved;
    const browser = (navigator.language || 'pl').slice(0, 2).toLowerCase();
    if (translations[browser]) return browser;
  } catch {
    // localStorage might be unavailable (private mode)
  }
  return 'pl';
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLang);

  const setLang = useCallback((newLang) => {
    if (!translations[newLang]) return;
    try {
      localStorage.setItem('lang', newLang);
    } catch {
      // ignore storage errors
    }
    setLangState(newLang);
  }, []);

  const t = useCallback(
    (key) => translations[lang]?.[key] ?? translations.en[key] ?? key,
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
