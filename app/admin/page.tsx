'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Users, Calendar, Settings, LogOut } from 'lucide-react';

export default function AdminPage() {
    const [session, setSession] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('leads');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-dark-950">
                <div className="bg-white dark:bg-dark-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-dark-800">
                    <h1 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-white">Admin Login</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 rounded-lg border border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 rounded-lg border border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 dark:text-white"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950 flex pt-16">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-dark-900 border-r border-slate-200 dark:border-dark-800 h-[calc(100vh-4rem)] sticky top-16 hidden md:block">
                <div className="p-6">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Gerenciamento</h2>
                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab('leads')}
                            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'leads' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800'}`}
                        >
                            <Users className="w-5 h-5" /> Leads
                        </button>
                        <button
                            onClick={() => setActiveTab('appointments')}
                            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'appointments' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800'}`}
                        >
                            <Calendar className="w-5 h-5" /> Agendamentos
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800'}`}
                        >
                            <Settings className="w-5 h-5" /> Configurações
                        </button>
                    </nav>
                </div>

                <div className="absolute bottom-0 w-full p-6 border-t border-slate-200 dark:border-dark-800">
                    <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 hover:text-red-600 transition-colors w-full">
                        <LogOut className="w-5 h-5" /> Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-4rem)]">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalized">{activeTab}</h1>
                </header>

                {activeTab === 'leads' && (
                    <div className="bg-white dark:bg-dark-900 rounded-xl shadow-sm border border-slate-200 dark:border-dark-800 p-8 text-center text-slate-500">
                        <p>Nenhum lead encontrado ainda (Integrar com Supabase `leads` table).</p>
                        {/* Here we would map through generated leads fetched via supabase.from('leads').select('*') */}
                        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg text-left">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                <strong>Nota:</strong> Para ver dados reais, execute o script SQL de migração no painel do Supabase e conecte o formulário de contato.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div className="bg-white dark:bg-dark-900 rounded-xl shadow-sm border border-slate-200 dark:border-dark-800 p-8 text-center text-slate-500">
                        <p>Agenda vazia.</p>
                        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg text-left">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                <strong>Nota:</strong> Os agendamentos feitos na página /agendar aparecerão aqui após conectar com o banco.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="bg-white dark:bg-dark-900 rounded-xl shadow-sm border border-slate-200 dark:border-dark-800 p-8">
                        <h3 className="font-bold text-lg mb-4 dark:text-white">Analytics & Pixels</h3>
                        <div className="space-y-4 max-w-lg">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Google Tag Manager ID</label>
                                <input type="text" placeholder="GTM-XXXXXX" className="w-full p-2 border rounded dark:bg-dark-800 dark:border-dark-700" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Meta Pixel ID</label>
                                <input type="text" placeholder="1234567890" className="w-full p-2 border rounded dark:bg-dark-800 dark:border-dark-700" />
                            </div>
                            <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg font-bold">Salvar</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
