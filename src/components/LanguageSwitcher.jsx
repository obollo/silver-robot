import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSwitcher({ className = '' }) {
  const { lang, setLang, languages } = useLanguage();
  return (
    <div className={`inline-flex bg-white/80 backdrop-blur rounded-full shadow-sm p-0.5 ${className}`}>
      {languages.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
            lang === code ? 'bg-violet-500 text-white' : 'text-gray-500'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
