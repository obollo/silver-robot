import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NameCard from './NameCard';

export default function SwipeScreen({ names, onComplete, onBack }) {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState([]);
  const [lastAction, setLastAction] = useState(null);

  const remaining = names.length - index;
  const progress = index / names.length;

  const handleLike = () => {
    setLiked((prev) => [...prev, names[index]]);
    setLastAction('like');
    setIndex((i) => i + 1);
  };

  const handleDislike = () => {
    setLastAction('dislike');
    setIndex((i) => i + 1);
  };

  if (index >= names.length) {
    return (
      <DoneScreen
        liked={liked}
        total={names.length}
        onViewResults={() => onComplete(liked)}
        onRestart={onBack}
      />
    );
  }

  const currentName = names[index];
  const nextName = names[index + 1];

  return (
    <div className="flex flex-col h-dvh">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-8 pb-2">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-gray-400"
        >
          ←
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400 font-medium">
            {remaining} names left
          </span>
          <div className="mt-1 w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-400 to-pink-400 rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1 bg-white shadow rounded-full px-3 py-1">
          <span className="text-base">❤️</span>
          <span className="font-bold text-gray-700 text-sm">{liked.length}</span>
        </div>
      </div>

      {/* Card stack */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Ghost card behind */}
        {nextName && (
          <div className="absolute w-full px-4 scale-95 opacity-50 pointer-events-none" style={{ top: 12 }}>
            <div className="mx-0 rounded-3xl bg-white h-24" />
          </div>
        )}

        {/* Current card */}
        <div className="w-full relative" style={{ height: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              <NameCard
                name={currentName}
                onLike={handleLike}
                onDislike={handleDislike}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-8 pb-10 pt-4 flex items-center justify-center gap-6">
        {/* Dislike */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={handleDislike}
          className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl border-2 border-gray-100"
        >
          ✕
        </motion.button>

        {/* Like */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={handleLike}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-200 flex items-center justify-center text-3xl"
        >
          ❤️
        </motion.button>

        {/* Skip to results */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => onComplete(liked)}
          className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-xl border-2 border-gray-100"
          title="View results"
        >
          📋
        </motion.button>
      </div>

      {/* Last action feedback */}
      <AnimatePresence>
        {lastAction && (
          <motion.div
            key={lastAction + index}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <span className="text-2xl">
              {lastAction === 'like' ? '❤️' : '👋'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DoneScreen({ liked, total, onViewResults, onRestart }) {
  return (
    <div className="flex flex-col items-center justify-center h-dvh px-6 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">All done!</h2>
      <p className="text-gray-500 mb-2">
        You swiped through <span className="font-semibold text-gray-700">{total}</span> names
      </p>
      <p className="text-gray-500 mb-8">
        and liked <span className="font-semibold text-violet-600 text-xl">{liked.length}</span>
      </p>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onViewResults}
        className="w-full max-w-xs py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold text-lg shadow-lg shadow-violet-200 mb-3"
      >
        View My Picks
      </motion.button>
      <button
        onClick={onRestart}
        className="text-gray-400 text-sm underline underline-offset-2"
      >
        Start over
      </button>
    </div>
  );
}
