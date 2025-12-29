'use client';

import React from 'react';
import {
    LayoutDashboard,
    Users,
    Calendar,
    BarChart3,
    MessageSquare,
    ShoppingCart,
    LogOut,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
    activeView: string;
    onViewChange: (view: string) => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onLogout }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
        { id: 'leads', label: 'Leads', icon: Users },
        { id: 'appointments', label: 'Agendamentos', icon: Calendar },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'conversations', label: 'Conversas IA', icon: MessageSquare },
        { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart },
    ];

    return (
        <aside className="flex-1 flex flex-col text-slate-300">
            {/* Logo area */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Admin</h2>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Erilson Digital</p>
                </div>
            </div>

            {/* Menu items */}
            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group ${activeView === item.id
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-primary-400 font-bold'}`} />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-white/10 space-y-2">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all"
                >
                    <ExternalLink className="w-5 h-5" />
                    Ver Site
                </Link>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    Sair
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
