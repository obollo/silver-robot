import { useState, useMemo, Component } from 'react';
import SetupScreen from './components/SetupScreen';
import SwipeScreen from './components/SwipeScreen';
import ResultsScreen from './components/ResultsScreen';
import { filterNames } from './data/names';
import './index.css';

const SCREENS = { setup: 'setup', swipe: 'swipe', results: 'results' };

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'monospace', fontSize: 14 }}>
          <h2 style={{ color: '#b91c1c' }}>App crashed</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>
            {String(this.state.error?.stack || this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppInner() {
  const [screen, setScreen] = useState(SCREENS.setup);
  const [filters, setFilters] = useState(null);
  const [likedNames, setLikedNames] = useState([]);

  const filteredNames = useMemo(() => {
    if (!filters) return [];
    return shuffle(filterNames(filters));
  }, [filters]);

  const handleStart = (newFilters) => {
    setFilters(newFilters);
    setLikedNames([]);
    setScreen(SCREENS.swipe);
  };

  const handleSwipeComplete = (liked) => {
    setLikedNames(liked);
    setScreen(SCREENS.results);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen relative">
      {screen === SCREENS.setup && <SetupScreen onStart={handleStart} />}
      {screen === SCREENS.swipe && (
        filteredNames.length === 0 ? (
          <NoNamesState onBack={() => setScreen(SCREENS.setup)} />
        ) : (
          <SwipeScreen
            names={filteredNames}
            onComplete={handleSwipeComplete}
            onBack={() => setScreen(SCREENS.setup)}
          />
        )
      )}
      {screen === SCREENS.results && (
        <ResultsScreen
          likedNames={likedNames}
          onBack={() => setScreen(SCREENS.swipe)}
          onRestart={() => setScreen(SCREENS.setup)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}

function NoNamesState({ onBack }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
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
