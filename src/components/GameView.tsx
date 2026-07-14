import React, { useState, useEffect } from 'react';
import type { TriviaQuestion } from '../types';

interface GameViewProps {
  questions: TriviaQuestion[];
}

export const GameView: React.FC<GameViewProps> = ({ questions }) => {
  const [activeQuestions, setActiveQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Pick 6 random questions and shuffle them
  const initializeGame = () => {
    if (questions.length > 0) {
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      setActiveQuestions(shuffled.slice(0, 6));
    }
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResults(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  if (activeQuestions.length === 0) {
    return (
      <div className="skeleton-loader" style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ height: '20px', width: '200px', background: 'var(--color-slate-light)', margin: '0 auto 16px auto' }}></div>
        <div style={{ height: '120px', background: 'var(--color-slate-light)', borderRadius: '16px', marginBottom: '16px' }}></div>
        <div style={{ height: '40px', background: 'var(--color-slate-light)', borderRadius: '8px' }}></div>
      </div>
    );
  }

  const currentQuestion = activeQuestions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    initializeGame();
  };

  if (showResults) {
    return (
      <div className="screen-content animated-fade-in" style={{ textAlign: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={styles.resultsCard} role="status" aria-live="polite">
          <span style={{ fontSize: '48px' }} aria-hidden="true">🏆</span>
          <h2 className="section-title" style={{ color: 'var(--theme-accent)', marginTop: '12px', marginBottom: '8px' }}>TRIVIA FINALIZADA</h2>
          <p style={{ color: 'var(--text-body)', fontSize: '15px', marginBottom: '24px' }}>
            Has completado la Trivia del GOAT.
          </p>
          <div className="score-circle-celebrate" style={styles.scoreCircle}>
            <span style={styles.scoreText}>{score} / {activeQuestions.length}</span>
            {/* Gold dust particles */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 2 * Math.PI) / 12;
              const tx = `${Math.cos(angle) * 35}px`;
              const ty = `${Math.sin(angle) * 35}px`;
              return (
                <div 
                  key={i} 
                  className="gold-particle" 
                  style={{ 
                    animationDelay: `${i * 0.1}s`,
                    left: `${50 + Math.cos(angle) * 45}%`,
                    top: `${50 + Math.sin(angle) * 45}%`,
                    '--tx': tx,
                    '--ty': ty
                  } as React.CSSProperties}
                />
              );
            })}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', marginTop: '16px', marginBottom: '24px', lineHeight: '1.5' }}>
            {score === activeQuestions.length ? '¡Increíble! Eres un verdadero experto del fútbol y de la Pulga.' :
             score >= activeQuestions.length / 2 ? '¡Buen trabajo! Conoces bastante bien su legendaria carrera.' :
             '¡Sigue intentándolo! La carrera de Messi tiene muchos hitos por descubrir.'}
          </p>
          <button className="glass-panel" style={styles.actionButton} onClick={handleRestart}>
            JUGAR OTRA VEZ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-content animated-fade-in">
      <h1 className="hero-title" style={{ marginBottom: '4px', textAlign: 'center' }}>GOAT TRIVIA</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '20px' }}>
        Ponte a prueba sobre los hitos de la Pulga.
      </p>

      {/* Progress indicators */}
      <div style={styles.progressContainer}>
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>Pregunta {currentIndex + 1} de {activeQuestions.length}</span>
          <span style={styles.scoreTracker}>Puntos: {score}</span>
        </div>
        <div style={styles.progressBarTrack}>
          <div 
            style={{ 
              ...styles.progressBarFill, 
              width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-panel" style={styles.questionCard}>
        <h2 style={styles.questionText}>{currentQuestion.question}</h2>
      </div>

      {/* Options Stack */}
      <div style={styles.optionsList} role="radiogroup" aria-label="Opciones de respuesta">
        {currentQuestion.options.map((option, idx) => {
          let btnClasses = "glass-panel option-btn";
          if (selectedOption === idx) btnClasses += " selected";
          
          if (isSubmitted) {
            if (idx === currentQuestion.correctAnswer) {
              btnClasses += " correct";
            } else if (selectedOption === idx) {
              btnClasses += " incorrect";
            } else {
              btnClasses += " disabled";
            }
          }

          return (
            <button 
              key={idx}
              className={btnClasses}
              onClick={() => handleSelectOption(idx)}
              disabled={isSubmitted}
              aria-pressed={selectedOption === idx}
              aria-label={`Opción ${String.fromCharCode(65 + idx)}: ${option}`}
              style={{ minHeight: '44px' }}
            >
              <div style={styles.optionMarker}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span style={styles.optionText}>{option}</span>
            </button>
          );
        })}
      </div>

      {/* Actions / Feedback */}
      <div style={styles.actionContainer}>
        {isSubmitted && (
          <div className="glass-panel feedback-panel" style={styles.feedbackCard} role="status" aria-live="polite">
            <p style={{ fontWeight: 700, fontSize: '13px', color: selectedOption === currentQuestion.correctAnswer ? 'var(--theme-accent)' : '#ef4444', marginBottom: '6px' }}>
              {selectedOption === currentQuestion.correctAnswer ? '✓ ¡CORRECTO!' : '✗ INCORRECTO'}
            </p>
            <p style={styles.explanationText}>{currentQuestion.explanation}</p>
          </div>
        )}

        {!isSubmitted ? (
          <button 
            className="glass-panel"
            style={{ 
              ...styles.actionButton, 
              opacity: selectedOption !== null ? 1 : 0.5,
              cursor: selectedOption !== null ? 'pointer' : 'not-allowed'
            }}
            onClick={handleSubmit}
            disabled={selectedOption === null}
          >
            RESPONDER
          </button>
        ) : (
          <button 
            className="glass-panel" 
            style={styles.actionButton}
            onClick={handleNext}
          >
            {currentIndex + 1 === activeQuestions.length ? 'VER RESULTADOS' : 'SIGUIENTE PREGUNTA'}
          </button>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  progressContainer: {
    marginBottom: '20px'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginBottom: '6px'
  },
  progressLabel: {
    fontFamily: 'var(--font-mono)'
  },
  scoreTracker: {
    color: 'var(--theme-accent)'
  },
  progressBarTrack: {
    height: '6px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(to right, var(--theme-accent), var(--theme-accent))',
    borderRadius: '3px',
    transition: 'width 0.4s ease'
  },
  questionCard: {
    padding: '24px 20px',
    marginBottom: '20px',
    borderLeft: '4px solid var(--theme-accent)',
    boxShadow: '0 8px 32px 0 var(--theme-glow)'
  },
  questionText: {
    fontSize: '1.05rem',
    fontWeight: 700,
    lineHeight: '1.5',
    color: 'var(--text-high-contrast)'
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  optionBtn: {
    width: '100%',
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    background: 'rgba(24, 32, 56, 0.15)',
    border: '1px solid var(--glass-border)',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  optionMarker: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 700,
    marginRight: '16px',
    color: 'var(--text-muted)'
  },
  optionText: {
    fontSize: '13.5px',
    fontWeight: 500,
    color: 'var(--text-body)'
  },
  selectedOption: {
    borderColor: 'var(--theme-accent)',
    background: 'var(--theme-glow)',
    boxShadow: '0 0 16px var(--theme-glow)'
  },
  correctOption: {
    borderColor: '#10b981',
    background: 'rgba(16, 185, 129, 0.08)',
    boxShadow: '0 0 16px rgba(16, 185, 129, 0.1)'
  },
  incorrectOption: {
    borderColor: '#ef4444',
    background: 'rgba(239, 68, 68, 0.08)',
    boxShadow: '0 0 16px rgba(239, 68, 68, 0.1)'
  },
  disabledOption: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  actionContainer: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  actionButton: {
    width: '100%',
    padding: '16px',
    border: '1px solid var(--theme-accent)',
    borderRadius: '12px',
    background: 'var(--theme-glow)',
    color: 'var(--theme-accent)',
    fontSize: '12px',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.3s ease'
  },
  feedbackCard: {
    padding: '16px',
    background: 'rgba(5, 7, 12, 0.4)',
    borderLeft: '4px solid var(--theme-accent)'
  },
  explanationText: {
    fontSize: '12px',
    lineHeight: '1.5',
    color: 'var(--text-body)'
  },
  resultsCard: {
    padding: '36px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  scoreCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '3px solid var(--theme-accent)',
    background: 'var(--theme-glow)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 24px var(--theme-glow)'
  },
  scoreText: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'var(--theme-accent)'
  }
};
