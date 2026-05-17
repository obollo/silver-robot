import { useState } from 'react';
import { motion } from 'framer-motion';
import { ORIGINS, STYLES } from '../data/names';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const GENDERS = [
  { value: 'boy', emoji: '💙' },
  { value: 'girl', emoji: '🩷' },
  { value: 'any', emoji: '✨' },
];

const POPULARITY_OPTIONS = ['any', 'Popular', 'Uncommon', 'Rare'];

const LENGTH_OPTIONS = [
  { value: 'any' },
  { value: 'short', hintKey: 'length.shortHint' },
  { value: 'medium', hintKey: 'length.mediumHint' },
  { value: 'long', hintKey: 'length.longHint' },
];

export default function SetupScreen({ onStart }) {
  const { t } = useLanguage();
  const [gender, setGender] = useState('any');
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [popularity, setPopularity] = useState('any');
  const [length, setLength] = useState('any');

  const toggleChip = (value, list, setList) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleStart = () => {
    onStart({ gender, origins: selectedOrigins, styles: selectedStyles, popularity, length });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 relative text-center">
        <div className="absolute top-4 right-5">
          <LanguageSwitcher />
        </div>
        <div className="text-5xl mb-2 pt-4">👶</div>
        <h1 className="text-3xl font-bold text-gray-800 leading-tight">
          {t('app.title')}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">{t('app.tagline')}</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-5 pb-6 overflow-y-auto space-y-6">

        {/* Gender */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            {t('section.gender')}
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {GENDERS.map(({ value, emoji }) => (
              <button
                key={value}
                onClick={() => setGender(value)}
                className={`py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
                  gender === value
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                <span className="block text-xl mb-0.5">{emoji}</span>
                {t(`gender.${value}`)}
              </button>
            ))}
          </div>
        </section>

        {/* Style / Vibe */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            {t('section.style')}
            {selectedStyles.length > 0 && (
              <span className="ml-2 text-violet-500 normal-case font-normal text-xs">
                {selectedStyles.length} {t('setup.selected')}
              </span>
            )}
          </h2>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((style) => (
              <button
                key={style}
                onClick={() => toggleChip(style, selectedStyles, setSelectedStyles)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  selectedStyles.includes(style)
                    ? 'bg-violet-500 border-violet-500 text-white'
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                {t(`style.${style}`)}
              </button>
            ))}
          </div>
          {selectedStyles.length === 0 && (
            <p className="text-xs text-gray-400 mt-2">{t('setup.leaveEmptyHint')}</p>
          )}
        </section>

        {/* Origin */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            {t('section.origin')}
            {selectedOrigins.length > 0 && (
              <span className="ml-2 text-violet-500 normal-case font-normal text-xs">
                {selectedOrigins.length} {t('setup.selected')}
              </span>
            )}
          </h2>
          <div className="flex flex-wrap gap-2">
            {ORIGINS.map((origin) => (
              <button
                key={origin}
                onClick={() => {
                  if (origin === 'Any') {
                    setSelectedOrigins([]);
                  } else {
                    toggleChip(origin, selectedOrigins, setSelectedOrigins);
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  (origin === 'Any' && selectedOrigins.length === 0) ||
                  selectedOrigins.includes(origin)
                    ? 'bg-violet-500 border-violet-500 text-white'
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                {t(`origin.${origin}`)}
              </button>
            ))}
          </div>
        </section>

        {/* Popularity */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            {t('section.popularity')}
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {POPULARITY_OPTIONS.map((value) => (
              <button
                key={value}
                onClick={() => setPopularity(value)}
                className={`py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                  popularity === value
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                {t(`popularity.${value}`)}
              </button>
            ))}
          </div>
        </section>

        {/* Length */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            {t('section.length')}
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {LENGTH_OPTIONS.map(({ value, hintKey }) => (
              <button
                key={value}
                onClick={() => setLength(value)}
                className={`py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                  length === value
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                {t(`length.${value}`)}
                {hintKey && (
                  <span className="block text-xs font-normal opacity-60">{t(hintKey)}</span>
                )}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Start button */}
      <div className="px-5 pb-8 pt-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold text-lg shadow-lg shadow-violet-200"
        >
          {t('setup.start')}
        </motion.button>
      </div>
    </div>
  );
}
