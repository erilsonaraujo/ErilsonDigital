'use client';

import React, { useState } from 'react';
import { LayoutDashboard, Users, CalendarCheck2, BarChart3, MessageSquare, Settings, LogOut, Globe, Menu, X, Target, SplitSquareVertical, Users2, FileText, Tag, Flame, Video, Music, FlaskConical, Search, Plug } from 'lucide-react';
import Link from 'next/link';

interface AdminShellProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Visao Geral', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'appointments', label: 'Agendamentos', icon: CalendarCheck2 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'goals', label: 'Metas & Funis', icon: Target },
  { id: 'attribution', label: 'Atribuicao', icon: SplitSquareVertical },
  { id: 'cohorts', label: 'Coortes', icon: Users2 },
  { id: 'reports', label: 'Relatorios', icon: FileText },
  { id: 'tag-manager', label: 'Tag Manager', icon: Tag },
  { id: 'heatmaps', label: 'Heatmaps', icon: Flame },
  { id: 'recordings', label: 'Recordings', icon: Video },
  { id: 'forms', label: 'Forms', icon: FileText },
  { id: 'media', label: 'Media', icon: Music },
  { id: 'experiments', label: 'A/B Testing', icon: FlaskConical },
  { id: 'seo', label: 'SEO Keywords', icon: Search },
  { id: 'integrations', label: 'Integracoes', icon: Plug },
  { id: 'conversations', label: 'Conversas IA', icon: MessageSquare },
  { id: 'settings', label: 'Configuracoes', icon: Settings },
];

const AdminShell: React.FC<AdminShellProps> = ({ activeView, onViewChange, onLogout, title, subtitle, children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const Header = () => (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Admin Console</p>
        <h1 className="text-3xl md:text-4xl font-semibold text-white mt-3">{title}</h1>
        {subtitle && <p className="text-sm text-graphite-400 mt-2">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-full border border-graphite-800 px-4 py-2 text-xs text-graphite-300 hover:border-graphite-500 hover:text-white"
        >
          <Globe size={14} /> Ver site
        </Link>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-full border border-ember-500/40 bg-ember-500/10 px-4 py-2 text-xs text-ember-200 hover:bg-ember-500/20"
        >
          <LogOut size={14} /> Encerrar sessao
        </button>
      </div>
    </div>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-graphite-700/70 bg-ink-900/90">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cobalt-400 to-tide-300 text-ink-950 flex items-center justify-center font-semibold shadow-[0_12px_30px_-16px_rgba(28,201,167,0.8)]">
            ED
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Erilson Digital</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-300">Admin</p>
          </div>
        </div>
      </div>
      <div className="flex-1 px-4 py-6 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                setDrawerOpen(false);
              }}
              className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm border transition-all ${isActive
                ? 'bg-cobalt-500 text-white border-cobalt-300 shadow-[0_18px_30px_-20px_rgba(47,85,255,0.9)]'
                : 'bg-ink-900/70 text-white/80 border-graphite-700/70 hover:text-white hover:bg-ink-800/90 hover:border-graphite-500'}
              `}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-tide-300" />
              )}
              <item.icon size={18} className={isActive ? 'text-white' : 'text-white/70'} />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-950 text-graphite-100">
      <div className="flex">
        <aside className="hidden lg:flex w-[292px] border-r border-graphite-800 bg-gradient-to-b from-ink-900 via-ink-950 to-ink-950">
          <SidebarContent />
        </aside>

        <div className="flex-1 min-h-screen">
          <div className="flex items-center justify-between px-6 py-5 border-b border-graphite-800 bg-ink-950 sticky top-0 z-20">
            <button
              className="lg:hidden h-10 w-10 rounded-full border border-graphite-700 text-graphite-200 flex items-center justify-center"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="hidden lg:block">
              <p className="text-xs uppercase tracking-[0.3em] text-graphite-400">Controle Executivo</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-graphite-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Sessao ativa
              </div>
            </div>
          </div>

          <main className="px-6 py-10 lg:px-10 lg:py-12">
            <Header />
            <div className="mt-10">
              {children}
            </div>
          </main>
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-ink-950 border-r border-graphite-800">
            <div className="flex items-center justify-between px-4 py-4 border-b border-graphite-800">
              <span className="text-sm font-semibold text-white">Menu</span>
              <button
                className="h-9 w-9 rounded-full border border-graphite-700 text-graphite-200 flex items-center justify-center"
                onClick={() => setDrawerOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShell;
