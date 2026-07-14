import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Trophy } from '../types';

interface CabinetViewProps {
  trophies: Trophy[];
}

type CategoryType = 'all' | 'club' | 'national' | 'individual';

// --- Inline SVGs ---
const BallonDorIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="10" r="7" fill="url(#ballonDorGrad)" stroke="none" />
    <path d="M9 6a5 5 0 0 1 6 0" stroke="#fff" strokeWidth="1.2" opacity="0.6" />
    <path d="M7 19h10l-2-3H9l-2 3z" fill="#0f172a" stroke="currentColor" strokeWidth="1.2" />
    <defs>
      <radialGradient id="ballonDorGrad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffe680" />
        <stop offset="60%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#aa7c11" />
      </radialGradient>
    </defs>
  </svg>
);

const WorldCupIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12a2 2 0 0 1 2 2v2a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6V5a2 2 0 0 1 2-2z" fill="url(#worldCupGrad)" stroke="none" />
    <circle cx="12" cy="6" r="4" fill="rgba(116, 172, 223, 0.4)" stroke="currentColor" strokeWidth="1.2" />
    <path d="M12 13v6M8 21h8" stroke="currentColor" strokeWidth="2" />
    <defs>
      <linearGradient id="worldCupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffed00" />
        <stop offset="100%" stopColor="#d4af37" />
      </linearGradient>
    </defs>
  </svg>
);

const ChampionsLeagueIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4h14v6a7 7 0 0 1-14 0V4z" fill="url(#clGrad)" stroke="none" />
    <path d="M5 5H3v5a5 5 0 0 0 5 5h0M19 5h2v5a5 5 0 0 1-5 5h0" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 15v4M9 20h6" stroke="currentColor" strokeWidth="1.8" />
    <defs>
      <linearGradient id="clGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>
    </defs>
  </svg>
);

const CustomCupIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12v8a6 6 0 0 1-12 0V3z" fill="rgba(255,255,255,0.05)" />
    <path d="M6 7H4v2a4 4 0 0 0 4 4M18 7h2v2a4 4 0 0 1-4 4" />
    <path d="M12 17v4M9 21h6" />
  </svg>
);

