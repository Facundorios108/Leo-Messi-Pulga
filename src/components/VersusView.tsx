import React, { useState, useEffect, useMemo } from 'react';
import type { CareerTotalsContainer } from '../types';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

interface VersusViewProps {
  totals: CareerTotalsContainer | null;
  setTheme: (theme: string) => void;
}

interface Competitor {
  id: string;
  name: string;
  country: string;
  themeClass: string;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    titles: number;
    ballondor: number;
    goalsPerGame: number;
    worldCups: number;
  };
  radarAttributes: {
    goalscoring: number;
    playmaking: number;
    dribbling: number;
    setPieces: number;
    legacy: number;
  };
  headToHeadMatches?: {
    wins: number;
    goals: number;
    assists: number;
  };
}

export const VersusView: React.FC<VersusViewProps> = ({ totals, setTheme }) => {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [selectedRivalId, setSelectedRivalId] = useState<string>('ronaldo');
  const [loading, setLoading] = useState<boolean>(true);

  // Sync competitors from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "competitors"), (snap) => {
      if (!snap.empty) {
        setCompetitors(snap.docs.map(doc => doc.data() as Competitor));
      }
      setLoading(false);
    }, (err) => {
      console.error("Failed to sync competitors: ", err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const activeRival = useMemo(() => {
    return competitors.find(c => c.id === selectedRivalId) || null;
  }, [selectedRivalId, competitors]);

  // Set the dynamic theme class on mount or rival change
  useEffect(() => {
    if (activeRival) {
      const themeName = activeRival.themeClass.replace('theme-', '');
      setTheme(themeName);
    }
  }, [activeRival, setTheme]);

  // Hardcoded premium attributes for Lionel Messi's radar
  const messiRadarData = {
    goalscoring: 97,
    playmaking: 98,
    dribbling: 99,
    setPieces: 93,
    legacy: 99
  };

  const getRivalColor = () => {
    if (selectedRivalId === 'ronaldo') return '#ef4444'; // CR7 Red
    if (selectedRivalId === 'pele') return '#10b981'; // Pelé Brazilian Green
    if (selectedRivalId === 'maradona') return '#38bdf8'; // Maradona Sky Blue
    return 'var(--theme-accent)';
  };

  const renderRadarChart = () => {
    if (!activeRival) return null;
    const size = 180;
    const center = size / 2;
    const radius = 70;
    const categories = ['Goles', 'Pases', 'Regate', 'Tiros Libres', 'Trofeos'];
    const keys: ('goalscoring' | 'playmaking' | 'dribbling' | 'setPieces' | 'legacy')[] = [
      'goalscoring', 'playmaking', 'dribbling', 'setPieces', 'legacy'
    ];

    const getCoordinates = (stats: typeof messiRadarData) => {
      return keys.map((key, i) => {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const value = stats[key] / 100;
        const x = center + radius * value * Math.cos(angle);
        const y = center + radius * value * Math.sin(angle);
        return `${x},${y}`;
      }).join(' ');
    };

    const messiPoints = getCoordinates(messiRadarData);
    const opponentPoints = getCoordinates({
      goalscoring: activeRival.radarAttributes.goalscoring,
      playmaking: activeRival.radarAttributes.playmaking,
      dribbling: activeRival.radarAttributes.dribbling,
      setPieces: activeRival.radarAttributes.setPieces,
      legacy: activeRival.radarAttributes.legacy
    });

    const gridLines = [0.25, 0.5, 0.75, 1.0].map((scale) => {
      return [0, 1, 2, 3, 4].map((i) => {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const x = center + radius * scale * Math.cos(angle);
        const y = center + radius * scale * Math.sin(angle);
        return `${x},${y}`;
      }).join(' ');
    });

    return (
      <div className="glass-panel" style={styles.chartCard}>
        <span style={styles.chartTitle}>ATRIBUTOS COMPARATIVOS</span>
        <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, margin: '16px auto' }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
            {gridLines.map((points, idx) => (
              <polygon key={idx} points={points} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            ))}
            {categories.map((cat, i) => {
              const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
              const x = center + (radius + 18) * Math.cos(angle);
              const y = center + (radius + 8) * Math.sin(angle);
              return (
                <text 
                  key={i} 
                  x={x} 
                  y={y} 
                  textAnchor="middle" 
                  fill="var(--text-muted)" 
                  fontSize="8.5" 
                  fontWeight="700"
                  fontFamily="var(--font-mono)"
                >
                  {cat.toUpperCase()}
                </text>
              );
            })}
            <polygon points={messiPoints} fill="rgba(116, 172, 223, 0.2)" stroke="var(--accent-albiceleste)" strokeWidth="2" />
            <polygon points={opponentPoints} fill="rgba(255, 255, 255, 0.05)" stroke={getRivalColor()} strokeWidth="2" strokeDasharray="3" />
          </svg>
        </div>
        <div style={styles.legendRow}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, background: 'var(--accent-albiceleste)' }} />
            <span>Lionel Messi</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, background: getRivalColor() }} />
            <span>{activeRival.name}</span>
          </div>
        </div>
      </div>
    );
  };

  // Extract totals details
  const messiGoals = totals?.career.goals || 911;
  const messiAssists = totals?.career.assists || 414;
  const messiApps = totals?.career.appearances || 1156;
  const messiTitles = totals?.career.titles || 48;
  const messiBallondor = 8;
  const messiGPG = messiApps ? parseFloat((messiGoals / messiApps).toFixed(2)) : 0.79;
  const messiWorldCups = 1;
  const rivalWorldCups = activeRival?.stats.worldCups || 0;

  if (loading) {
    return (
      <div className="skeleton-loader" style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ height: '30px', width: '200px', background: 'var(--color-slate-light)', margin: '0 auto 16px auto' }}></div>
        <div style={{ height: '140px', background: 'var(--color-slate-light)', borderRadius: '16px', marginBottom: '16px' }}></div>
        <div style={{ height: '180px', background: 'var(--color-slate-light)', borderRadius: '16px' }}></div>
      </div>
    );
  }

  return (
    <div className="screen-content animated-fade-in">
      <h1 className="hero-title" style={{ marginBottom: '4px', textAlign: 'center' }}>COMPARADOR DEL GOAT</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '20px' }}>
        Compara las estadísticas históricas head-to-head.
      </p>

      {/* Select Competitor */}
      <div style={styles.selectContainer}>
        <label htmlFor="competitor-select" style={styles.selectLabel}>SELECCIONAR LEYENDA:</label>
        <div style={styles.selectWrapper}>
          <select 
            id="competitor-select"
            value={selectedRivalId}
            onChange={(e) => setSelectedRivalId(e.target.value)}
            style={{
              ...styles.selectInput,
              borderColor: getRivalColor(),
              boxShadow: `0 0 10px ${getRivalColor()}1a`
            }}
          >
            {competitors.map(c => (
              <option key={c.id} value={c.id} style={{ background: '#0e1322', color: '#fff' }}>
                {c.name.toUpperCase()} ({c.country.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeRival && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main Head-to-Head Table */}
          <section className="glass-panel" style={{
            ...styles.comparisonGridCard,
            borderColor: getRivalColor(),
            boxShadow: `0 8px 32px 0 rgba(0,0,0,0.5), 0 0 15px ${getRivalColor()}1a`
          }}>
            <div style={styles.gridHeader}>
              <div style={{ ...styles.gridHeaderCol, color: 'var(--accent-albiceleste)' }}>L. MESSI</div>
              <div style={styles.gridHeaderVs}>VS</div>
              <div style={{ ...styles.gridHeaderCol, color: getRivalColor() }}>{activeRival.name.split(' ').pop()?.toUpperCase()}</div>
            </div>

            <div style={styles.rowsContainer}>
              {/* Goals */}
              <div style={styles.statRow}>
                <div style={styles.statValCol}>
                  {messiGoals > activeRival.stats.goals && <span style={styles.crown}>👑</span>}
                  <span style={messiGoals > activeRival.stats.goals ? styles.winnerVal : styles.loserVal}>{messiGoals}</span>
                </div>
                <div style={styles.statLabelCol}>GOLES TOTALES</div>
                <div style={styles.statValCol}>
                  <span style={activeRival.stats.goals > messiGoals ? styles.winnerVal : styles.loserVal}>{activeRival.stats.goals}</span>
                  {activeRival.stats.goals > messiGoals && <span style={styles.crown}>👑</span>}
                </div>
              </div>

              {/* Assists */}
              <div style={styles.statRow}>
                <div style={styles.statValCol}>
                  {messiAssists > activeRival.stats.assists && <span style={styles.crown}>👑</span>}
                  <span style={messiAssists > activeRival.stats.assists ? styles.winnerVal : styles.loserVal}>{messiAssists}</span>
                </div>
                <div style={styles.statLabelCol}>ASISTENCIAS</div>
                <div style={styles.statValCol}>
                  <span style={activeRival.stats.assists > messiAssists ? styles.winnerVal : styles.loserVal}>{activeRival.stats.assists}</span>
                  {activeRival.stats.assists > messiAssists && <span style={styles.crown}>👑</span>}
                </div>
              </div>

              {/* Appearances */}
              <div style={styles.statRow}>
                <div style={styles.statValCol}>
                  {messiApps < activeRival.stats.appearances && <span style={styles.crown}>👑</span>}
                  <span style={messiApps < activeRival.stats.appearances ? styles.winnerVal : styles.loserVal}>{messiApps}</span>
                </div>
                <div style={styles.statLabelCol}>PARTIDOS</div>
                <div style={styles.statValCol}>
                  <span style={activeRival.stats.appearances < messiApps ? styles.winnerVal : styles.loserVal}>{activeRival.stats.appearances}</span>
                  {activeRival.stats.appearances < messiApps && <span style={styles.crown}>👑</span>}
                </div>
              </div>

              {/* GPG */}
              <div style={styles.statRow}>
                <div style={styles.statValCol}>
                  {messiGPG > activeRival.stats.goalsPerGame && <span style={styles.crown}>👑</span>}
                  <span style={messiGPG > activeRival.stats.goalsPerGame ? styles.winnerVal : styles.loserVal}>{messiGPG}</span>
                </div>
                <div style={styles.statLabelCol}>GOLES / PARTIDO</div>
                <div style={styles.statValCol}>
                  <span style={activeRival.stats.goalsPerGame > messiGPG ? styles.winnerVal : styles.loserVal}>{activeRival.stats.goalsPerGame}</span>
                  {activeRival.stats.goalsPerGame > messiGPG && <span style={styles.crown}>👑</span>}
                </div>
              </div>

              {/* Titles */}
              <div style={styles.statRow}>
                <div style={styles.statValCol}>
                  {messiTitles > activeRival.stats.titles && <span style={styles.crown}>👑</span>}
                  <span style={messiTitles > activeRival.stats.titles ? styles.winnerVal : styles.loserVal}>{messiTitles}</span>
                </div>
                <div style={styles.statLabelCol}>TÍTULOS</div>
                <div style={styles.statValCol}>
                  <span style={activeRival.stats.titles > messiTitles ? styles.winnerVal : styles.loserVal}>{activeRival.stats.titles}</span>
                  {activeRival.stats.titles > messiTitles && <span style={styles.crown}>👑</span>}
                </div>
              </div>

              {/* World Cups */}
              <div style={styles.statRow}>
                <div style={styles.statValCol}>
                  {messiWorldCups > rivalWorldCups && <span style={styles.crown}>👑</span>}
                  <span style={messiWorldCups >= rivalWorldCups ? styles.winnerVal : styles.loserVal}>{messiWorldCups}</span>
                </div>
                <div style={styles.statLabelCol}>COPAS DEL MUNDO</div>
                <div style={styles.statValCol}>
                  <span style={rivalWorldCups >= messiWorldCups ? styles.winnerVal : styles.loserVal}>{rivalWorldCups}</span>
                  {rivalWorldCups > messiWorldCups && <span style={styles.crown}>👑</span>}
                </div>
              </div>

              {/* Ballon d'Or */}
              <div style={styles.statRow}>
                <div style={styles.statValCol}>
                  {messiBallondor > activeRival.stats.ballondor && <span style={styles.crown}>👑</span>}
                  <span style={messiBallondor > activeRival.stats.ballondor ? styles.winnerVal : styles.loserVal}>{messiBallondor}</span>
                </div>
                <div style={styles.statLabelCol}>BALONES DE ORO</div>
                <div style={styles.statValCol}>
                  <span style={activeRival.stats.ballondor > messiBallondor ? styles.winnerVal : styles.loserVal}>{activeRival.stats.ballondor}</span>
                  {activeRival.stats.ballondor > messiBallondor && <span style={styles.crown}>👑</span>}
                </div>
              </div>
            </div>
          </section>

          {/* Radar attributes chart */}
          {renderRadarChart()}

          {/* Head-to-Head directly (for CR7) */}
          {activeRival.headToHeadMatches && activeRival.headToHeadMatches.wins > 0 && (
            <section className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px' }}>
              <span style={styles.chartTitle}>DUELOS DIRECTOS OFICIALES</span>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                Partidos cara a cara en clubes y selecciones
              </p>
              <div style={styles.h2hContainer}>
                <div style={styles.h2hBox}>
                  <span style={styles.h2hVal}>16</span>
                  <span style={styles.h2hSub}>Victorias Messi</span>
                </div>
                <div style={styles.h2hDivider} />
                <div style={styles.h2hBox}>
                  <span style={styles.h2hVal}>9</span>
                  <span style={styles.h2hSub}>Empates</span>
                </div>
                <div style={styles.h2hDivider} />
                <div style={styles.h2hBox}>
                  <span style={{ ...styles.h2hVal, color: getRivalColor() }}>{activeRival.headToHeadMatches.wins}</span>
                  <span style={styles.h2hSub}>Victorias Rival</span>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  selectContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '20px'
  },
  selectLabel: {
    fontSize: '9.5px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em'
  },
  selectWrapper: {
    position: 'relative',
    width: '100%'
  },
  selectInput: {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(14, 19, 34, 0.6)',
    borderRadius: '12px',
    border: '1px solid var(--glass-border)',
    color: '#fff',
    fontSize: '13.5px',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    transition: 'all 0.3s ease'
  },
  comparisonGridCard: {
    padding: '24px 16px',
    borderWidth: '1px',
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.5s ease'
  },
  gridHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    marginBottom: '16px'
  },
  gridHeaderCol: {
    fontSize: '1.2rem',
    fontWeight: 800,
    fontFamily: 'var(--font-display)',
    flex: 1,
    textAlign: 'center',
    letterSpacing: '0.05em'
  },
  gridHeaderVs: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    width: '30px',
    textAlign: 'center',
    fontWeight: 800
  },
  rowsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  statRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  statValCol: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: '4px'
  },
  statLabelCol: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9.5px',
    color: 'var(--text-muted)',
    width: '120px',
    textAlign: 'center',
    fontWeight: 700,
    letterSpacing: '0.05em'
  },
  winnerVal: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: 'var(--text-high-contrast)',
    fontFamily: 'var(--font-display)'
  },
  loserVal: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: 'var(--font-display)'
  },
  crown: {
    fontSize: '11px',
    color: 'var(--accent-gold)'
  },
  chartCard: {
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  chartTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9.5px',
    fontWeight: 700,
    color: 'var(--text-high-contrast)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '8px'
  },
  legendRow: {
    display: 'flex',
    gap: '20px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--text-muted)'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  h2hContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: '8px'
  },
  h2hBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1
  },
  h2hVal: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.35rem',
    fontWeight: 800,
    color: 'var(--accent-albiceleste)'
  },
  h2hSub: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    marginTop: '4px',
    fontWeight: 600,
    fontFamily: 'var(--font-sans)',
    textTransform: 'uppercase',
    letterSpacing: '0.02em'
  },
  h2hDivider: {
    width: '1px',
    background: 'rgba(255, 255, 255, 0.05)',
    alignSelf: 'stretch'
  }
};
