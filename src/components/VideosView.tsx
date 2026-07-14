import React, { useState, useMemo, useRef } from 'react';
import type { VideoItem } from '../types';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

interface VideosViewProps {
  videos: VideoItem[];
}

type VideoCategory = 'all' | 'dribbles' | 'freekicks' | 'assists' | 'worldcup';

export const VideosView: React.FC<VideosViewProps> = ({ videos }) => {
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>('all');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);


  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const cards = container.children;
    const containerCenter = container.scrollLeft + container.offsetWidth / 2;

    let closestIndex = 0;
    let minDiff = Infinity;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const diff = Math.abs(containerCenter - cardCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }

    if (closestIndex !== activeCardIndex) {
      setActiveCardIndex(closestIndex);
    }
  };

  // Filter videos based on category
  const filteredVideos = useMemo(() => {
    if (selectedCategory === 'all') return videos;
    return videos.filter(v => v.category === selectedCategory);
  }, [selectedCategory, videos]);

  const openVideo = (video: VideoItem) => {
    setActiveVideo(video);
    setUserRating(null);
    dialogRef.current?.showModal();
  };

  const closeVideo = () => {
    dialogRef.current?.close();
    setActiveVideo(null);
  };

  const handleVote = async (video: VideoItem, score: number) => {
    if (hasVoted[video.id]) return;
    setUserRating(score);
    
    // Optimistic vote lock
    setHasVoted(prev => ({ ...prev, [video.id]: true }));

    try {
      const docRef = doc(db, "videos", video.id);
      await updateDoc(docRef, {
        ratingSum: increment(score),
        ratingCount: increment(1)
      });
    } catch (err) {
      console.error("Failed to submit vote to Firestore: ", err);
      // Revert lock if failed
      setHasVoted(prev => ({ ...prev, [video.id]: false }));
      setUserRating(null);
    }
  };

  // Helper to calculate rating averages
  const getRatingAvg = (video: VideoItem) => {
    if (!video.ratingCount) return 5.0;
    return (video.ratingSum / video.ratingCount).toFixed(1);
  };

  return (
    <div className="screen-content animated-fade-in">
      <h1 className="hero-title" style={{ marginBottom: '4px', textAlign: 'center' }}>TEATRO DE MAGIA</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '20px' }}>
        Los mejores goles, regates y jugadas de la Pulga.
      </p>

      {/* Categories Bar */}
      <div className="video-categories" style={styles.categoriesContainer}>
        {(['all', 'dribbles', 'freekicks', 'assists', 'worldcup'] as VideoCategory[]).map(cat => (
          <button 
            key={cat} 
            className={`glass-panel ${selectedCategory === cat ? 'active-filter' : ''}`}
            style={{
              ...styles.categoryPill,
              ...(selectedCategory === cat ? styles.activeCategoryPill : {})
            }}
            onClick={() => {
              setSelectedCategory(cat);
              setActiveCardIndex(0);
              if (containerRef.current) {
                containerRef.current.scrollLeft = 0;
              }
            }}
          >
            {cat === 'all' ? 'TODOS' :
             cat === 'dribbles' ? 'GAMBETAS' :
             cat === 'freekicks' ? 'TIROS LIBRES' :
             cat === 'assists' ? 'PASES' : 'MUNDIAL'}
          </button>
        ))}
      </div>

      {/* Main Cover-Flow Swipe Container */}
      {filteredVideos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          <p>No hay videos en esta categoría por el momento.</p>
        </div>
      ) : (
        <div className="video-flow-wrapper" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
          <div 
            ref={containerRef}
            onScroll={handleScroll}
            className="video-snap-container" 
            style={styles.snapContainer}
          >
            {filteredVideos.map((video, index) => {
              const isActive = index === activeCardIndex;
              return (
                <div 
                  key={video.id} 
                  className={`video-flow-card glass-panel ${isActive ? 'active-flow-card' : ''}`}
                  style={{
                    ...styles.flowCard,
                    transform: isActive ? 'scale(1.03) translateY(-4px)' : 'scale(0.92)',
                    opacity: isActive ? 1 : 0.5,
                    borderColor: isActive ? 'var(--theme-accent)' : 'var(--glass-border)',
                    boxShadow: isActive ? '0 12px 32px var(--theme-border)' : 'none'
                  }}
                  onClick={() => openVideo(video)}
                >
                  <div style={styles.posterWrapper}>
                    <img 
                      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} 
                      alt={video.title} 
                      loading="lazy" 
                      style={styles.posterImg}
                    />
                    <div style={styles.playOverlay} className="play-overlay-btn">
                      <span>▶</span>
                    </div>
                    <span style={styles.durationTag}>{video.duration}</span>
                  </div>
                  
                  <div style={styles.cardInfo}>
                    <span className="label-caps" style={{ fontSize: '9px', color: 'var(--theme-accent)' }}>
                      {video.category === 'dribbles' ? 'GAMBETA' :
                       video.category === 'freekicks' ? 'TIRO LIBRE' :
                       video.category === 'assists' ? 'PASADOR' : 'COPA MUNDIAL'}
                    </span>
                    <h3 style={styles.videoTitle}>{video.title}</h3>
                    <div style={styles.ratingRow}>
                      <span style={{ color: 'var(--accent-gold)' }}>★</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-body)', fontWeight: 600, marginLeft: '4px' }}>
                        {getRatingAvg(video)}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                        ({video.ratingCount || 0} calificaciones)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dialog Overlay Theatre Lightbox */}
      <dialog 
        ref={dialogRef} 
        className="glass-panel" 
        style={styles.dialog}
        onClose={closeVideo}
        onClick={(e) => e.target === dialogRef.current && closeVideo()}
      >
        {activeVideo && (
          <div style={styles.dialogContent}>
            <button style={styles.closeBtn} onClick={closeVideo}>&times;</button>
            
            <div style={styles.iframeWrapper}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={styles.iframe}
              ></iframe>
            </div>

            <div style={styles.dialogMeta}>
              <span className="label-caps" style={{ color: 'var(--theme-accent)', fontSize: '10px' }}>
                {activeVideo.category.toUpperCase()}
              </span>
              <h2 style={styles.dialogTitle}>{activeVideo.title}</h2>
              <p style={styles.dialogDesc}>{activeVideo.description}</p>
              
              {activeVideo.stats && (
                <div style={styles.statsRow}>
                  {activeVideo.stats.distanceYards !== undefined && activeVideo.stats.distanceYards > 0 && (
                    <div style={styles.statChip}>
                      <span style={styles.statLabel}>Distancia</span>
                      <span style={styles.statVal}>{activeVideo.stats.distanceYards} yd</span>
                    </div>
                  )}
                  {activeVideo.stats.defendersBeaten !== undefined && activeVideo.stats.defendersBeaten > 0 && (
                    <div style={styles.statChip}>
                      <span style={styles.statLabel}>Gambeteados</span>
                      <span style={styles.statVal}>{activeVideo.stats.defendersBeaten}</span>
                    </div>
                  )}
                  {activeVideo.stats.maxSpeedKmph !== undefined && activeVideo.stats.maxSpeedKmph > 0 && (
                    <div style={styles.statChip}>
                      <span style={styles.statLabel}>Velocidad Máx</span>
                      <span style={styles.statVal}>{activeVideo.stats.maxSpeedKmph} km/h</span>
                    </div>
                  )}
                </div>
              )}

              {/* Upvote rating poll */}
              <div style={styles.ratingPollContainer} className="glass-panel">
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {hasVoted[activeVideo.id] ? '¡GRACIAS POR TU VOTO!' : '¿QUÉ TAN MÁGICA FUE ESTA JUGADA?'}
                </span>
                
                <div style={styles.voteSunsRow}>
                  {[1, 2, 3, 4, 5].map(num => {
                    const isSelected = userRating !== null && num <= userRating;
                    return (
                      <button 
                        key={num} 
                        style={{
                          ...styles.voteSunBtn,
                          color: isSelected ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.15)',
                          textShadow: isSelected ? '0 0 10px var(--accent-gold)' : 'none'
                        }}
                        disabled={hasVoted[activeVideo.id]}
                        onClick={() => handleVote(activeVideo, num)}
                        aria-label={`Calificar con ${num} estrella(s)`}
                      >
                        ★
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  categoriesContainer: {
    display: 'flex',
    overflowX: 'auto',
    gap: '8px',
    paddingBottom: '8px',
    marginBottom: '20px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none'
  },
  categoryPill: {
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
  activeCategoryPill: {
    borderColor: 'var(--theme-accent)',
    color: 'var(--text-high-contrast)',
    background: 'var(--theme-glow)'
  },
  snapContainer: {
    display: 'flex',
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
    gap: '16px',
    padding: '8px 4px 20px 4px',
    scrollbarWidth: 'none',
    WebkitOverflowScrolling: 'touch'
  },
  flowCard: {
    flex: '0 0 85%',
    maxWidth: '320px',
    scrollSnapAlign: 'center',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s ease'
  },
  posterWrapper: {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%', // 16:9 ratio
    background: '#000',
    overflow: 'hidden'
  },
  posterImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.85,
    transition: 'transform 0.5s ease'
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'rgba(5, 7, 12, 0.75)',
    border: '2px solid var(--theme-accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: 'var(--theme-accent)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
    transition: 'all 0.3s ease'
  },
  durationTag: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    background: 'rgba(0,0,0,0.7)',
    borderRadius: '4px',
    padding: '2px 6px',
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    color: '#fff',
    fontWeight: 600
  },
  cardInfo: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  videoTitle: {
    fontSize: '13.5px',
    fontWeight: 700,
    color: 'var(--text-high-contrast)',
    marginTop: '6px',
    marginBottom: '8px',
    lineHeight: '1.45',
    fontFamily: 'var(--font-display)'
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 'auto'
  },
  dialog: {
    border: 'none',
    background: 'transparent',
    maxWidth: '90%',
    width: '520px',
    maxHeight: '90vh',
    margin: 'auto',
    borderRadius: '20px',
    outline: 'none',
    boxShadow: '0 24px 64px rgba(0,0,0,0.85)'
  },
  dialogContent: {
    position: 'relative',
    background: 'var(--color-slate-deep)',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1px solid var(--theme-border)'
  },
  closeBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'all 0.2s ease'
  },
  iframeWrapper: {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%',
    background: '#000'
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  dialogMeta: {
    padding: '24px 20px'
  },
  dialogTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.4rem',
    color: 'var(--text-high-contrast)',
    marginTop: '6px',
    marginBottom: '10px',
    lineHeight: '1.3'
  },
  dialogDesc: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: 'var(--text-body)',
    marginBottom: '20px'
  },
  statsRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  statChip: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    padding: '6px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: '1 1 30%',
    minWidth: '90px'
  },
  statLabel: {
    fontSize: '8px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  statVal: {
    fontSize: '13px',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    color: 'var(--theme-accent)',
    marginTop: '2px'
  },
  ratingPollContainer: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(5, 7, 12, 0.4)',
    borderLeft: '4px solid var(--theme-accent)',
    borderRadius: '10px'
  },
  voteSunsRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px'
  },
  voteSunBtn: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: 0
  }
};
