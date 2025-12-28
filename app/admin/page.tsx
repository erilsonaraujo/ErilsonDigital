'use client';

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Calendar, LogOut, AlertCircle } from 'lucide-react';

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
    const [activeTab, setActiveTab] = useState('leads');
    const [error, setError] = useState<string | null>(null);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        checkSession();
    }, []);

    useEffect(() => {
        if (authenticated) {
            if (activeTab === 'leads') {
                fetchLeads();
            } else if (activeTab === 'appointments') {
                fetchAppointments();
            }
        }
    }, [authenticated, activeTab]);

    const checkSession = async () => {
        try {
            const response = await fetch('/api/auth/session');
            const data = await response.json();
            setAuthenticated(data.authenticated);
        } catch (err) {
            console.error('Session check error:', err);
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

            const data = await response.json();

            if (response.ok) {
                setAuthenticated(true);
            } else {
                setError(data.error || 'Erro ao fazer login');
            }
        } catch (err) {
            setError('Erro ao conectar com o servidor');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setAuthenticated(false);
            setEmail('');
            setPassword('');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const fetchLeads = async () => {
        try {
            const response = await fetch('/api/leads');
            const data = await response.json();
            if (response.ok) {
                setLeads(data.leads || []);
            }
        } catch (err) {
            console.error('Fetch leads error:', err);
        }
    };

    const fetchAppointments = async () => {
        try {
            const response = await fetch('/api/appointments');
            const data = await response.json();
            if (response.ok) {
                setAppointments(data.appointments || []);
            }
        } catch (err) {
            console.error('Fetch appointments error:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-dark-950">
                <div className="text-slate-600 dark:text-slate-400">Carregando...</div>
            </div>
        );
    }

    if (!authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-dark-950">
                <div className="bg-white dark:bg-dark-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-dark-800">
                    <h1 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-white">Admin Login</h1>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 rounded-lg border border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-900 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 rounded-lg border border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-900 dark:text-white"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                        >
                            {loginLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-dark-950 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Painel Admin</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Sair
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-dark-800">
                    <button
                        onClick={() => setActiveTab('leads')}
                        className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${activeTab === 'leads'
                                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        <Users className="w-5 h-5" />
                        Leads ({leads.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${activeTab === 'appointments'
                                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        <Calendar className="w-5 h-5" />
                        Agendamentos ({appointments.length})
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-lg border border-slate-200 dark:border-dark-800 overflow-hidden">
                    {activeTab === 'leads' && (
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Leads Recebidos</h2>
                            {leads.length === 0 ? (
                                <p className="text-slate-600 dark:text-slate-400">Nenhum lead ainda.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-200 dark:border-dark-800">
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Nome</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Email</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Telefone</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Mensagem</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Data</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leads.map((lead) => (
                                                <tr key={lead.id} className="border-b border-slate-100 dark:border-dark-800 hover:bg-slate-50 dark:hover:bg-dark-800">
                                                    <td className="py-3 px-4 text-sm text-slate-900 dark:text-white">{lead.name}</td>
                                                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{lead.email}</td>
                                                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{lead.phone || '-'}</td>
                                                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{lead.message || '-'}</td>
                                                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                                                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'appointments' && (
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Agendamentos</h2>
                            {appointments.length === 0 ? (
                                <p className="text-slate-600 dark:text-slate-400">Nenhum agendamento ainda.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-200 dark:border-dark-800">
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Nome</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Email</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Serviço</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Data/Hora</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.map((apt) => (
                                                <tr key={apt.id} className="border-b border-slate-100 dark:border-dark-800 hover:bg-slate-50 dark:hover:bg-dark-800">
                                                    <td className="py-3 px-4 text-sm text-slate-900 dark:text-white">{apt.name}</td>
                                                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{apt.email}</td>
                                                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{apt.service || '-'}</td>
                                                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                                                        {apt.preferred_date ? new Date(apt.preferred_date).toLocaleDateString('pt-BR') : '-'} {apt.preferred_time || ''}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                apt.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                                    'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                                                            }`}>
                                                            {apt.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
