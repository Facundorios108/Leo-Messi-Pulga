import { useState, useEffect } from 'react';
import type { PlayerProfile, Trophy, Milestone, RecordItem, TriviaQuestion, SeasonStats } from './types';
import { fetchPlayerProfile, fetchCareerTotals, fetchTrophies, fetchMilestones, fetchRecords, fetchTriviaQuestions, fetchSeasonsStats } from './data/firestoreQueries';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeView } from './components/HomeView';
import { StatsView } from './components/StatsView';
import { TimelineView } from './components/TimelineView';
import { CabinetView } from './components/CabinetView';
import { GameView } from './components/GameView';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [totals, setTotals] = useState<any>(null);
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [trivia, setTrivia] = useState<TriviaQuestion[]>([]);
  const [seasons, setSeasons] = useState<SeasonStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all database records on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [profData, totData, tropData, mileData, recData, trivData, seasData] = await Promise.all([
          fetchPlayerProfile(),
          fetchCareerTotals(),
          fetchTrophies(),
          fetchMilestones(),
          fetchRecords(),
          fetchTriviaQuestions(),
          fetchSeasonsStats()
        ]);

        setProfile(profData);
        setTotals(totData);
        setTrophies(tropData);
        setMilestones(mileData);
        setRecords(recData);
        setTrivia(trivData);
        setSeasons(seasData);
      } catch (err) {
        console.error("Error loading application datasets: ", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Contextual theme accent swapper
  useEffect(() => {
    const root = document.documentElement;
    if (currentTab === 'timeline') {
      // Albiceleste theme for Argentina international timeline
      root.style.setProperty('--theme-accent', 'var(--accent-albiceleste)');
      root.style.setProperty('--theme-glow', 'var(--accent-albiceleste-glow)');
    } else if (currentTab === 'stats') {
      root.style.setProperty('--theme-accent', 'var(--accent-albiceleste)');
      root.style.setProperty('--theme-glow', 'var(--accent-albiceleste-glow)');
    } else if (currentTab === 'cabinet') {
      // Gold theme for trophy cabinet
      root.style.setProperty('--theme-accent', 'var(--accent-gold)');
      root.style.setProperty('--theme-glow', 'var(--accent-gold-glow)');
    } else if (currentTab === 'game') {
      root.style.setProperty('--theme-accent', 'var(--accent-gold)');
      root.style.setProperty('--theme-glow', 'var(--accent-gold-glow)');
    } else {
      // Default gold for home dashboard
      root.style.setProperty('--theme-accent', 'var(--accent-gold)');
      root.style.setProperty('--theme-glow', 'var(--accent-gold-glow)');
    }
  }, [currentTab]);

  // Render the selected view
  const renderView = () => {
    switch (currentTab) {
      case 'stats':
        return <StatsView seasons={seasons} totals={totals} />;
      case 'timeline':
        return <TimelineView milestones={milestones} />;
      case 'cabinet':
        return <CabinetView trophies={trophies} />;
      case 'game':
        return <GameView questions={trivia} />;
      case 'home':
      default:
        return (
          <HomeView 
            profile={profile} 
            totals={totals ? totals.career : null} 
            records={records.map(r => `${r.title}: ${r.value}`)} 
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="skeleton-loader" style={{ textAlign: 'center' }}>
          <div className="outer-loader" style={styles.spinner}></div>
          <p style={{ marginTop: '20px', fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', fontSize: '1.25rem', letterSpacing: '0.05em' }}>
            CARGANDO EL ARCHIVO...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* PWA custom install prompt banner */}
      <PWAInstallPrompt />

      {/* Top Application Bar */}
      <header className="app-header">
        <div className="app-logo">
          LEO MESSI <span>PULGA</span>
        </div>
        <div style={styles.badge}>GOAT</div>
      </header>

      {/* Main Screen Shell */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {renderView()}
      </main>

      {/* Navigation */}
      <BottomNavBar currentTab={currentTab} setTab={setCurrentTab} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid rgba(212, 175, 55, 0.1)',
    borderTop: '3px solid var(--accent-gold)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto'
  },
  badge: {
    fontFamily: 'var(--font-display)',
    fontSize: '9.5px',
    fontWeight: 800,
    background: 'var(--accent-gold-glow)',
    border: '1px solid var(--accent-gold)',
    color: 'var(--accent-gold)',
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '0.05em'
  }
};

// Add standard keyframe spin styles inline for simplicity or index.css
const styleSheet = document.styleSheets[0];
try {
  styleSheet.insertRule(`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `, styleSheet.cssRules.length);
} catch (e) {
  // Silent catch if styleSheet not fully parsed yet
}

export default App;
