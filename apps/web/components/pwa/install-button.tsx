'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt (Chrome, Edge, etc.)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  // Already installed
  if (isInstalled) {
    return null;
  }

  // iOS - show help modal
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSHelp(true)}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-neon-cyan-600 to-neon-violet-600 px-4 py-3 text-sm font-cyber font-medium text-white transition-all hover:opacity-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Installer
        </button>

        {showIOSHelp && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="card card-glow max-w-sm relative">
              <div className="corner-decoration top-left" />
              <div className="corner-decoration top-right" />
              <h3 className="text-lg font-cyber font-bold text-neon-cyan-400 mb-4">
                Installer sur iOS
              </h3>
              <ol className="text-sm text-cyber-dark-300 space-y-3 mb-6">
                <li className="flex gap-2">
                  <span className="text-neon-cyan-400 font-bold">1.</span>
                  Appuyez sur le bouton <span className="inline-flex items-center px-2 py-0.5 bg-cyber-dark-800 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                  </span> Partager
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-cyan-400 font-bold">2.</span>
                  Faites défiler et appuyez sur <span className="text-white font-medium">&quot;Sur l&apos;écran d&apos;accueil&quot;</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-neon-cyan-400 font-bold">3.</span>
                  Appuyez sur <span className="text-white font-medium">&quot;Ajouter&quot;</span>
                </li>
              </ol>
              <button
                onClick={() => setShowIOSHelp(false)}
                className="btn-primary w-full font-cyber"
              >
                Compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Chrome/Edge with install prompt available
  if (deferredPrompt) {
    return (
      <button
        onClick={handleInstall}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-neon-cyan-600 to-neon-violet-600 px-4 py-3 text-sm font-cyber font-medium text-white transition-all hover:opacity-90"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Installer l&apos;app
      </button>
    );
  }

  // Fallback - show nothing or a disabled state
  // The prompt may appear later after the browser evaluates criteria
  return null;
}
