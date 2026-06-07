import React, { useState, useMemo } from 'react';
import type { Trophy } from '../types';

interface CabinetViewProps {
  trophies: Trophy[];
}

type CategoryType = 'all' | 'club' | 'national' | 'individual';

export const CabinetView: React.FC<CabinetViewProps> = ({ trophies }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');

  const filteredTrophies = useMemo(() => {
    if (activeCategory === 'all') return trophies;
    return trophies.filter(t => t.category === activeCategory);
  }, [activeCategory, trophies]);

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
        <button className="glass-panel" style={{ ...styles.pill, ...categoryStyle('all') }} onClick={() => setActiveCategory('all')}>TODOS</button>
        <button className="glass-panel" style={{ ...styles.pill, ...categoryStyle('club') }} onClick={() => setActiveCategory('club')}>CLUBES</button>
        <button className="glass-panel" style={{ ...styles.pill, ...categoryStyle('national') }} onClick={() => setActiveCategory('national')}>SELECCIÓN</button>
        <button className="glass-panel" style={{ ...styles.pill, ...categoryStyle('individual') }} onClick={() => setActiveCategory('individual')}>INDIVIDUAL</button>
      </div>

      {/* Trophy Grid */}
      <div style={styles.trophyGrid}>
        {filteredTrophies.map((trophy) => (
          <div key={trophy.id} className="glass-panel" style={styles.trophyCard}>
            {/* Trophy Icon Shape */}
            <div style={styles.iconContainer}>
              <div 
                style={{ 
                  ...styles.trophySilhouette, 
                  background: trophy.category === 'individual' ? 'var(--accent-gold)' : 
                              trophy.category === 'national' ? 'var(--accent-albiceleste)' : 'var(--text-muted)'
                }}
              >
                {/* Silhouette emoji/SVG representation */}
                {trophy.category === 'individual' ? '🏆' : trophy.id === 'worldcup' ? '👑' : '🏆'}
              </div>
              <div style={styles.countBadge}>{trophy.count}x</div>
            </div>

            {/* Accolade Name */}
            <h3 style={styles.trophyTitle}>{trophy.title}</h3>
            <p style={styles.trophyTeam}>{trophy.team}</p>
            <p style={styles.trophyDesc}>{trophy.description}</p>
            
            {/* Years Won */}
            <div style={styles.yearsGrid}>
              {trophy.years.map((year, idx) => (
                <span key={idx} style={styles.yearTag}>{year}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  pillsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '20px'
  },
  pill: {
    padding: '8px 12px',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    background: 'rgba(24, 32, 56, 0.2)',
    color: 'var(--text-muted)',
    fontSize: '10px',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  activeCategoryPill: {
    borderColor: 'var(--accent-gold)',
    color: 'var(--text-high-contrast)',
    background: 'rgba(212, 175, 55, 0.1)'
  },
  trophyGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    marginTop: '8px'
  },
  trophyCard: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
    overflow: 'hidden'
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: '12px'
  },
  trophySilhouette: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
  },
  countBadge: {
    fontFamily: 'var(--font-display)',
    fontSize: '16px',
    fontWeight: 800,
    color: 'var(--accent-gold)',
    background: 'rgba(212, 175, 55, 0.1)',
    border: '1px solid var(--accent-gold)',
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
    marginBottom: '14px'
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
  }
};