export const CabinetView: React.FC<CabinetViewProps> = ({ trophies }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [selectedTrophy, setSelectedTrophy] = useState<Trophy | null>(null);

  const lastActiveElement = useRef<HTMLElement | null>(null);

  // Focus tracking and management
  useEffect(() => {
    if (selectedTrophy) {
      lastActiveElement.current = document.activeElement as HTMLElement;
      // Focus on the close button or modal container
      setTimeout(() => {
        const closeBtn = document.getElementById('modal-close-btn');
        if (closeBtn) {
          closeBtn.focus();
        }
      }, 50);
    } else {
      if (lastActiveElement.current) {
        lastActiveElement.current.focus();
        lastActiveElement.current = null;
      }
    }
  }, [selectedTrophy]);

  // Close modal on Escape key press & Trap focus inside modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedTrophy(null);
      }
      if (e.key === 'Tab' && selectedTrophy) {
        const modal = document.getElementById('trophy-detail-modal');
        if (!modal) return;
        const focusables = modal.querySelectorAll('button, [tabindex="0"]');
        if (focusables.length === 0) return;
        const first = focusables[0] as HTMLElement;
        const last = focusables[focusables.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };
    if (selectedTrophy) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTrophy]);

  const filteredTrophies = useMemo(() => {
    if (activeCategory === 'all') return trophies;
    return trophies.filter(t => t.category === activeCategory);
  }, [activeCategory, trophies]);

  const renderTrophyIcon = (id: string) => {
    if (id === 'ballondor') return <BallonDorIcon />;
    if (id === 'worldcup') return <WorldCupIcon />;
    if (id === 'ucl') return <ChampionsLeagueIcon />;
    return <CustomCupIcon />;
  };

  if (trophies.length === 0) {
    return (
      <div className="skeleton-loader" style={{ padding: '24px' }}>
        <div style={{ height: '30px', width: '150px', background: 'var(--color-slate-light)', marginBottom: '20px', margin: '0 auto' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: '150px', background: 'var(--color-slate-light)', borderRadius: '16px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  const categoryStyle = (category: CategoryType) => {
    return activeCategory === category ? styles.activeCategoryPill : {};
  };

  return (
    <div className="screen-content animated-fade-in">
      <h1 className="hero-title" style={{ marginBottom: '4px', textAlign: 'center' }}>VITRINA DE TROFEOS</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '20px' }}>
        La vitrina del jugador más laureado de la historia del fútbol.
      </p>

      {/* Category Selection */}
      <div style={styles.pillsContainer}>
        <button 
          className="glass-panel" 
          style={{ ...styles.pill, ...categoryStyle('all') }} 
          onClick={() => setActiveCategory('all')}
          aria-pressed={activeCategory === 'all'}
        >
          TODOS
        </button>
        <button 
          className="glass-panel" 
          style={{ ...styles.pill, ...categoryStyle('club') }} 
          onClick={() => setActiveCategory('club')}
          aria-pressed={activeCategory === 'club'}
        >
          CLUBES
        </button>
        <button 
          className="glass-panel" 
          style={{ ...styles.pill, ...categoryStyle('national') }} 
          onClick={() => setActiveCategory('national')}
          aria-pressed={activeCategory === 'national'}
        >
          SELECCIÓN
        </button>
        <button 
          className="glass-panel" 
          style={{ ...styles.pill, ...categoryStyle('individual') }} 
          onClick={() => setActiveCategory('individual')}
          aria-pressed={activeCategory === 'individual'}
        >
          INDIVIDUAL
        </button>
      </div>

      {/* Trophy Grid */}
      <div style={styles.trophyGrid}>
        {filteredTrophies.map((trophy) => (
          <div 
            key={trophy.id} 
            className="glass-panel" 
            style={{ ...styles.trophyCard, cursor: 'pointer' }}
            onClick={() => setSelectedTrophy(trophy)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedTrophy(trophy);
              }
            }}
            aria-haspopup="dialog"
            aria-label={`${trophy.title}, obtenido ${trophy.count} veces. Presiona Enter para ver detalles.`}
          >
            {/* Trophy Icon Shape */}
            <div style={styles.iconContainer}>
              <div 
                style={{ 
                  ...styles.trophySilhouette, 
                  background: trophy.category === 'individual' ? 'var(--accent-gold-glow)' : 
                              trophy.category === 'national' ? 'var(--accent-albiceleste-glow)' : 'rgba(255, 255, 255, 0.05)',
                  border: trophy.category === 'individual' ? '1px solid var(--accent-gold)' : 
                          trophy.category === 'national' ? '1px solid var(--accent-albiceleste)' : '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {renderTrophyIcon(trophy.id)}
              </div>
              <div style={styles.countBadge}>{trophy.count}x</div>
            </div>

            {/* Accolade Name */}
            <h3 style={styles.trophyTitle}>{trophy.title}</h3>
            <p style={styles.trophyTeam}>{trophy.team}</p>
            <p style={styles.trophyDesc}>{trophy.description}</p>
            
            {/* Years Won */}
            <div style={styles.yearsGrid}>
              {trophy.years.slice(0, 8).map((year, idx) => (
                <span key={idx} style={styles.yearTag}>{year}</span>
              ))}
              {trophy.years.length > 8 && (
                <span style={styles.yearTag}>+{trophy.years.length - 8}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Trophy Detail Modal */}
      {selectedTrophy && (
        <div 
          style={styles.modalOverlay} 
          onClick={() => setSelectedTrophy(null)}
          role="presentation"
        >
          <div 
            id="trophy-detail-modal"
            className="glass-panel animated-slide-up" 
            style={styles.modalContent} 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button 
              id="modal-close-btn"
              style={styles.closeButton} 
              onClick={() => setSelectedTrophy(null)} 
              aria-label="Cerrar detalles de trofeo"
            >
              &times;
            </button>
            <div style={styles.modalHeader}>
              <div 
                style={{ 
                  ...styles.modalTrophyIcon, 
                  background: selectedTrophy.category === 'individual' ? 'var(--accent-gold-glow)' : 
                              selectedTrophy.category === 'national' ? 'var(--accent-albiceleste-glow)' : 'rgba(255, 255, 255, 0.04)',
                  border: selectedTrophy.category === 'individual' ? '1px solid var(--accent-gold)' : 
                          selectedTrophy.category === 'national' ? '1px solid var(--accent-albiceleste)' : '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {renderTrophyIcon(selectedTrophy.id)}
              </div>
              <div style={styles.modalHeaderTextContainer}>
                <h2 id="modal-title" style={styles.modalTitle}>{selectedTrophy.title}</h2>
                <p style={styles.modalTeam}>{selectedTrophy.team}</p>
              </div>
            </div>

            <p style={styles.modalDesc}>{selectedTrophy.description}</p>
            
            <div style={styles.modalSection}>
              <h4 style={styles.modalSectionTitle}>Años Ganados ({selectedTrophy.count}x)</h4>
              <div style={styles.modalYearsGrid}>
                {selectedTrophy.years.map((year, idx) => (
                  <span key={idx} style={styles.modalYearTag}>{year}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  pillsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  pill: {
    padding: '10px 16px',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    background: 'rgba(24, 32, 56, 0.2)',
    color: 'var(--text-muted)',
    fontSize: '11px',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  activeCategoryPill: {
    borderColor: 'var(--theme-accent)',
    color: 'var(--text-high-contrast)',
    background: 'var(--theme-glow)'
  },
  trophyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    marginTop: '8px'
  },
  trophyCard: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    minHeight: '220px'
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: '12px'
  },
  trophySilhouette: {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
  },
  countBadge: {
    fontFamily: 'var(--font-display)',
    fontSize: '16px',
    fontWeight: 800,
    color: 'var(--theme-accent)',
    background: 'var(--theme-glow)',
    border: '1px solid var(--theme-accent)',
    borderRadius: '6px',
    padding: '2px 8px'
  },
  trophyTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text-high-contrast)',
    marginBottom: '4px'
  },
  trophyTeam: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '10px'
  },
  trophyDesc: {
    fontSize: '12.5px',
    lineHeight: '1.5',
    color: 'var(--text-body)',
    marginBottom: '14px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  yearsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: 'auto'
  },
  yearTag: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9.5px',
    fontWeight: 700,
    color: 'var(--text-high-contrast)',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '4px',
    padding: '2px 6px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 7, 12, 0.85)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalContent: {
    width: '100%',
    maxWidth: '460px',
    backgroundColor: 'var(--color-slate-deep)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.8), 0 0 24px var(--theme-glow)',
    borderRadius: '20px',
    padding: '24px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    color: 'var(--text-high-contrast)',
    fontSize: '20px',
    cursor: 'pointer',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    padding: 0
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginRight: '24px'
  },
  modalTrophyIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    flexShrink: 0
  },
  modalHeaderTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-high-contrast)'
  },
  modalTeam: {
    fontSize: '11px',
    color: 'var(--theme-accent)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  modalDesc: {
    fontSize: '13.5px',
    lineHeight: '1.6',
    color: 'var(--text-body)'
  },
  modalSection: {
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '14px',
    marginTop: '4px'
  },
  modalSectionTitle: {
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text-high-contrast)',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  modalYearsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  modalYearTag: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10.5px',
    fontWeight: 700,
    color: 'var(--color-space-black)',
    background: 'var(--theme-accent)',
    borderRadius: '6px',
    padding: '3px 8px'
  }
};
