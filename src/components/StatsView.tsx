import React, { useState, useMemo, useEffect } from 'react';
import type { SeasonStats, CareerTotals, Trophy, DetailedStats } from '../types';
import * as rawData from '../data/messiRawData';

interface StatsViewProps {
  seasons: SeasonStats[];
  totals: {
    career: CareerTotals;
    clubs: typeof rawData.clubTotals;
    internationalBreakdown: typeof rawData.internationalStatsBreakdown;
    internationalYearly: typeof rawData.internationalYearlyStats;
    detailed?: DetailedStats;
  } | null;
  setTheme: (theme: string) => void;
  trophies: Trophy[];
}

type FilterType = 'all' | 'barca' | 'psg' | 'miami' | 'argentina';

export const StatsView: React.FC<StatsViewProps> = ({ seasons, totals, setTheme, trophies }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [hoveredColIdx, setHoveredColIdx] = useState<number | null>(null);

  // Sync theme with active filter selection
  useEffect(() => {
    setTheme(filter);
  }, [filter, setTheme]);

  // Dynamically calculate stats based on filter
  const filteredData = useMemo(() => {
    if (!totals) {
      return { appearances: 0, goals: 0, assists: 0, label: 'Cargando...' };
    }

    switch (filter) {
      case 'barca':
        return {
          appearances: totals.clubs['FC Barcelona'].appearances,
          goals: totals.clubs['FC Barcelona'].goals,
          assists: totals.clubs['FC Barcelona'].assists,
          label: 'FC Barcelona'
        };
      case 'psg':
        return {
          appearances: totals.clubs['Paris Saint-Germain'].appearances,
          goals: totals.clubs['Paris Saint-Germain'].goals,
          assists: totals.clubs['Paris Saint-Germain'].assists,
          label: 'Paris Saint-Germain'
        };
      case 'miami':
        return {
          appearances: totals.clubs['Inter Miami CF'].appearances,
          goals: totals.clubs['Inter Miami CF'].goals,
          assists: totals.clubs['Inter Miami CF'].assists,
          label: 'Inter Miami CF'
        };
      case 'argentina':
        return {
          appearances: totals.internationalBreakdown['FIFA World Cup'].appearances +
                       totals.internationalBreakdown['Copa América'].appearances +
                       totals.internationalBreakdown['FIFA World Cup Qualifiers'].appearances +
                       totals.internationalBreakdown['Finalissima'].appearances +
                       totals.internationalBreakdown['International Friendlies'].appearances,
          goals: totals.internationalBreakdown['FIFA World Cup'].goals +
                 totals.internationalBreakdown['Copa América'].goals +
                 totals.internationalBreakdown['FIFA World Cup Qualifiers'].goals +
                 totals.internationalBreakdown['Finalissima'].goals +
                 totals.internationalBreakdown['International Friendlies'].goals,
          assists: totals.internationalBreakdown['FIFA World Cup'].assists +
                   totals.internationalBreakdown['Copa América'].assists +
                   totals.internationalBreakdown['FIFA World Cup Qualifiers'].assists +
                   totals.internationalBreakdown['Finalissima'].assists +
                   totals.internationalBreakdown['International Friendlies'].assists,
          label: 'Selección Argentina'
        };
      case 'all':
      default:
        return {
          appearances: totals.career.appearances,
          goals: totals.career.goals,
          assists: totals.career.assists,
          label: 'Trayectoria Completa'
        };
    }
  }, [filter, totals]);

  // Aggregate season-by-season stats for the bar chart
  const barChartData = useMemo(() => {
    if (filter === 'argentina') {
      if (!totals) return [];
      // Use international yearly stats
      return totals.internationalYearly.map(y => ({
        label: String(y.year),
        goals: y.goals,
        assists: y.assists
      })); // Show all active years
    }

    // Filter seasons by selected team
    let filteredSeasons = seasons;
    if (filter === 'barca') {
      filteredSeasons = seasons.filter(s => s.team === 'FC Barcelona');
    } else if (filter === 'psg') {
      filteredSeasons = seasons.filter(s => s.team === 'Paris Saint-Germain');
    } else if (filter === 'miami') {
      filteredSeasons = seasons.filter(s => s.team === 'Inter Miami CF');
    } else {
      // For All-Time, group seasons by year
      filteredSeasons = seasons;
    }

    // Group by season identifier
    const grouped: Record<string, { label: string; goals: number; assists: number }> = {};
    filteredSeasons.forEach(s => {
      if (!grouped[s.season]) {
        grouped[s.season] = { label: s.season, goals: 0, assists: 0 };
      }
      grouped[s.season].goals += s.goals;
      grouped[s.season].assists += s.assists;
    });

    return Object.values(grouped).sort((a, b) => a.label.localeCompare(b.label)); // show all entries
  }, [filter, seasons, totals]);

  const [scrollStatus, setScrollStatus] = useState({ left: false, right: true });

  // Update scroll indicators on mount or data change
  const updateScrollIndicators = () => {
    const el = document.getElementById('stats-chart-scroll');
    if (el) {
      const isAtLeft = el.scrollLeft <= 5;
      const isAtRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;
      setScrollStatus({ left: !isAtLeft, right: !isAtRight });
    }
  };

  useEffect(() => {
    const timer = setTimeout(updateScrollIndicators, 100);
    return () => clearTimeout(timer);
  }, [barChartData]);

  // Find max goals to scale chart
  const maxVal = useMemo(() => {
    if (barChartData.length === 0) return 1;
    const maxGoals = Math.max(...barChartData.map(d => d.goals));
    const maxAssists = Math.max(...barChartData.map(d => d.assists));
    return Math.max(maxGoals, maxAssists, 1);
  }, [barChartData]);

  // Dynamically aggregate detailed stats (Free Kicks, Penalties, Hat Tricks, MOTM)
  const detailedStatsValues = useMemo(() => {
    const detailed = totals?.detailed || rawData.detailedStats;
    switch (filter) {
      case 'barca':
        return {
          freeKicks: detailed.freeKicks.barca,
          penalties: detailed.penalties.barca,
          hatTricks: detailed.hatTricks.barca,
          motm: detailed.motm.barca
        };
      case 'psg':
        return {
          freeKicks: detailed.freeKicks.psg,
          penalties: detailed.penalties.psg,
          hatTricks: detailed.hatTricks.psg,
          motm: detailed.motm.psg
        };
      case 'miami':
        return {
          freeKicks: detailed.freeKicks.miami,
          penalties: detailed.penalties.miami,
          hatTricks: detailed.hatTricks.miami,
          motm: detailed.motm.miami
        };
      case 'argentina':
        return {
          freeKicks: detailed.freeKicks.argentina,
          penalties: detailed.penalties.argentina,
          hatTricks: detailed.hatTricks.argentina,
          motm: detailed.motm.argentina
        };
      case 'all':
      default:
        return {
          freeKicks: detailed.freeKicks.career,
          penalties: detailed.penalties.career,
          hatTricks: detailed.hatTricks.career,
          motm: detailed.motm.career
        };
    }
  }, [filter, totals]);

  // Dynamically filter trophies won in this stage
  const filteredTrophies = useMemo(() => {
    if (filter === 'all') {
      return trophies.filter(t => t.category !== 'individual');
    }
    if (filter === 'barca') {
      return trophies.filter(t => t.team === 'FC Barcelona');
    }
    if (filter === 'psg') {
      return trophies.filter(t => t.team === 'Paris Saint-Germain');
    }
    if (filter === 'miami') {
      return trophies.filter(t => t.team === 'Inter Miami CF');
    }
    if (filter === 'argentina') {
      return trophies.filter(t => t.team.includes('Argentina'));
    }
    return [];
  }, [filter, trophies]);

  // Calculate relative percentages for progress rings
  const ringPercentages = useMemo(() => {
    if (!totals) {
      return { appearances: 0, goals: 0, assists: 0 };
    }
    if (filter === 'all') {
      return { appearances: 100, goals: 100, assists: 100 };
    }

    const totalApps = totals.career.appearances;
    const totalGoals = totals.career.goals;
    const totalAssists = totals.career.assists;

    return {
      appearances: totalApps ? Math.round((filteredData.appearances / totalApps) * 100) : 0,
      goals: totalGoals ? Math.round((filteredData.goals / totalGoals) * 100) : 0,
      assists: totalAssists ? Math.round((filteredData.assists / totalAssists) * 100) : 0
    };
  }, [filter, totals, filteredData]);

  // Handle active class styles
  const activeStyle = (type: FilterType) => {
    return filter === type ? styles.activeFilter : {};
  };

  return (
    <div className="screen-content animated-fade-in">
      <h1 className="hero-title" style={{ marginBottom: '4px', textAlign: 'center' }}>EXPLORADOR DE STATS</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '20px' }}>
        Estadísticas oficiales consolidadas en tiempo real.
      </p>

      {/* Filter Pills */}
      <div className="hide-scrollbar" style={styles.filterContainer}>
        <button 
          className="glass-panel" 
          style={{ ...styles.filterPill, ...activeStyle('all') }} 
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
        >
          GLOBAL
        </button>
        <button 
          className="glass-panel" 
          style={{ ...styles.filterPill, ...activeStyle('barca') }} 
          onClick={() => setFilter('barca')}
          aria-pressed={filter === 'barca'}
        >
          BARÇA
        </button>
        <button 
          className="glass-panel" 
          style={{ ...styles.filterPill, ...activeStyle('argentina') }} 
          onClick={() => setFilter('argentina')}
          aria-pressed={filter === 'argentina'}
        >
          ARGENTINA
        </button>
        <button 
          className="glass-panel" 
          style={{ ...styles.filterPill, ...activeStyle('psg') }} 
          onClick={() => setFilter('psg')}
          aria-pressed={filter === 'psg'}
        >
          PSG
        </button>
        <button 
          className="glass-panel" 
          style={{ ...styles.filterPill, ...activeStyle('miami') }} 
          onClick={() => setFilter('miami')}
          aria-pressed={filter === 'miami'}
        >
          MIAMI
        </button>
      </div>

      {/* Radial Metric Rings / Core Stats */}
      <section className="glass-panel" style={styles.mainMetricsCard}>
        <p className="label-caps" style={{ color: 'var(--theme-accent)', marginBottom: '16px', transition: 'color 0.5s ease' }}>{filteredData.label}</p>
        <div style={styles.radialContainer}>
          {/* Matches Ring */}
          <div style={styles.radialItem}>
            <svg style={styles.svgRing} viewBox="0 0 36 36">
              <path style={styles.svgBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path style={{ ...styles.svgFill, stroke: 'var(--accent-albiceleste)' }} strokeDasharray={`${ringPercentages.appearances}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div style={styles.radialText}>
              <span style={styles.radialNumber}>{filteredData.appearances}</span>
              <span style={styles.radialLabel}>Partidos</span>
            </div>
          </div>

          {/* Goals Ring */}
          <div style={styles.radialItem}>
            <svg style={styles.svgRing} viewBox="0 0 36 36">
              <path style={styles.svgBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path style={{ ...styles.svgFill, stroke: 'var(--accent-gold)' }} strokeDasharray={`${ringPercentages.goals}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div style={styles.radialText}>
              <span style={{ ...styles.radialNumber, color: 'var(--accent-gold)' }}>{filteredData.goals}</span>
              <span style={styles.radialLabel}>Goles</span>
            </div>
          </div>

          {/* Assists Ring */}
          <div style={styles.radialItem}>
            <svg style={styles.svgRing} viewBox="0 0 36 36">
              <path style={styles.svgBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path style={{ ...styles.svgFill, stroke: 'var(--accent-miami-pink)' }} strokeDasharray={`${ringPercentages.assists}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div style={styles.radialText}>
              <span style={{ ...styles.radialNumber, color: 'var(--accent-miami-pink)' }}>{filteredData.assists}</span>
              <span style={styles.radialLabel}>Asists</span>
            </div>
          </div>
        </div>

        {/* Ratio Display */}
        <div style={styles.ratioContainer}>
          <div style={styles.ratioBlock}>
            <span style={styles.ratioVal}>{filteredData.appearances ? (filteredData.goals / filteredData.appearances).toFixed(2) : 0}</span>
            <span style={styles.ratioSub}>Goles / Partido</span>
          </div>
          <div style={styles.ratioDivider}></div>
          <div style={styles.ratioBlock}>
            <span style={styles.ratioVal}>
              {filteredData.appearances ? ((filteredData.goals + filteredData.assists) / filteredData.appearances).toFixed(2) : 0}
            </span>
            <span style={styles.ratioSub}>G+A / Partido</span>
          </div>
        </div>
      </section>

      {/* Detailed Stats Panel */}
      <section style={styles.detailedGrid}>
        <div className="glass-panel" style={styles.detailedCard}>
          <span style={styles.detailedLabel}>Tiros Libres 🎯</span>
          <span style={styles.detailedVal}>{detailedStatsValues.freeKicks}</span>
        </div>
        <div className="glass-panel" style={styles.detailedCard}>
          <span style={styles.detailedLabel}>Penales 🥅</span>
          <span style={styles.detailedVal}>{detailedStatsValues.penalties}</span>
        </div>
        <div className="glass-panel" style={styles.detailedCard}>
          <span style={styles.detailedLabel}>Hat-Tricks ⚽🎩</span>
          <span style={styles.detailedVal}>{detailedStatsValues.hatTricks}</span>
        </div>
        <div className="glass-panel" style={styles.detailedCard}>
          <span style={styles.detailedLabel}>Premios MOTM 🌟</span>
          <span style={styles.detailedVal}>{detailedStatsValues.motm}</span>
        </div>
      </section>

      {/* Performance Chart */}
      <section className="glass-panel" style={styles.chartCard}>
        <h3 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>RENDIMIENTO DE TEMPORADAS RECIENTES</h3>
        
        <div style={{ position: 'relative' }}>
          <div className="chart-fade-left" style={{ opacity: scrollStatus.left ? 1 : 0 }}></div>
          <div className="chart-fade-right" style={{ opacity: scrollStatus.right ? 1 : 0 }}></div>
          
          {/* Responsive, horizontally scrollable container */}
          <div 
            id="stats-chart-scroll"
            className="chart-scroll-container" 
            style={styles.chartContainer}
            onScroll={(e) => {
              const target = e.currentTarget;
              const isAtLeft = target.scrollLeft <= 5;
              const isAtRight = target.scrollLeft + target.clientWidth >= target.scrollWidth - 5;
              setScrollStatus({ left: !isAtLeft, right: !isAtRight });
            }}
          >
            {barChartData.map((data, index) => {
            const isHovered = hoveredColIdx === index;
            return (
              <div 
                key={index} 
                style={styles.chartCol}
                onMouseEnter={() => setHoveredColIdx(index)}
                onMouseLeave={() => setHoveredColIdx(null)}
              >
                <div style={styles.barTrack}>
                  {/* Goals Bar */}
                  <div 
                    style={{ 
                      ...styles.barFill, 
                      height: `${(data.goals / maxVal) * 82}%`,
                      background: 'linear-gradient(to top, var(--theme-accent), rgba(255, 255, 255, 0.1))'
                    }} 
                    title={`${data.goals} Goles`}
                  >
                    <span 
                      style={{ 
                        ...styles.barValue,
                        opacity: isHovered ? 1 : 0,
                        transform: 'translateX(-50%)' + (isHovered ? ' translateY(-2px)' : ''),
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {data.goals}
                    </span>
                  </div>
                  {/* Assists Bar */}
                  <div 
                    style={{ 
                      ...styles.barFill, 
                      height: `${(data.assists / maxVal) * 82}%`,
                      background: 'linear-gradient(to top, var(--accent-miami-pink), rgba(247, 181, 205, 0.4))'
                    }} 
                    title={`${data.assists} Asistencias`}
                  >
                    <span 
                      style={{ 
                        ...styles.barValue,
                        opacity: isHovered ? 1 : 0,
                        transform: 'translateX(-50%)' + (isHovered ? ' translateY(-2px)' : ''),
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {data.assists}
                    </span>
                  </div>
                </div>
                <span style={styles.chartLabel}>
                  {data.label.replace('20', '')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div style={styles.chartLegend}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, background: 'var(--theme-accent)' }}></div>
            <span>Goles</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, background: 'var(--accent-miami-pink)' }}></div>
            <span>Asistencias</span>
          </div>
        </div>
      </section>

      {/* Trophies Summary */}
      {filteredTrophies.length > 0 && (
        <section className="glass-panel" style={styles.trophyCardSection}>
          <h3 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
            TÍTULOS GANADOS EN ESTA ETAPA ({filteredTrophies.reduce((acc, t) => acc + t.count, 0)})
          </h3>
          <div style={styles.trophyListContainer}>
            {filteredTrophies.map(t => (
              <div key={t.id} style={styles.trophyItem}>
                <span style={styles.trophyEmoji}>🏆</span>
                <div style={styles.trophyTextContainer}>
                  <span style={styles.trophyTitleText}>{t.title}</span>
                  <span style={styles.trophyCountText}>{t.count} {t.count > 1 ? 'títulos' : 'título'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  filterContainer: {
    display: 'flex',
    overflowX: 'auto',
    gap: '8px',
    paddingBottom: '8px',
    marginBottom: '18px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none'
  },
  filterPill: {
    flexShrink: 0,
    padding: '10px 18px', /* Increased padding for better touch target */
    border: '1px solid var(--glass-border)',
    borderRadius: '20px',
    background: 'rgba(24, 32, 56, 0.25)',
    color: 'var(--text-muted)',
    fontSize: '12px',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  activeFilter: {
    borderColor: 'var(--theme-accent)',
    color: 'var(--text-high-contrast)',
    background: 'var(--theme-glow)'
  },
  mainMetricsCard: {
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px'
  },
  radialContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    margin: '12px 0',
    gap: '8px'
  },
  radialItem: {
    position: 'relative',
    width: 'clamp(76px, 22vw, 90px)', /* Responsive scaling prevents layout breaking on small viewports */
    height: 'clamp(76px, 22vw, 90px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  svgRing: {
    width: '100%',
    height: '100%',
    transform: 'rotate(-90deg)'
  },
  svgBg: {
    fill: 'none',
    stroke: 'rgba(255, 255, 255, 0.04)',
    strokeWidth: '2.5'
  },
  svgFill: {
    fill: 'none',
    strokeWidth: '2.8',
    strokeLinecap: 'round',
    transition: 'stroke-dasharray 0.5s ease-in-out'
  },
  radialText: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%'
  },
  radialNumber: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1rem, 3.5vw, 1.25rem)', /* Responsive font scaling */
    fontWeight: 700,
    color: 'var(--text-high-contrast)'
  },
  radialLabel: {
    fontSize: 'clamp(8px, 2vw, 9px)', /* Responsive font scaling */
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    fontWeight: 600,
    letterSpacing: '0.05em',
    marginTop: '2px'
  },
  ratioContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '280px',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
  },
  ratioBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1
  },
  ratioVal: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: 'var(--text-high-contrast)'
  },
  ratioSub: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    marginTop: '4px',
    fontWeight: 500
  },
  ratioDivider: {
    width: '1px',
    background: 'rgba(255, 255, 255, 0.06)',
    alignSelf: 'stretch'
  },
  chartCard: {
    padding: '24px 20px',
    marginBottom: '20px',
    overflow: 'hidden'
  },
  chartContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    height: '140px',
    margin: '16px 0 8px 0',
    padding: '0 4px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    overflowX: 'auto', /* Enables horizontal scrolling on narrow screens */
    WebkitOverflowScrolling: 'touch', /* Smooth touch momentum scrolling in iOS */
    gap: '6px'
  },
  chartCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: '0 0 auto',
    height: '100%',
    width: '48px', /* Ensure each column maintains a comfortable width */
    minWidth: '48px', /* Prevent squishing on mobile views */
    cursor: 'pointer'
  },
  barTrack: {
    display: 'flex',
    gap: '3px',
    alignItems: 'flex-end',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    paddingBottom: '4px'
  },
  barFill: {
    width: '8px',
    borderRadius: '4px 4px 0 0',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    transition: 'height 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)'
  },
  barValue: {
    display: 'block',
    position: 'absolute',
    top: '-16px',
    fontSize: '8px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-high-contrast)',
    fontWeight: 700,
    width: '20px',
    textAlign: 'center',
    left: '50%',
    pointerEvents: 'none'
  },
  chartLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '8.5px',
    color: 'var(--text-muted)',
    marginTop: '6px',
    fontWeight: 600
  },
  chartLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '16px',
    fontSize: '11px',
    fontWeight: 600,
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
  detailedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '20px'
  },
  detailedCard: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  detailedLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px'
  },
  detailedVal: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.6rem',
    fontWeight: 800,
    color: 'var(--theme-accent)'
  },
  trophyCardSection: {
    padding: '20px',
    marginBottom: '20px'
  },
  trophyListContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '220px',
    overflowY: 'auto',
    paddingRight: '4px'
  },
  trophyItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.04)'
  },
  trophyEmoji: {
    fontSize: '20px'
  },
  trophyTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  trophyTitleText: {
    fontFamily: 'var(--font-sans)',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-high-contrast)'
  },
  trophyCountText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--theme-accent)',
    fontWeight: 600,
    marginTop: '2px'
  }
};
