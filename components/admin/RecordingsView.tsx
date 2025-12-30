'use client';

import React, { useEffect, useState } from 'react';
import { PlayCircle, RefreshCcw, Video } from 'lucide-react';
import { formatDateTime, formatTime } from '@/lib/date';

interface RecordingItem {
  id: number;
  session_id: string;
  visitor_id: string;
  start_path: string;
  started_at: string;
  ended_at?: string;
  duration_seconds?: number;
}

interface RecordingDetail {
  recording: RecordingItem;
  chunks: { sequence: number; events: any[] }[];
}

const RecordingsView: React.FC = () => {
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [selected, setSelected] = useState<RecordingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRecordings = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/recordings');
    const json = await res.json();
    if (res.ok) setRecordings(json.recordings || []);
    setLoading(false);
  };

  const loadRecording = async (id: number) => {
    const res = await fetch(`/api/admin/recordings/${id}`);
    const json = await res.json();
    if (res.ok) setSelected(json);
  };

  useEffect(() => {
    loadRecordings();
  }, []);

  const events = selected?.chunks?.flatMap((chunk) => chunk.events || []) || [];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-8">
      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Video size={18} className="text-tide-300" />
            <div>
              <h2 className="text-lg font-semibold text-white">Session Recordings</h2>
              <p className="text-xs text-graphite-400">Replays anonimizados por sessao.</p>
            </div>
          </div>
          <button
            onClick={loadRecordings}
            className="h-10 w-10 rounded-full border border-graphite-800 text-graphite-300 hover:text-white"
          >
            <RefreshCcw size={16} />
          </button>
        </div>

        {loading && <p className="text-sm text-graphite-400">Carregando sessoes...</p>}
        {!loading && recordings.length === 0 && <p className="text-sm text-graphite-500">Sem sessoes gravadas.</p>}
        <div className="space-y-3">
          {recordings.map((recording) => (
            <button
              key={recording.id}
              onClick={() => loadRecording(recording.id)}
              className="w-full text-left rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3 text-sm text-graphite-300 hover:border-graphite-500"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">{recording.start_path || '/'} </span>
                <PlayCircle size={16} className="text-graphite-400" />
              </div>
              <div className="mt-1 text-xs text-graphite-500">
                {formatDateTime(recording.started_at)} • {recording.duration_seconds || 0}s
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <PlayCircle size={18} className="text-tide-300" />
          <div>
            <h2 className="text-lg font-semibold text-white">Eventos capturados</h2>
            <p className="text-xs text-graphite-400">Timeline simplificada da sessao.</p>
          </div>
        </div>

        {!selected && <p className="text-sm text-graphite-500">Selecione uma sessao para ver detalhes.</p>}
        {selected && (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {events.map((event, index) => (
              <div key={index} className="rounded-2xl border border-graphite-800 bg-ink-950/50 px-4 py-3 text-sm text-graphite-300">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">{event.type}</span>
                  <span className="text-xs text-graphite-500">{formatTime(event.ts)}</span>
                </div>
                {event.label && <p className="text-xs text-graphite-400 mt-1">Label: {event.label}</p>}
                {event.percent !== undefined && <p className="text-xs text-graphite-400 mt-1">Scroll: {event.percent}%</p>}
              </div>
            ))}
            {events.length === 0 && <p className="text-sm text-graphite-500">Sem eventos capturados.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingsView;
