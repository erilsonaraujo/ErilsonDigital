'use client';

import React, { useState } from 'react';
import { LayoutDashboard, Users, CalendarCheck2, BarChart3, MessageSquare, Settings, LogOut, Globe, Menu, X } from 'lucide-react';
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
      <div className="px-6 py-6 border-b border-graphite-700 bg-ink-950">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cobalt-500 to-tide-400 text-ink-950 flex items-center justify-center font-semibold">
            ED
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Erilson Digital</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">Admin</p>
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm border transition-all ${isActive
                ? 'bg-cobalt-500 text-white border-cobalt-400 shadow-[0_12px_24px_-16px_rgba(47,85,255,0.9)]'
                : 'text-graphite-200 border-graphite-800 hover:text-white hover:bg-ink-800/80 hover:border-graphite-600'}
              `}
            >
              <item.icon size={18} className={isActive ? 'text-white' : 'text-graphite-300'} />
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
        <aside className="hidden lg:flex w-[280px] border-r border-graphite-800 bg-ink-950/90">
          <SidebarContent />
        </aside>

        <div className="flex-1 min-h-screen">
          <div className="flex items-center justify-between px-6 py-5 border-b border-graphite-800 bg-ink-950/70 sticky top-0 z-20">
            <button
              className="lg:hidden h-10 w-10 rounded-full border border-graphite-700 text-graphite-200 flex items-center justify-center"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="hidden lg:block">
              <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Controle Executivo</p>
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
