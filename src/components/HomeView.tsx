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
        <div style={styles.avatarContainer}>
          <img 
            src={profile.imageUrl} 
            alt={profile.name} 
            style={styles.avatar}
            className="profile-hero-avatar"
          />
        </div>
        <div style={styles.profileInfo}>
          <p className="label-caps" style={{ color: 'var(--accent-gold)' }}>THE GOAT ARCHIVE</p>
          <h1 className="hero-title" style={{ margin: '4px 0 2px 0' }}>{profile.name}</h1>
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
    gap: '20px',
    marginBottom: '24px',
    marginTop: '12px'
  },
  avatarContainer: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    padding: '2px',
    background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-albiceleste))',
    boxShadow: '0 0 16px rgba(212, 175, 55, 0.2)'
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    backgroundColor: 'var(--color-slate-deep)'
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontWeight: 500
  },
  section: {
    marginBottom: '28px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginTop: '8px'
  },
  statCard: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  statNumber: {
    fontFamily: 'var(--font-display)',
    fontSize: '2rem',
    fontWeight: 700,
    marginTop: '8px',
    color: 'var(--text-high-contrast)'
  },
  bioCard: {
    padding: '16px 20px',
    marginBottom: '28px',
    fontSize: '14px',
    lineHeight: '1.6',
    borderLeft: '4px solid var(--accent-albiceleste)'
  },
  bioRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
  },
  bioLabel: {
    fontWeight: 600,
    color: 'var(--text-muted)'
  },
  recordsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  recordItem: {
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  recordBadge: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'var(--accent-gold-glow)',
    border: '1px solid var(--accent-gold)',
    color: 'var(--accent-gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 700,
    fontFamily: 'var(--font-display)'
  },
  recordText: {
    fontSize: '13.5px',
    fontWeight: 500,
    color: 'var(--text-body)',
    flex: 1
  }
};
