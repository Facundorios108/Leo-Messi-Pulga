import React from 'react';
import type { Milestone } from '../types';

interface TimelineViewProps {
  milestones: Milestone[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ milestones }) => {
  if (milestones.length === 0) {
    return (
      <div className="skeleton-loader" style={{ padding: '24px' }}>
        <div style={{ height: '30px', width: '120px', background: 'var(--color-slate-light)', marginBottom: '20px' }}></div>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-slate-light)', marginTop: '8px' }}></div>
            <div style={{ height: '80px', flex: 1, background: 'var(--color-slate-light)', borderRadius: '12px' }}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="screen-content animated-fade-in">
      <h1 className="hero-title" style={{ marginBottom: '4px', textAlign: 'center' }}>LÍNEA DE TIEMPO</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '24px' }}>
        Hitos históricos y leyenda de Lionel Messi.
      </p>

      {/* Timeline Layout */}
      <div style={styles.timelineContainer}>
        {/* Blue Rail */}
        <div style={styles.blueRail}></div>

        {/* Milestone Nodes */}
        <div style={styles.nodesList}>
          {milestones.map((node) => (
            <div key={node.id} style={styles.milestoneNode}>
              {/* Timeline Indicator Node */}
              <div style={styles.indicatorContainer}>
                <div style={styles.outerCircle}>
                  <div style={styles.innerCircle}></div>
                </div>
              </div>

              {/* Milestone Card */}
              <div className="glass-panel" style={styles.milestoneCard}>
                <div style={styles.cardHeader}>
                  <span style={styles.yearText}>{node.year}</span>
                  <span 
                    className="label-caps" 
                    style={{ 
                      fontSize: '9px', 
                      color: node.category === 'national' ? 'var(--accent-albiceleste)' : 
                             node.category === 'personal' ? 'var(--accent-gold)' : 'var(--text-muted)'
                    }}
                  >
                    {node.category}
                  </span>
                </div>
                <h3 style={styles.milestoneTitle}>{node.title}</h3>
                <p style={styles.milestoneDesc}>{node.description}</p>
                {node.team && (
                  <div style={styles.teamTag}>
                    <span style={styles.teamTagText}>{node.team}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  timelineContainer: {
    position: 'relative',
    paddingLeft: '16px',
    marginLeft: '8px',
    marginTop: '8px'
  },
  blueRail: {
    position: 'absolute',
    left: '5px',
    top: '12px',
    bottom: '12px',
    width: '2px',
    background: 'linear-gradient(to bottom, var(--accent-gold), var(--accent-albiceleste) 20%, var(--accent-albiceleste) 80%, var(--accent-miami-pink))',
    borderRadius: '1px'
  },
  nodesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  milestoneNode: {
    display: 'flex',
    position: 'relative',
    alignItems: 'flex-start'
  },
  indicatorContainer: {
    position: 'absolute',
    left: '-16px',
    top: '18px',
    width: '12px',
    height: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'translateX(-50%)'
  },
  outerCircle: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'var(--color-space-black)',
    border: '2px solid var(--accent-albiceleste)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  innerCircle: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: 'var(--accent-gold)'
  },
  milestoneCard: {
    flex: 1,
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: '16px'
  },
  cardHeader: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px'
  },
  yearText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--accent-gold)'
  },
  milestoneTitle: {
    fontSize: '14.5px',
    fontWeight: 700,
    color: 'var(--text-high-contrast)',
    marginBottom: '6px'
  },
  milestoneDesc: {
    fontSize: '12.5px',
    lineHeight: '1.5',
    color: 'var(--text-body)',
    marginBottom: '10px'
  },
  teamTag: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '4px',
    padding: '2px 8px',
    alignSelf: 'flex-end'
  },
  teamTagText: {
    fontSize: '9.5px',
    fontWeight: 600,
    color: 'var(--text-muted)'
  }
};
