'use client';

import React, { useState, useEffect } from 'react';
import { LogOut, AlertCircle, Users, Calendar, CheckCircle, Clock } from 'lucide-react';
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
            if (response.ok) setAuthenticated(true);
            else {
                const data = await response.json();
                setError(data.error || 'Erro ao fazer login');
            }
        } catch (err) {
            setError('Erro ao conectar com o servidor');
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
        const response = await fetch('/api/leads');
        const data = await response.json();
        if (response.ok) setLeads(data.leads || []);
    };

    const fetchAppointments = async () => {
        const response = await fetch('/api/appointments');
        const data = await response.json();
        if (response.ok) setAppointments(data.appointments || []);
    };

    if (loading) return null;

    if (!authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950 p-6">
                <div className="bg-white dark:bg-dark-900 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-dark-800">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Admin Login</h1>
                        <p className="text-sm text-slate-500 mt-2">Bem-vindo de volta ao centro de comando.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <p className="text-xs text-red-600 dark:text-red-400 font-medium leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl transition-all shadow-xl hover:shadow-2xl active:scale-95 disabled:opacity-50 mt-4"
                        >
                            {loginLoading ? 'Processando...' : 'Acessar Painel'}
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
                <div className="p-8">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Leads</h1>
                        <p className="text-slate-500 dark:text-slate-400">Contatos recebidos via formulários oficiais.</p>
                    </header>
                    <div className="bg-white dark:bg-dark-900 rounded-2xl border border-slate-200 dark:border-dark-800 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-dark-800/50 border-b border-slate-200 dark:border-dark-800">
                                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Lead</th>
                                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Mensagem</th>
                                    <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Data</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                                {leads.map(lead => (
                                    <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-dark-800/50 transition-colors">
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white capitalize">{lead.name}</span>
                                                <span className="text-xs text-slate-500">{lead.email}</span>
                                                {lead.phone && <span className="text-[10px] text-primary-500 mt-1 font-bold">{lead.phone}</span>}
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 max-w-md">{lead.message || '-'}</p>
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {leads.length === 0 && <div className="p-12 text-center text-slate-500">Nenhum lead encontrado.</div>}
                    </div>
                </div>
            );
            case 'appointments': return (
                <div className="p-8">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Agendamentos</h1>
                        <p className="text-slate-500 dark:text-slate-400">Solicitações de consultoria e reuniões.</p>
                    </header>
                    <div className="bg-white dark:bg-dark-900 rounded-2xl border border-slate-200 dark:border-dark-800 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-dark-800/50 border-b border-slate-200 dark:border-dark-800">
                                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Cliente</th>
                                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Serviço/Data</th>
                                    <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                                {appointments.map(apt => (
                                    <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-dark-800/50 transition-colors">
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white capitalize">{apt.name}</span>
                                                <span className="text-xs text-slate-500">{apt.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{apt.service || 'Consultoria'}</span>
                                                <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(apt.preferred_date!).toLocaleDateString('pt-BR')} às {apt.preferred_time}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest ${apt.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                    apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                        'bg-slate-100 text-slate-500 dark:bg-dark-800'
                                                }`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {appointments.length === 0 && <div className="p-12 text-center text-slate-500">Nenhum agendamento encontrado.</div>}
                    </div>
                </div>
            );
            default: return <DashboardHome />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950">
            <Sidebar
                activeView={activeView}
                onViewChange={setActiveView}
                onLogout={handleLogout}
            />
            <main className="pl-64 min-h-screen">
                {renderContent()}
            </main>
        </div>
    );
}
