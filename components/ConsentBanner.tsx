'use client';

import React, { useEffect, useState } from 'react';

const CONSENT_KEY = 'erilson_analytics_consent';

const ConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleChoice = (value: 'granted' | 'denied') => {
    localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[min(96%,720px)] -translate-x-1/2 rounded-[28px] border border-graphite-800 bg-ink-900/90 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Consentimento de analytics</p>
          <p className="text-xs text-graphite-400 mt-1">
            Usamos analytics para melhorar sua experiencia. Voce pode aceitar ou recusar.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleChoice('denied')}
            className="rounded-full border border-graphite-700 px-4 py-2 text-xs text-graphite-300 hover:border-graphite-500 hover:text-white"
          >
            Recusar
          </button>
          <button
            onClick={() => handleChoice('granted')}
            className="rounded-full bg-cobalt-500 px-4 py-2 text-xs font-semibold text-white hover:bg-cobalt-400"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
