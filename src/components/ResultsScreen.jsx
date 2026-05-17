import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { encodeNames, decodeNames } from '../data/names';
import names from '../data/names';
import { useLanguage } from '../i18n/LanguageContext';

export default function ResultsScreen({ likedNames, onBack, onRestart }) {
  const { t } = useLanguage();
  const [view, setView] = useState('mine');
  const [partnerCode, setPartnerCode] = useState('');
  const [matches, setMatches] = useState(null);
  const [codeError, setCodeError] = useState('');
  const [copied, setCopied] = useState(false);

  const myCode = encodeNames(likedNames.map((n) => n.id));

  const handleCopyCode = () => {
    navigator.clipboard.writeText(myCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCompare = () => {
    setCodeError('');
    const partnerIds = decodeNames(partnerCode.trim());
    if (!partnerIds) {
      setCodeError(t('results.invalidCode'));
      return;
    }
    const myIds = new Set(likedNames.map((n) => n.id));
    const matched = names.filter((n) => partnerIds.includes(n.id) && myIds.has(n.id));
    setMatches(matched);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="px-5 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-gray-400"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-gray-800">{t('results.title')}</h1>
        </div>

        {/* Tab bar */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setView('mine')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              view === 'mine' ? 'bg-white shadow text-gray-800' : 'text-gray-400'
            }`}
          >
            {t('results.myLikes')} ({likedNames.length})
          </button>
          <button
            onClick={() => setView('match')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              view === 'match' ? 'bg-white shadow text-gray-800' : 'text-gray-400'
            }`}
          >
            {t('results.partnerMatch')} 🔗
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {view === 'mine' ? (
            <motion.div
              key="mine"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {likedNames.length === 0 ? (
                <EmptyState
                  emoji="💔"
                  message={t('results.emptyMessage')}
                  action={t('results.tryAgain')}
                  onAction={onRestart}
                />
              ) : (
                <div className="space-y-2.5">
                  {likedNames.map((n, i) => (
                    <NameListItem key={n.id} name={n} rank={i + 1} />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="match"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Step 1: Share your code */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-1">{t('results.step1Title')}</h3>
                <p className="text-xs text-gray-500 mb-3">{t('results.step1Desc')}</p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 font-mono text-xs text-gray-500 break-all">
                    {myCode.substring(0, 40)}{myCode.length > 40 ? '…' : ''}
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className={`px-4 rounded-xl text-sm font-semibold transition-all ${
                      copied
                        ? 'bg-emerald-500 text-white'
                        : 'bg-violet-500 text-white'
                    }`}
                  >
                    {copied ? '✓' : t('results.copy')}
                  </button>
                </div>
              </div>

              {/* Step 2: Enter partner's code */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-1">{t('results.step2Title')}</h3>
                <p className="text-xs text-gray-500 mb-3">{t('results.step2Desc')}</p>
                <textarea
                  value={partnerCode}
                  onChange={(e) => setPartnerCode(e.target.value)}
                  placeholder={t('results.pasteCodePlaceholder')}
                  className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-xs font-mono text-gray-700 border border-gray-200 focus:border-violet-400 focus:outline-none resize-none h-20"
                />
                {codeError && (
                  <p className="text-xs text-red-500 mt-1">{codeError}</p>
                )}
                <button
                  onClick={handleCompare}
                  disabled={!partnerCode.trim()}
                  className="mt-3 w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold text-sm disabled:opacity-40"
                >
                  {t('results.findMatches')}
                </button>
              </div>

              {/* Matches result */}
              {matches !== null && (
                <div>
                  <h3 className="font-bold text-gray-800 text-lg mb-3">
                    {matches.length === 0
                      ? t('results.noMatches')
                      : `${matches.length} ${matches.length > 1 ? t('results.matches') : t('results.match')}! 🎉`}
                  </h3>
                  {matches.length === 0 ? (
                    <p className="text-sm text-gray-500">{t('results.differentTaste')}</p>
                  ) : (
                    <div className="space-y-2.5">
                      {matches.map((n, i) => (
                        <NameListItem key={n.id} name={n} rank={i + 1} highlight />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom actions */}
      <div className="px-5 pb-8 pt-2 border-t border-gray-100 bg-white/60 backdrop-blur">
        <button
          onClick={onRestart}
          className="w-full py-3.5 rounded-2xl border-2 border-violet-300 text-violet-600 font-bold"
        >
          {t('results.changeFilters')}
        </button>
      </div>
    </div>
  );
}

function NameListItem({ name, rank, highlight }) {
  const { t } = useLanguage();
  const genderEmoji = { boy: '💙', girl: '🩷', neutral: '✨' }[name.gender];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.04 }}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 ${
        highlight
          ? 'bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-200'
          : 'bg-white shadow-sm'
      }`}
    >
      <span className="text-xl">{genderEmoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800">{name.name}</p>
        <p className="text-xs text-gray-400 truncate">{t(`origin.${name.origin}`)} · {name.meaning}</p>
      </div>
      {highlight && <span className="text-base">💕</span>}
      <span className="text-xs text-gray-300 font-mono">#{rank}</span>
    </motion.div>
  );
}

function EmptyState({ emoji, message, action, onAction }) {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-3">{emoji}</div>
      <p className="text-gray-500 mb-4">{message}</p>
      <button onClick={onAction} className="text-violet-500 font-semibold underline underline-offset-2">
        {action}
      </button>
    </div>
  );
}
