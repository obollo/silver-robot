import { useState } from 'react';
import { motion } from 'framer-motion';
import { ORIGINS, STYLES } from '../data/names';

const GENDERS = [
  { value: 'boy', label: 'Boy', emoji: '💙' },
  { value: 'girl', label: 'Girl', emoji: '🩷' },
  { value: 'any', label: 'Any', emoji: '✨' },
];

const POPULARITY_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'Popular', label: 'Popular' },
  { value: 'Uncommon', label: 'Uncommon' },
  { value: 'Rare', label: 'Rare' },
];

const LENGTH_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'short', label: 'Short', hint: '≤4 letters' },
  { value: 'medium', label: 'Medium', hint: '5–7 letters' },
  { value: 'long', label: 'Long', hint: '8+ letters' },
];

export default function SetupScreen({ onStart }) {
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
    <div className="flex flex-col min-h-dvh">
      {/* Header */}
      <div className="px-5 pt-10 pb-4 text-center">
        <div className="text-5xl mb-2">👶</div>
        <h1 className="text-3xl font-bold text-gray-800 leading-tight">
          Baby Name Swipe
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Find the perfect name together</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-5 pb-6 overflow-y-auto space-y-6">

        {/* Gender */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Gender
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {GENDERS.map(({ value, label, emoji }) => (
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
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Style / Vibe */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Style / Vibe
            {selectedStyles.length > 0 && (
              <span className="ml-2 text-violet-500 normal-case font-normal text-xs">
                {selectedStyles.length} selected
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
                {style}
              </button>
            ))}
          </div>
          {selectedStyles.length === 0 && (
            <p className="text-xs text-gray-400 mt-2">Leave empty to show all styles</p>
          )}
        </section>

        {/* Origin */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Origin
            {selectedOrigins.length > 0 && (
              <span className="ml-2 text-violet-500 normal-case font-normal text-xs">
                {selectedOrigins.length} selected
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
                {origin}
              </button>
            ))}
          </div>
        </section>

        {/* Popularity */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Popularity
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {POPULARITY_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setPopularity(value)}
                className={`py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                  popularity === value
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Length */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Name Length
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {LENGTH_OPTIONS.map(({ value, label, hint }) => (
              <button
                key={value}
                onClick={() => setLength(value)}
                className={`py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                  length === value
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                {label}
                {hint && <span className="block text-xs font-normal opacity-60">{hint}</span>}
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
          Start Swiping →
        </motion.button>
      </div>
    </div>
  );
}
