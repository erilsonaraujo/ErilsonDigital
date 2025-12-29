'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import DashboardHome from '@/components/admin/DashboardHome';
import AnalyticsView from '@/components/admin/AnalyticsView';
import ConversationsView from '@/components/admin/ConversationsView';
import SettingsView from '@/components/admin/SettingsView';
import GoalsView from '@/components/admin/GoalsView';
import AttributionView from '@/components/admin/AttributionView';
import CohortsView from '@/components/admin/CohortsView';
import ReportsView from '@/components/admin/ReportsView';
import TagManagerView from '@/components/admin/TagManagerView';
import HeatmapsView from '@/components/admin/HeatmapsView';
import RecordingsView from '@/components/admin/RecordingsView';
import FormsView from '@/components/admin/FormsView';
import MediaView from '@/components/admin/MediaView';
import ExperimentsView from '@/components/admin/ExperimentsView';
import SeoView from '@/components/admin/SeoView';
import IntegrationsView from '@/components/admin/IntegrationsView';
import FormBuilderView from '@/components/admin/FormBuilderView';
import BookingV2View from '@/components/admin/BookingV2View';
import EcommerceView from '@/components/admin/EcommerceView';
import { getRecaptchaToken } from '@/lib/recaptchaClient';

interface Lead {
    id: number;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    project_type?: string;
    budget?: string;
    timeline?: string;
    message?: string;
    source?: string;
    created_at: string;
}

interface Appointment {
    id: number;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    budget?: string;
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
    const [statusUpdating, setStatusUpdating] = useState<number | null>(null);
    const [idleRemainingMs, setIdleRemainingMs] = useState<number>(30 * 60 * 1000);

    useEffect(() => {
        checkSession();
    }, []);

    useEffect(() => {
        if (authenticated) {
            if (activeView === 'leads') fetchLeads();
            if (activeView === 'appointments') fetchAppointments();
        }
    }, [authenticated, activeView]);

