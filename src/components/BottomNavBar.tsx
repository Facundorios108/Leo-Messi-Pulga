import React from 'react';

interface BottomNavBarProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab, setTab }) => {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${currentTab === 'home' ? 'active' : ''}`}
        onClick={() => setTab('home')}
        aria-label="Home"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>HOME</span>
      </button>

      <button 
        className={`nav-item ${currentTab === 'stats' ? 'active' : ''}`}
        onClick={() => setTab('stats')}
        aria-label="Estadísticas"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        <span>STATS</span>
      </button>

      <button 
        className={`nav-item ${currentTab === 'timeline' ? 'active' : ''}`}
        onClick={() => setTab('timeline')}
        aria-label="Línea de Tiempo"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>TIMELINE</span>
      </button>

      <button 
        className={`nav-item ${currentTab === 'cabinet' ? 'active' : ''}`}
        onClick={() => setTab('cabinet')}
        aria-label="Vitrina de Trofeos"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
          <path d="M12 2a4 4 0 0 0-4 4v7a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z" />
        </svg>
        <span>CABINET</span>
      </button>

      <button 
        className={`nav-item ${currentTab === 'game' ? 'active' : ''}`}
        onClick={() => setTab('game')}
        aria-label="Juego Trivia"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M6 12h4M10 8v8" />
          <rect x="2" y="6" width="20" height="12" rx="3" />
          <circle cx="17" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="13" r="1" fill="currentColor" />
        </svg>
        <span>GAME</span>
      </button>
    </nav>
  );
};
