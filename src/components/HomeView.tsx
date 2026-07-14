import React from 'react';
import type { PlayerProfile, CareerTotals } from '../types';

interface HomeViewProps {
  profile: PlayerProfile | null;
  totals: CareerTotals | null;
  records: string[];
}

export const HomeView: React.FC<HomeViewProps> = ({ profile, totals, records }) => {
  if (!profile || !totals) {
    return (
      <div className="skeleton-loader" style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-slate-light)', margin: '0 auto 16px auto', animation: 'pulse 1.5s infinite' }}></div>
        <div style={{ height: '20px', width: '150px', background: 'var(--color-slate-light)', margin: '0 auto 8px auto' }}></div>
        <div style={{ height: '14px', width: '250px', background: 'var(--color-slate-light)', margin: '0 auto' }}></div>
      </div>
    );
  }

  return (
    <div className="screen-content animated-fade-in">
      {/* Profile Header */}
      <header style={styles.header}>
        <div className="profile-avatar-container">
          <img 
            src={profile.imageUrl} 
            alt={profile.name} 
            className="profile-hero-avatar"
          />
        </div>
        <div style={styles.profileInfo}>
          <p className="label-caps" style={{ color: 'var(--accent-gold)' }}>THE GOAT ARCHIVE</p>
          <h1 className="hero-title" style={{ margin: '8px 0 4px 0' }}>{profile.name}</h1>
          <p style={styles.subtitle}>{profile.fullName} | {profile.currentTeam}</p>
        </div>
      </header>

      {/* Career Snapshot */}
      <section style={styles.section}>
        <h2 className="section-title" style={{ fontSize: '1.4rem' }}>RESUMEN DE CARRERA</h2>
        <div style={styles.statsGrid}>
          <div className="glass-panel" style={styles.statCard}>
            <p className="label-caps">PARTIDOS</p>
            <h3 style={styles.statNumber}>{totals.appearances}</h3>
          </div>
          <div className="glass-panel" style={styles.statCard}>
            <p className="label-caps" style={{ color: 'var(--accent-gold)' }}>GOLES</p>
            <h3 style={{ ...styles.statNumber, color: 'var(--accent-gold)' }}>{totals.goals}</h3>
          </div>
          <div className="glass-panel" style={styles.statCard}>
            <p className="label-caps" style={{ color: 'var(--accent-albiceleste)' }}>ASISTENCIAS</p>
            <h3 style={{ ...styles.statNumber, color: 'var(--accent-albiceleste)' }}>{totals.assists}</h3>
          </div>
          <div className="glass-panel" style={styles.statCard}>
            <p className="label-caps" style={{ color: 'var(--accent-miami-pink)' }}>TÍTULOS</p>
            <h3 style={{ ...styles.statNumber, color: 'var(--accent-miami-pink)' }}>{totals.titles}</h3>
          </div>
        </div>
      </section>

      {/* Biography & Quick Details */}
      <section className="glass-panel" style={styles.bioCard}>
        <div style={styles.bioRow}>
          <span style={styles.bioLabel}>Nacimiento:</span>
          <span>{profile.birthDate} ({profile.birthPlace})</span>
        </div>
        <div style={styles.bioRow}>
          <span style={styles.bioLabel}>Altura:</span>
          <span>{profile.height}</span>
        </div>
        <div style={styles.bioRow}>
          <span style={styles.bioLabel}>Posiciones:</span>
          <span>{profile.positions.join(', ')}</span>
        </div>
      </section>

      {/* Key Records Highlights */}
      <section style={styles.section}>
        <h2 className="section-title" style={{ fontSize: '1.4rem' }}>HÍTOS DESTACADOS</h2>
        <div style={styles.recordsList}>
          {records.slice(0, 5).map((record, index) => (
            <div key={index} className="glass-panel" style={styles.recordItem}>
              <div style={styles.recordBadge}>{index + 1}</div>
              <p style={styles.recordText}>{record}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '32px',
    marginTop: '16px'
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  subtitle: {
    fontSize: '13.5px',
    color: 'var(--text-muted)',
    fontWeight: 500,
    marginTop: '2px'
  },
  section: {
    marginBottom: '36px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginTop: '12px'
  },
  statCard: {
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  statNumber: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.2rem',
    fontWeight: 700,
    marginTop: '8px',
    color: 'var(--text-high-contrast)'
  },
  bioCard: {
    padding: '20px 24px',
    marginBottom: '36px',
    fontSize: '14.5px',
    lineHeight: '1.65',
    borderLeft: '4px solid var(--accent-albiceleste)'
  },
  bioRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
  },
  bioLabel: {
    fontWeight: 600,
    color: 'var(--text-muted)'
  },
  recordsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  recordItem: {
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  recordBadge: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: 'var(--accent-gold-glow)',
    border: '1px solid var(--accent-gold)',
    color: 'var(--accent-gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    flexShrink: 0
  },
  recordText: {
    fontSize: '13.5px',
    fontWeight: 500,
    color: 'var(--text-body)',
    flex: 1
  },
  carouselContainer: {
    height: '240px',
    borderRadius: '16px',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: '28px',
    boxShadow: 'var(--glass-shadow)',
    border: '1px solid var(--glass-border)',
    background: 'rgba(0, 0, 0, 0.4)'
  },
  slide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    transition: 'opacity 0.8s ease-in-out, transform 4.5s ease-out',
    overflow: 'hidden'
  },
  slideBlurBg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    filter: 'blur(20px) brightness(0.35)',
    transform: 'scale(1.15)'
  },
  slideImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2
  },
  slideImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to top, rgba(5, 7, 12, 0.95) 15%, rgba(5, 7, 12, 0.25) 50%, transparent 100%)',
    zIndex: 3
  },
  slideTextContainer: {
    position: 'relative',
    zIndex: 4,
    padding: '16px 20px',
    color: 'var(--text-high-contrast)',
    width: '100%',
    boxSizing: 'border-box'
  },
  slideTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.3rem',
    fontWeight: 700,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
    marginBottom: '4px'
  },
  slideDesc: {
    fontSize: '12px',
    color: 'var(--text-body)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
  },
  arrowBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(14, 19, 34, 0.6)',
    border: '1px solid var(--glass-border)',
    color: '#fff',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 5,
    fontSize: '18px',
    transition: 'background 0.2s ease',
    outline: 'none'
  },
  indicators: {
    position: 'absolute',
    bottom: '12px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '6px',
    zIndex: 5
  },
  indicatorDot: {
    height: '6px',
    borderRadius: '3px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
};
