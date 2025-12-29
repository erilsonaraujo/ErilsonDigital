'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, ChevronRight, User, Clock } from 'lucide-react';

interface Conversation {
  id: number;
  visitor_id: string;
  visitor_name?: string;
  visitor_email?: string;
  visitor_phone?: string;
  transcript: any[];
  summary?: string;
  created_at: string;
}

const ConversationsView: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      const data = await response.json();
      if (response.ok) {
        setConversations(data.conversations || []);
        if (!selectedConv && data.conversations?.length) {
          setSelectedConv(data.conversations[0]);
        }
      }
    } catch (err) {
      console.error('Fetch conversations error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-graphite-400">Carregando conversas...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
      <div className="rounded-[24px] border border-graphite-800 bg-ink-900/70 shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-graphite-800 flex items-center gap-3">
          <MessageSquare size={18} className="text-tide-300" />
          <div>
            <p className="text-sm font-semibold text-white">Conversas da Sofia</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">IA reports</p>
          </div>
        </div>
        <div className="max-h-[520px] overflow-y-auto divide-y divide-graphite-800">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConv(conv)}
              className={`w-full text-left px-6 py-4 flex items-center justify-between transition-colors ${selectedConv?.id === conv.id ? 'bg-ink-950/60' : 'hover:bg-ink-950/40'}`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">
                  {conv.visitor_name || conv.visitor_email || conv.visitor_id.slice(0, 8)}
                </span>
                <span className="text-xs text-graphite-400">{conv.summary || 'Sem resumo'}</span>
              </div>
              <ChevronRight size={16} className="text-graphite-500" />
            </button>
          ))}
          {conversations.length === 0 && (
            <div className="p-10 text-center text-graphite-500">Nenhuma conversa registrada.</div>
          )}
        </div>
      </div>

      <div className="rounded-[24px] border border-graphite-800 bg-ink-900/70 shadow-xl flex flex-col overflow-hidden">
        {selectedConv ? (
          <>
            <div className="px-6 py-5 border-b border-graphite-800 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{selectedConv.visitor_name || 'Visitante'}</p>
                <p className="text-xs text-graphite-400">{selectedConv.visitor_email || 'Email nao informado'}</p>
                {selectedConv.visitor_phone && (
                  <p className="text-xs text-graphite-400 mt-1">{selectedConv.visitor_phone}</p>
                )}
              </div>
              <div className="text-right text-xs text-graphite-500">
                <div className="flex items-center gap-2 justify-end">
                  <Clock size={14} />
                  {new Date(selectedConv.created_at).toLocaleString('pt-BR')}
                </div>
                <div className="flex items-center gap-2 justify-end mt-2">
                  <User size={14} />
                  {selectedConv.visitor_id.slice(0, 10)}
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[520px]">
              {selectedConv.transcript.map((msg: any, index: number) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user'
                    ? 'bg-ink-950/80 border border-graphite-800 text-graphite-200'
                    : 'bg-cobalt-500/10 border border-cobalt-400/40 text-white'}
                  `}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-graphite-500 p-12">
            Selecione uma conversa para visualizar.
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsView;
