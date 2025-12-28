'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, Clock, User, ChevronRight } from 'lucide-react';

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
            }
        } catch (err) {
            console.error('Fetch conversations error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-slate-500">Carregando conversas...</div>;

    return (
        <div className="p-8 h-full flex flex-col">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Relatórios da Sofia</h1>
                <p className="text-slate-500 dark:text-slate-400">Histórico de interações da IA com potenciais leads.</p>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden min-h-0">
                {/* List */}
                <div className="lg:col-span-1 bg-white dark:bg-dark-900 rounded-2xl border border-slate-200 dark:border-dark-800 overflow-y-auto shadow-sm">
                    <div className="divide-y divide-slate-100 dark:divide-dark-800">
                        {conversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => setSelectedConv(conv)}
                                className={`w-full text-left p-6 hover:bg-slate-50 dark:hover:bg-dark-800 transition-all flex justify-between items-center group ${selectedConv?.id === conv.id ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                                    }`}
                            >
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                                            {conv.visitor_name || conv.visitor_id.substring(0, 8)}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            {new Date(conv.created_at).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate pr-4">
                                        {conv.summary || 'Ver transcrição completa'}
                                    </p>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-slate-300 transition-transform ${selectedConv?.id === conv.id ? 'translate-x-1 text-primary-500' : ''}`} />
                            </button>
                        ))}
                    </div>
                    {conversations.length === 0 && (
                        <div className="p-12 text-center text-slate-500">Nenhuma conversa registrada.</div>
                    )}
                </div>

                {/* Details */}
                <div className="lg:col-span-2 bg-white dark:bg-dark-900 rounded-2xl border border-slate-200 dark:border-dark-800 flex flex-col shadow-sm overflow-hidden">
                    {selectedConv ? (
                        <>
                            <div className="p-6 border-b border-slate-100 dark:border-dark-800">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                            {selectedConv.visitor_name || 'Visitante Anônimo'}
                                        </h3>
                                        <p className="text-sm text-slate-500">{selectedConv.visitor_email || 'E-mail não informado'}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-dark-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-dark-700">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Data</span>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {new Date(selectedConv.created_at).toLocaleString('pt-BR')}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <User className="w-3.5 h-3.5" />
                                        <span>ID: {selectedConv.visitor_id}</span>
                                    </div>
                                    {selectedConv.visitor_phone && (
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            <span>{selectedConv.visitor_phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50 dark:bg-dark-950/50">
                                {selectedConv.transcript.map((msg: any, i: number) => (
                                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-1.5 px-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                {msg.role === 'user' ? 'Usuário' : 'Sofia'}
                                            </span>
                                        </div>
                                        <div className={`p-4 rounded-2xl text-sm max-w-[85%] border shadow-sm ${msg.role === 'user'
                                                ? 'bg-white dark:bg-dark-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-dark-700 rounded-tr-none'
                                                : 'bg-primary-600 text-white border-primary-500 rounded-tl-none font-medium'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12">
                            <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
                            <p className="text-lg font-medium">Selecione uma conversa para ver os detalhes</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConversationsView;
