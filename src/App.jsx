import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SetupScreen from './components/SetupScreen';
import SwipeScreen from './components/SwipeScreen';
import ResultsScreen from './components/ResultsScreen';
import { filterNames } from './data/names';
import './index.css';

const SCREENS = { setup: 'setup', swipe: 'swipe', results: 'results' };
const SCREEN_ORDER = { setup: 0, swipe: 1, results: 2 };

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App() {
  const [screen, setScreen] = useState(SCREENS.setup);
  const [prevScreen, setPrevScreen] = useState(SCREENS.setup);
  const [filters, setFilters] = useState(null);
  const [likedNames, setLikedNames] = useState([]);

  const direction = SCREEN_ORDER[screen] >= SCREEN_ORDER[prevScreen] ? 1 : -1;

  const filteredNames = useMemo(() => {
    if (!filters) return [];
    return shuffle(filterNames(filters));
  }, [filters]);

  const navigateTo = (next) => {
    setPrevScreen(screen);
    setScreen(next);
  };

  const handleStart = (newFilters) => {
    setFilters(newFilters);
    setLikedNames([]);
    navigateTo(SCREENS.swipe);
  };

  const handleSwipeComplete = (liked) => {
    setLikedNames(liked);
    navigateTo(SCREENS.results);
  };

  // Slide only — never start at opacity 0 so content is always visible even
  // if the animation engine delays firing on first mount.
  const enter = { x: direction > 0 ? '100%' : '-100%' };
  const center = { x: 0 };
  const exitTo = { x: direction > 0 ? '-100%' : '100%' };

  return (
    <div className="max-w-md mx-auto h-screen relative overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {screen === SCREENS.setup && (
          <motion.div
            key="setup"
            initial={enter}
            animate={center}
            exit={exitTo}
            transition={{ type: 'tween', duration: 0.28 }}
            className="absolute inset-0 overflow-y-auto"
          >
            <SetupScreen onStart={handleStart} />
          </motion.div>
        )}

        {screen === SCREENS.swipe && (
          <motion.div
            key="swipe"
            initial={enter}
            animate={center}
            exit={exitTo}
            transition={{ type: 'tween', duration: 0.28 }}
            className="absolute inset-0"
          >
            {filteredNames.length === 0 ? (
              <NoNamesState onBack={() => navigateTo(SCREENS.setup)} />
            ) : (
              <SwipeScreen
                names={filteredNames}
                onComplete={handleSwipeComplete}
                onBack={() => navigateTo(SCREENS.setup)}
              />
            )}
          </motion.div>
        )}

        {screen === SCREENS.results && (
          <motion.div
            key="results"
            initial={enter}
            animate={center}
            exit={exitTo}
            transition={{ type: 'tween', duration: 0.28 }}
            className="absolute inset-0 overflow-y-auto"
          >
            <ResultsScreen
              likedNames={likedNames}
              onBack={() => navigateTo(SCREENS.swipe)}
              onRestart={() => navigateTo(SCREENS.setup)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NoNamesState({ onBack }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-8 text-center">
      <div className="text-5xl mb-4">🔍</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">No names found</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Your filters are too specific. Try removing some filters to see more names.
      </p>
      <button
        onClick={onBack}
        className="px-8 py-3 rounded-2xl bg-violet-500 text-white font-semibold"
      >
        Adjust Filters
      </button>
    </div>
  );
}
