'use client';

import React, { useState, useEffect } from 'react';
import { LogOut, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import DashboardHome from '@/components/admin/DashboardHome';
import AnalyticsView from '@/components/admin/AnalyticsView';
import ConversationsView from '@/components/admin/ConversationsView';

interface Lead {
    id: number;
    name: string;
    email: string;
    phone?: string;
    message?: string;
    source?: string;
    created_at: string;
}

interface Appointment {
    id: number;
    name: string;
    email: string;
    phone?: string;
    service?: string;
    preferred_date?: string;
    preferred_time?: string;
    message?: string;
    status: string;
    created_at: string;
}

export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [loginLoading, setLoginLoading] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        checkSession();
    }, []);

    useEffect(() => {
        if (authenticated) {
            if (activeView === 'leads') fetchLeads();
            if (activeView === 'appointments') fetchAppointments();
        }
    }, [authenticated, activeView]);

    const checkSession = async () => {
        try {
            const response = await fetch('/api/auth/session');
            const data = await response.json();
            setAuthenticated(data.authenticated);
        } catch (err) {
            setAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                setAuthenticated(true);
            } else {
                const data = await response.json();
                setError(data.error || 'Credenciais inválidas. Tente novamente.');
            }
        } catch (err) {
            setError('Falha na conexão com a central de segurança.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setAuthenticated(false);
        setEmail('');
        setPassword('');
    };

    const fetchLeads = async () => {
        try {
            const response = await fetch('/api/leads');
            const data = await response.json();
            if (response.ok) setLeads(data.leads || []);
        } catch (err) {
            console.error('Leads sync error');
        }
    };

    const fetchAppointments = async () => {
        try {
            const response = await fetch('/api/appointments');
            const data = await response.json();
            if (response.ok) setAppointments(data.appointments || []);
        } catch (err) {
            console.error('Appointments sync error');
        }
    };

    if (loading) return null;

    if (!authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 selection:bg-primary-500/30">
                <div className="bg-dark-900 border border-dark-800 p-10 rounded-[2rem] shadow-2xl w-full max-w-md relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-600/10 blur-[5rem] rounded-full pointer-events-none"></div>

                    <div className="text-center mb-10 relative z-10">
                        <div className="w-20 h-20 bg-primary-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary-500/20 shadow-inner">
                            <CheckCircle className="w-10 h-10 text-primary-500" />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Acesso Restrito</h1>
                        <p className="text-slate-500 font-medium">Painel de Controle Erilson Digital</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-400 font-bold leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Identificação Admin</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-5 rounded-2xl bg-dark-950 border border-dark-800 text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-medium"
                                placeholder="nome@erilsondigital.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Senha de Acesso</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-5 rounded-2xl bg-dark-950 border border-dark-800 text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full bg-white text-slate-900 font-black py-5 rounded-2xl transition-all shadow-xl hover:shadow-white/10 active:scale-[0.97] disabled:opacity-50 text-lg mt-4"
                        >
                            {loginLoading ? 'Validando...' : 'Entrar no Sistema'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard': return <DashboardHome />;
            case 'analytics': return <AnalyticsView />;
            case 'conversations': return <ConversationsView />;
            case 'leads': return (
                <div className="p-8 lg:p-12">
                    <header className="mb-10">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Leads</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium italic">Capturados via formulários do site.</p>
                    </header>
                    <div className="bg-white dark:bg-dark-900 rounded-[2rem] border border-slate-200 dark:border-dark-800 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-dark-800/30 border-b border-slate-200 dark:border-dark-800">
                                    <th className="text-left py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Informações do Lead</th>
                                    <th className="text-left py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Mensagem Transcrita</th>
                                    <th className="text-right py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Data</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                                {leads.map(lead => (
                                    <tr key={lead.id} className="hover:bg-slate-50/80 dark:hover:bg-dark-800/20 transition-colors">
                                        <td className="py-6 px-8">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white text-base mb-1">{lead.name}</span>
                                                <span className="text-xs text-slate-500 font-medium">{lead.email}</span>
                                                {lead.phone && <span className="text-[10px] text-primary-500 font-black mt-2 bg-primary-500/5 px-2 py-0.5 rounded-full w-fit tracking-tighter">{lead.phone}</span>}
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 max-w-sm leading-relaxed">{lead.message || '-'}</p>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {leads.length === 0 && <div className="p-20 text-center text-slate-400 font-medium">Aguardando novos leads...</div>}
                    </div>
                </div>
            );
            case 'appointments': return (
                <div className="p-8 lg:p-12">
                    <header className="mb-10">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Agendamentos</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium italic">Solicitações de consultoria e serviços.</p>
                    </header>
                    <div className="bg-white dark:bg-dark-900 rounded-[2rem] border border-slate-200 dark:border-dark-800 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-dark-800/30 border-b border-slate-200 dark:border-dark-800">
                                    <th className="text-left py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Cliente</th>
                                    <th className="text-left py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Serviço / Data Preferida</th>
                                    <th className="text-right py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                                {appointments.map(apt => (
                                    <tr key={apt.id} className="hover:bg-slate-50/80 dark:hover:bg-dark-800/20 transition-colors">
                                        <td className="py-6 px-8">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white text-base mb-1">{apt.name}</span>
                                                <span className="text-xs text-slate-500 font-medium">{apt.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{apt.service || 'Consultoria'}</span>
                                                <div className="flex items-center gap-2 text-[10px] text-primary-500 font-black mt-2 uppercase tracking-widest bg-primary-500/5 px-2 py-0.5 rounded-full w-fit">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(apt.preferred_date!).toLocaleDateString('pt-BR')} às {apt.preferred_time}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <span className={`inline-block px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] shadow-sm ${apt.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' :
                                                apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' :
                                                    'bg-slate-100 text-slate-500 dark:bg-dark-800'
                                                }`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {appointments.length === 0 && <div className="p-20 text-center text-slate-400 font-medium">Nenhum agendamento pendente.</div>}
                    </div>
                </div>
            );
            default: return <DashboardHome />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950 font-sans flex overflow-hidden">
            {/* Sidebar toggle for mobile */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-[60] p-4 bg-primary-600 text-white rounded-full shadow-2xl active:scale-90 transition-transform"
            >
                <Clock className="w-6 h-6" /> {/* Using Clock as a temporary icon or I should use Menu */}
            </button>

            <div className={`
                fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <Sidebar
                    activeView={activeView}
                    onViewChange={(view) => {
                        setActiveView(view);
                        setSidebarOpen(false);
                    }}
                    onLogout={handleLogout}
                />
            </div>

            <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden relative">
                <div className="max-w-[1600px] mx-auto min-h-full">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}