    useEffect(() => {
        if (!authenticated) return;
        let lastPing = Date.now();
        let lastActivity = Date.now();
        let idleTimer: number | null = null;
        const idleLimit = 30 * 60 * 1000;
        let countdownTimer: number | null = null;

        const pingSession = async () => {
            const now = Date.now();
            if (now - lastPing < 60_000) return;
            lastPing = now;
            try {
                const response = await fetch('/api/auth/session');
                if (!response.ok) {
                    setAuthenticated(false);
                }
            } catch (err) {
                setAuthenticated(false);
            }
        };

        const resetIdleTimer = () => {
            if (idleTimer) window.clearTimeout(idleTimer);
            if (countdownTimer) window.clearInterval(countdownTimer);
            idleTimer = window.setTimeout(async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                setAuthenticated(false);
                setError('Sessao expirada por inatividade.');
            }, idleLimit);
            countdownTimer = window.setInterval(() => {
                const remaining = Math.max(0, idleLimit - (Date.now() - lastActivity));
                setIdleRemainingMs(remaining);
            }, 1000);
        };

        const handleActivity = () => {
            lastActivity = Date.now();
            pingSession();
            resetIdleTimer();
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('click', handleActivity);

        const interval = window.setInterval(pingSession, 120_000);
        resetIdleTimer();

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('click', handleActivity);
            window.clearInterval(interval);
            if (idleTimer) window.clearTimeout(idleTimer);
            if (countdownTimer) window.clearInterval(countdownTimer);
        };
    }, [authenticated]);

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
            const recaptchaToken = await getRecaptchaToken('admin_login');
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, recaptchaToken }),
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

    const updateAppointmentStatus = async (id: number, status: string) => {
        setStatusUpdating(id);
        try {
            const response = await fetch(`/api/appointments/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (response.ok) {
                const data = await response.json();
                setAppointments((prev) => prev.map((apt) => (apt.id === id ? data.appointment : apt)));
            }
        } catch (err) {
            console.error('Status update failed', err);
        } finally {
            setStatusUpdating(null);
        }
    };

    if (loading) return null;

    if (!authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-ink-950 p-6 selection:bg-cobalt-500/30">
                <div className="relative w-full max-w-lg rounded-[32px] border border-graphite-800 bg-ink-900/80 p-10 shadow-2xl overflow-hidden">
                    <div className="absolute -top-20 -right-10 h-56 w-56 rounded-full bg-cobalt-500/20 blur-[120px]" />
                    <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-tide-500/20 blur-[120px]" />

                    <div className="relative space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cobalt-500 to-tide-400 text-ink-950 flex items-center justify-center font-semibold">
                                ED
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Acesso seguro</p>
                                <h1 className="text-3xl font-semibold text-white">Central Administrativa</h1>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-graphite-800 bg-ink-950/60 p-4 text-xs text-graphite-300">
                            <div className="flex items-center gap-2 text-graphite-200">
                                <ShieldCheck size={16} className="text-tide-300" />
                                Sessao protegida com expiração automática e bloqueio anti-fraude.
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-2xl border border-ember-500/40 bg-ember-500/10 px-4 py-3 text-sm text-ember-200 flex items-center gap-2">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-graphite-500">Email administrativo</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-2xl border border-graphite-800 bg-ink-950/80 px-5 py-4 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                                    placeholder="nome@empresa.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-graphite-500">Senha</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-2xl border border-graphite-800 bg-ink-950/80 px-5 py-4 text-sm text-white focus:border-cobalt-400 focus:outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loginLoading}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-cobalt-500 px-6 py-4 text-sm font-semibold text-white shadow-[0_20px_40px_-24px_rgba(47,85,255,0.8)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-cobalt-400 disabled:opacity-60"
                            >
                                {loginLoading ? 'Validando...' : 'Acessar painel'} <ArrowUpRight size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard': return <DashboardHome />;
            case 'analytics': return <AnalyticsView />;
            case 'forms-v2': return <FormBuilderView />;
            case 'booking-v2': return <BookingV2View />;
            case 'goals': return <GoalsView />;
            case 'attribution': return <AttributionView />;
            case 'cohorts': return <CohortsView />;
            case 'reports': return <ReportsView />;
            case 'tag-manager': return <TagManagerView />;
            case 'heatmaps': return <HeatmapsView />;
            case 'recordings': return <RecordingsView />;
            case 'forms': return <FormsView />;
            case 'media': return <MediaView />;
            case 'experiments': return <ExperimentsView />;
            case 'seo': return <SeoView />;
            case 'integrations': return <IntegrationsView />;
            case 'conversations': return <ConversationsView />;
            case 'ecommerce': return <EcommerceView />;
            case 'settings': return <SettingsView />;
            case 'leads': return (
                <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 shadow-2xl overflow-hidden overflow-x-auto">
                    <div className="px-6 py-5 border-b border-graphite-800 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Leads qualificados</h2>
                            <p className="text-xs text-graphite-400 mt-1">Registros enviados pelos formulários do site.</p>
                        </div>
                    </div>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-ink-950/60 border-b border-graphite-800">
                                    <th className="text-left py-4 px-6 text-[10px] font-semibold text-graphite-500 uppercase tracking-[0.2em]">Lead</th>
                                    <th className="text-left py-4 px-6 text-[10px] font-semibold text-graphite-500 uppercase tracking-[0.2em]">Qualificacao</th>
                                    <th className="text-left py-4 px-6 text-[10px] font-semibold text-graphite-500 uppercase tracking-[0.2em]">Contexto</th>
                                    <th className="text-right py-4 px-6 text-[10px] font-semibold text-graphite-500 uppercase tracking-[0.2em]">Data</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-graphite-800">
                                {leads.map(lead => (
                                    <tr key={lead.id} className="hover:bg-ink-950/50 transition-colors">
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-white text-sm mb-1">{lead.name}</span>
                                                <span className="text-xs text-graphite-400">{lead.email}</span>
                                                {lead.phone && <span className="text-[10px] text-tide-300 font-semibold mt-2 bg-tide-500/10 px-2 py-0.5 rounded-full w-fit tracking-tight">{lead.phone}</span>}
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="text-xs text-graphite-400 space-y-1">
                                                <div>Empresa: <span className="text-graphite-200">{lead.company || '-'}</span></div>
                                                <div>Projeto: <span className="text-graphite-200">{lead.project_type || '-'}</span></div>
                                                <div>Budget: <span className="text-graphite-200">{lead.budget || '-'}</span></div>
                                                <div>Timeline: <span className="text-graphite-200">{lead.timeline || '-'}</span></div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <p className="text-sm text-graphite-300 line-clamp-2 max-w-sm leading-relaxed">{lead.message || '-'}</p>
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <span className="text-sm font-semibold text-white">
                                                {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {leads.length === 0 && <div className="p-16 text-center text-graphite-500">Aguardando novos leads...</div>}
                    </div>
            );
            case 'appointments': return (
                <div className="rounded-[28px] border border-graphite-800 bg-ink-900/70 shadow-2xl overflow-hidden overflow-x-auto">
                    <div className="px-6 py-5 border-b border-graphite-800 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Agenda em andamento</h2>
                            <p className="text-xs text-graphite-400 mt-1">Atualize status conforme o agendamento avanca.</p>
                        </div>
                    </div>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-ink-950/60 border-b border-graphite-800">
                                    <th className="text-left py-4 px-6 text-[10px] font-semibold text-graphite-500 uppercase tracking-[0.2em]">Cliente</th>
                                    <th className="text-left py-4 px-6 text-[10px] font-semibold text-graphite-500 uppercase tracking-[0.2em]">Contexto</th>
                                    <th className="text-right py-4 px-6 text-[10px] font-semibold text-graphite-500 uppercase tracking-[0.2em]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-graphite-800">
                                {appointments.map(apt => (
                                    <tr key={apt.id} className="hover:bg-ink-950/50 transition-colors">
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-white text-sm mb-1">{apt.name}</span>
                                                <span className="text-xs text-graphite-400">{apt.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-graphite-200">{apt.service || 'Consultoria'}</span>
                                                <span className="text-xs text-graphite-400 mt-2">Empresa: {apt.company || '-'}</span>
                                                <span className="text-xs text-graphite-400">Budget: {apt.budget || '-'}</span>
                                                <div className="flex items-center gap-2 text-[10px] text-tide-300 font-semibold mt-2 uppercase tracking-widest bg-tide-500/10 px-2 py-0.5 rounded-full w-fit">
                                                    <Clock className="w-3 h-3" />
                                                    {apt.preferred_date ? new Date(apt.preferred_date).toLocaleDateString('pt-BR') : '-'} às {apt.preferred_time || '-'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <select
                                                    value={apt.status}
                                                    onChange={(e) => updateAppointmentStatus(apt.id, e.target.value)}
                                                    className="rounded-full border border-graphite-700 bg-ink-950/70 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-graphite-200 focus:border-cobalt-400 focus:outline-none"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmado</option>
                                                    <option value="completed">Concluido</option>
                                                    <option value="cancelled">Cancelado</option>
                                                </select>
                                                {statusUpdating === apt.id && (
                                                    <span className="text-xs text-graphite-400">Atualizando...</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {appointments.length === 0 && <div className="p-16 text-center text-graphite-500">Nenhum agendamento pendente.</div>}
                    </div>
            );
            default: return <DashboardHome />;
        }
    };

    const viewMeta: Record<string, { title: string; subtitle: string }> = {
        dashboard: { title: 'Visao geral', subtitle: 'KPIs operacionais, leads e performance do funil.' },
        leads: { title: 'Leads', subtitle: 'Oportunidades qualificadas capturadas.' },
        appointments: { title: 'Agendamentos', subtitle: 'Controle de agenda e status de atendimento.' },
        analytics: { title: 'Analytics', subtitle: 'Inteligencia de trafego com tracking interno.' },
        'forms-v2': { title: 'Forms 2.0', subtitle: 'Construa formularios dinamicos com schema versionado.' },
        'booking-v2': { title: 'Booking 2.0', subtitle: 'Recursos e reservas com motor de disponibilidade.' },
        goals: { title: 'Metas & Funis', subtitle: 'Conversoes personalizadas e jornadas do usuario.' },
        attribution: { title: 'Atribuicao', subtitle: 'Modelos multi-touch e canais de conversao.' },
        cohorts: { title: 'Coortes', subtitle: 'Retencao e recorrencia por janela temporal.' },
        reports: { title: 'Relatorios', subtitle: 'Construtor de relatorios customizados.' },
        'tag-manager': { title: 'Tag Manager', subtitle: 'Controle de tags e disparos por gatilho.' },
        heatmaps: { title: 'Heatmaps', subtitle: 'Mapa de cliques e intensidade por pagina.' },
        recordings: { title: 'Session Recordings', subtitle: 'Replays anonimizados por sessao.' },
        forms: { title: 'Form Analytics', subtitle: 'Conversao e friccao em formularios.' },
        media: { title: 'Media Analytics', subtitle: 'Engajamento em audio e video.' },
        experiments: { title: 'A/B Testing', subtitle: 'Experimentos e conversoes por variante.' },
        seo: { title: 'SEO Keywords', subtitle: 'Palavras-chave e paginas do Search Console.' },
        integrations: { title: 'Integracoes', subtitle: 'API publica e importadores.' },
        conversations: { title: 'Conversas IA', subtitle: 'Interacoes e transcricoes da Sofia.' },
        ecommerce: { title: 'E-commerce', subtitle: 'Catalogo, pedidos, estoque e operacao.' },
        settings: { title: 'Configuracoes', subtitle: 'Pixels, integracoes e governanca.' },
    };

    const current = viewMeta[activeView] || viewMeta.dashboard;

    return (
        <AdminShell
            activeView={activeView}
            onViewChange={setActiveView}
            onLogout={handleLogout}
            title={current.title}
            subtitle={current.subtitle}
            idleRemainingMs={idleRemainingMs}
        >
            {renderContent()}
        </AdminShell>
    );
}
