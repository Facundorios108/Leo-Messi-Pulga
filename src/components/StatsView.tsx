import React, { useState, useMemo } from 'react';
import type { SeasonStats, CareerTotals } from '../types';
import * as rawData from '../data/messiRawData';

interface StatsViewProps {
  seasons: SeasonStats[];
  totals: {
    career: CareerTotals;
    clubs: typeof rawData.clubTotals;
    internationalBreakdown: typeof rawData.internationalStatsBreakdown;
    internationalYearly: typeof rawData.internationalYearlyStats;
  } | null;
}

type FilterType = 'all' | 'barca' | 'psg' | 'miami' | 'argentina';

export const StatsView: React.FC<StatsViewProps> = ({ seasons, totals }) => {
  const [filter, setFilter] = useState<FilterType>('all');

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
      })).slice(-10); // Show last 10 active years
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

    return Object.values(grouped).sort((a, b) => a.label.localeCompare(b.label)).slice(-10); // show last 10 entries
  }, [filter, seasons, totals]);

  // Find max goals to scale chart
  const maxVal = useMemo(() => {
    if (barChartData.length === 0) return 1;
    const maxGoals = Math.max(...barChartData.map(d => d.goals));
    const maxAssists = Math.max(...barChartData.map(d => d.assists));
    return Math.max(maxGoals, maxAssists, 1);
  }, [barChartData]);

  // Handle active class styles
  const activeStyle = (type: FilterType) => {
    return filter === type ? styles.activeFilter : {};
  };

  return (
    <div className="screen-content animated-fade-in">
      <h1 className="hero-title" style={{ marginBottom: '4px', textAlign: 'center' }}>EXPLORADOR DE STATS</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '20px' }}>
        Estadísticas oficiales consolidadas en base de datos.
      </p>

      {/* Filter Pills */}
      <div style={styles.filterContainer}>
        <button className="glass-panel" style={{ ...styles.filterPill, ...activeStyle('all') }} onClick={() => setFilter('all')}>GLOBAL</button>
        <button className="glass-panel" style={{ ...styles.filterPill, ...activeStyle('barca') }} onClick={() => setFilter('barca')}>BARÇA</button>
        <button className="glass-panel" style={{ ...styles.filterPill, ...activeStyle('argentina') }} onClick={() => setFilter('argentina')}>ARGENTINA</button>
        <button className="glass-panel" style={{ ...styles.filterPill, ...activeStyle('psg') }} onClick={() => setFilter('psg')}>PSG</button>
        <button className="glass-panel" style={{ ...styles.filterPill, ...activeStyle('miami') }} onClick={() => setFilter('miami')}>MIAMI</button>
      </div>

      {/* Radial Metric Rings / Core Stats */}
      <section className="glass-panel" style={styles.mainMetricsCard}>
        <p className="label-caps" style={{ color: 'var(--accent-gold)', marginBottom: '16px' }}>{filteredData.label}</p>
        <div style={styles.radialContainer}>
          {/* Matches Ring */}
          <div style={styles.radialItem}>
            <svg style={styles.svgRing} viewBox="0 0 36 36">
              <path style={styles.svgBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path style={{ ...styles.svgFill, stroke: 'var(--accent-albiceleste)' }} strokeDasharray="90, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
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
              <path style={{ ...styles.svgFill, stroke: 'var(--accent-gold)' }} strokeDasharray="80, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
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
              <path style={{ ...styles.svgFill, stroke: 'var(--accent-miami-pink)' }} strokeDasharray="70, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
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

      {/* Performance Chart */}
      <section className="glass-panel" style={styles.chartCard}>
        <h3 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>RENDIMIENTO DE TEMPORADAS RECIENTES</h3>
        <div style={styles.chartContainer}>
          {barChartData.map((data, index) => (
            <div key={index} style={styles.chartCol}>
              <div style={styles.barTrack}>
                {/* Goals Bar */}
                <div 
                  style={{ 
                    ...styles.barFill, 
                    height: `${(data.goals / maxVal) * 100}%`,
                    background: 'linear-gradient(to top, var(--accent-gold), rgba(212, 175, 55, 0.4))'
                  }} 
                  title={`${data.goals} Goles`}
                >
                  <span style={styles.barValue}>{data.goals}</span>
                </div>
                {/* Assists Bar */}
                <div 
                  style={{ 
                    ...styles.barFill, 
                    height: `${(data.assists / maxVal) * 100}%`,
                    background: 'linear-gradient(to top, var(--accent-miami-pink), rgba(247, 181, 205, 0.4))'
                  }} 
                  title={`${data.assists} Asistencias`}
                >
                  <span style={styles.barValue}>{data.assists}</span>
                </div>
              </div>
              <span style={styles.chartLabel}>
                {data.label.replace('20', '')}
              </span>
            </div>
          ))}
        </div>
        <div style={styles.chartLegend}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, background: 'var(--accent-gold)' }}></div>
            <span>Goles</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendDot, background: 'var(--accent-miami-pink)' }}></div>
            <span>Asistencias</span>
          </div>
        </div>
      </section>
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
    padding: '8px 16px',
    border: '1px solid var(--glass-border)',
    borderRadius: '20px',
    background: 'rgba(24, 32, 56, 0.25)',
    color: 'var(--text-muted)',
    fontSize: '11px',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  activeFilter: {
    borderColor: 'var(--theme-accent)',
    color: 'var(--text-high-contrast)',
    background: 'rgba(212, 175, 55, 0.1)'
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
    margin: '12px 0'
  },
  radialItem: {
    position: 'relative',
    width: '90px',
    height: '90px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
    textAlign: 'center'
  },
  radialNumber: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--text-high-contrast)'
  },
  radialLabel: {
    fontSize: '9px',
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
    marginBottom: '20px'
  },
  chartContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '140px',
    margin: '16px 0 8px 0',
    padding: '0 4px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
  },
  chartCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    height: '100%'
  },
  barTrack: {
    display: 'flex',
    gap: '3px',
    alignItems: 'flex-end',
    height: '100%',
    width: '80%',
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
    display: 'none', // Hover displays could be added but keep clean for mobile
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
  }
};
