'use client';

import React, { useEffect, useState } from 'react';
import { Music, RefreshCcw } from 'lucide-react';

interface MediaSummary {
  media: string;
  plays: number;
  pauses: number;
  ended: number;
  events: number;
}

const MediaView: React.FC = () => {
  const [media, setMedia] = useState<MediaSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/media');
    const json = await res.json();
    if (res.ok) setMedia(json.media || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Music size={18} className="text-tide-300" />
          <div>
            <h2 className="text-lg font-semibold text-white">Media Analytics</h2>
            <p className="text-xs text-graphite-400">Performance de video e audio.</p>
          </div>
        </div>
        <button
          onClick={loadData}
          className="h-10 w-10 rounded-full border border-graphite-800 text-graphite-300 hover:text-white"
        >
          <RefreshCcw size={16} />
        </button>
      </div>

      {loading && <p className="text-sm text-graphite-400">Carregando midias...</p>}
      {!loading && media.length === 0 && <p className="text-sm text-graphite-500">Sem eventos de midia.</p>}
      <div className="space-y-3">
        {media.map((item) => (
          <div key={item.media} className="rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3 text-sm text-graphite-300">
            <p className="text-white font-semibold">{item.media}</p>
            <div className="mt-2 flex items-center justify-between text-xs text-graphite-400">
              <span>Play: {item.plays}</span>
              <span>Pause: {item.pauses}</span>
              <span>Ended: {item.ended}</span>
              <span>Total: {item.events}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaView;
