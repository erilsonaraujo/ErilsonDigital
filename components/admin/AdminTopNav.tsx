'use client';

import React from 'react';
import {
    LayoutDashboard,
    Users,
    Calendar,
    BarChart3,
    MessageSquare,
    Globe,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import Link from 'next/link';

interface AdminTopNavProps {
    activeView: string;
    onViewChange: (view: string) => void;
    onLogout: () => void;
}

const AdminTopNav: React.FC<AdminTopNavProps> = ({ activeView, onViewChange, onLogout }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const navItems = [
        { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
        { id: 'leads', label: 'Leads', icon: Users },
        { id: 'appointments', label: 'Agendamentos', icon: Calendar },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'conversations', label: 'Conversas IA', icon: MessageSquare },
        { id: 'settings', label: 'Pixels', icon: Globe },
    ];

    return (
        <nav className="bg-slate-900 border-b border-white/10 sticky top-0 z-[100] w-full isolate">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20 text-white">
                            <span className="font-black text-xl">E</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-white font-black text-lg tracking-tight leading-none">Admin</h1>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Erilson Digital</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onViewChange(item.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeView === item.id
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            target="_blank"
                            className="hidden md:flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:border-white/20 transition-all"
                        >
                            <Globe size={14} />
                            Ver Site
                        </Link>
                        <button
                            onClick={onLogout}
                            className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            title="Sair"
                        >
                            <LogOut size={20} />
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2.5 bg-white/5 text-white rounded-xl active:scale-95 transition-transform"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-slate-900 border-t border-white/5 p-4 space-y-2 animate-in slide-in-from-top duration-300 absolute w-full left-0 shadow-2xl">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                onViewChange(item.id);
                                setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-base font-bold transition-all ${activeView === item.id
                                    ? 'bg-primary-600 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                    <Link
                        href="/"
                        target="_blank"
                        className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-base font-bold text-slate-400 border border-white/5"
                    >
                        <Globe size={20} />
                        Ver Site Principal
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default AdminTopNav;
