import { useState, useEffect, lazy, Suspense } from 'react';
import type { PlayerProfile, Trophy, Milestone, RecordItem, TriviaQuestion, SeasonStats, CareerTotalsContainer, VideoItem } from './types';
import { doc, collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeView } from './components/HomeView';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

const StatsView = lazy(() => import('./components/StatsView').then(m => ({ default: m.StatsView })));
const TimelineView = lazy(() => import('./components/TimelineView').then(m => ({ default: m.TimelineView })));
const CabinetView = lazy(() => import('./components/CabinetView').then(m => ({ default: m.CabinetView })));
const GameView = lazy(() => import('./components/GameView').then(m => ({ default: m.GameView })));
const VideosView = lazy(() => import('./components/VideosView').then(m => ({ default: m.VideosView })));
const VersusView = lazy(() => import('./components/VersusView').then(m => ({ default: m.VersusView })));

function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [totals, setTotals] = useState<CareerTotalsContainer | null>(null);
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [trivia, setTrivia] = useState<TriviaQuestion[]>([]);
  const [seasons, setSeasons] = useState<SeasonStats[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Set up real-time database listener connections
  useEffect(() => {
    // 1. Sync Profile Document
    const unsubProfile = onSnapshot(doc(db, "player", "profile"), (snap) => {
      if (snap.exists()) {
        setProfile(snap.data() as PlayerProfile);
      }
    }, (err) => console.error("Real-time profile sync failed: ", err));

    // 2. Sync Career Totals Document
    const unsubTotals = onSnapshot(doc(db, "player", "totals"), (snap) => {
      if (snap.exists()) {
        setTotals(snap.data() as CareerTotalsContainer);
        setLoading(false);
      }
    }, (err) => console.error("Real-time totals sync failed: ", err));

    // 3. Sync Trophies Collection
    const unsubTrophies = onSnapshot(collection(db, "trophies"), (snap) => {
      if (!snap.empty) {
        setTrophies(snap.docs.map(doc => doc.data() as Trophy));
      }
    }, (err) => console.error("Real-time trophies sync failed: ", err));

    // 4. Sync Milestones Collection
    const unsubMilestones = onSnapshot(collection(db, "milestones"), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map(doc => doc.data() as Milestone);
        setMilestones(list.sort((a, b) => a.year - b.year));
      }
    }, (err) => console.error("Real-time milestones sync failed: ", err));

    // 5. Sync Records Collection
    const unsubRecords = onSnapshot(collection(db, "records"), (snap) => {
      if (!snap.empty) {
        setRecords(snap.docs.map(doc => doc.data() as RecordItem));
      }
    }, (err) => console.error("Real-time records sync failed: ", err));

    // 6. Sync Trivia Collection
    const unsubTrivia = onSnapshot(collection(db, "trivia"), (snap) => {
      if (!snap.empty) {
        setTrivia(snap.docs.map(doc => doc.data() as TriviaQuestion));
      }
    }, (err) => console.error("Real-time trivia sync failed: ", err));

    // 7. Sync Seasons Stats Collection
    const unsubSeasons = onSnapshot(collection(db, "seasons"), (snap) => {
      if (!snap.empty) {
        setSeasons(snap.docs.map(doc => doc.data() as SeasonStats));
      }
    }, (err) => console.error("Real-time seasons sync failed: ", err));

    // 8. Sync Videos Collection
    const unsubVideos = onSnapshot(collection(db, "videos"), (snap) => {
      if (!snap.empty) {
        setVideos(snap.docs.map(doc => doc.data() as VideoItem));
      }
    }, (err) => console.error("Real-time videos sync failed: ", err));

    return () => {
      unsubProfile();
      unsubTotals();
      unsubTrophies();
      unsubMilestones();
      unsubRecords();
      unsubTrivia();
      unsubSeasons();
      unsubVideos();
    };
  }, []);

  const [activeTheme, setActiveTheme] = useState<string>('global');

  // Contextual theme accent swapper on tab change
  const handleTabChange = (tab: string) => {
    const nextTheme = tab === 'timeline' ? 'argentina' : tab === 'versus' ? 'cr7' : tab === 'stats' ? activeTheme : 'global';
    const updateStates = () => {
      setCurrentTab(tab);
      setActiveTheme(nextTheme);
    };

    if ('startViewTransition' in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(updateStates);
    } else {
      updateStates();
    }
  };

  // Render the selected view
  const renderView = () => {
    switch (currentTab) {
      case 'stats':
        return <StatsView seasons={seasons} totals={totals} setTheme={setActiveTheme} trophies={trophies} />;
      case 'timeline':
        return <TimelineView milestones={milestones} />;
      case 'cabinet':
        return <CabinetView trophies={trophies} />;
      case 'game':
        return <GameView questions={trivia} />;
      case 'videos':
        return <VideosView videos={videos} />;
      case 'versus':
        return <VersusView totals={totals} setTheme={setActiveTheme} />;
      case 'home':
      default:
        return (
          <HomeView 
            profile={profile} 
            totals={totals ? totals.career : null} 
            records={records.map(r => {
              if (r.id === 'r5' || r.title === 'Títulos Totales') {
                const count = totals ? totals.career.titles : 48;
                return `${r.title}: ${count} títulos mayores`;
              }
              return `${r.title}: ${r.value}`;
            })} 
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
    <div className={`app-container theme-${activeTheme}`}>
      {/* PWA custom install prompt banner */}
      <PWAInstallPrompt />

      {/* Top Application Bar */}
      <header className="app-header">
        <div className="app-logo">
          LEO MESSI <span>PULGA</span>
        </div>
        <div className="header-badge">GOAT</div>
      </header>

      {/* Main Screen Shell */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Suspense fallback={
          <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="skeleton-loader" style={{ textAlign: 'center' }}>
              <div className="outer-loader" style={styles.spinner}></div>
              <p style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', color: 'var(--theme-accent)', fontSize: '1rem', letterSpacing: '0.05em' }}>
                CARGANDO VISTA...
              </p>
            </div>
          </div>
        }>
          {renderView()}
        </Suspense>
      </main>

      {/* Navigation */}
      <BottomNavBar currentTab={currentTab} setTab={handleTabChange} />
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
  }
};

export default App;
