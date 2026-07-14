import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const detectIOS = () => {
  if (typeof window === 'undefined') return { isAppleiOS: false, isSafari: false };
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isAppleiOS = /iphone|ipad|ipod/.test(userAgent);
  const isSafari = /safari/.test(userAgent) && !/crios/.test(userAgent);
  return { isAppleiOS, isSafari };
};

export const PWAInstallPrompt: React.FC = () => {
  const { isAppleiOS, isSafari } = detectIOS();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS] = useState(isAppleiOS && isSafari);
  const [showPrompt, setShowPrompt] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(display-mode: standalone)').matches) return false;
    const isDismissed = localStorage.getItem('pwa-install-dismissed');
    if (isDismissed) return false;
    return isAppleiOS && isSafari;
  });

  useEffect(() => {
    // 1. Detect if already installed/standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // 2. Check if dismissed recently
    const isDismissed = localStorage.getItem('pwa-install-dismissed');
    if (isDismissed) return;

    // 3. Listen for Android/Chrome install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="glass-panel" style={styles.promptBar}>
      <div style={styles.content}>
        <span style={styles.icon}>📱</span>
        <div style={styles.textContainer}>
          <h4 style={styles.title}>Instalar Leo Messi Pulga</h4>
          <p style={styles.desc}>
            {isIOS 
              ? 'Toca Compartir (📤) y luego "Agregar a Inicio" para usar sin conexión.' 
              : 'Descarga la app en tu pantalla de inicio para una experiencia premium fluida.'}
          </p>
        </div>
      </div>
      <div style={styles.actions}>
        {!isIOS && (
          <button style={styles.installBtn} onClick={handleInstallClick}>
            INSTALAR
          </button>
        )}
        <button style={styles.dismissBtn} onClick={handleDismiss}>
          CERRAR
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  promptBar: {
    position: 'fixed',
    top: 'calc(16px + var(--safe-area-inset-top))',
    left: '16px',
    right: '16px',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    zIndex: 200,
    background: 'rgba(14, 19, 34, 0.95)',
    borderLeft: '4px solid var(--accent-gold)',
    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.6)'
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  icon: {
    fontSize: '24px'
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  title: {
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--text-high-contrast)'
  },
  desc: {
    fontSize: '11px',
    color: 'var(--text-body)',
    lineHeight: '1.4'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px'
  },
  installBtn: {
    background: 'var(--accent-gold)',
    color: 'var(--color-space-black)',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '10px',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'var(--font-display)'
  },
  dismissBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    color: 'var(--text-muted)',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '10px',
    fontWeight: 600,
    cursor: 'pointer'
  }
};
