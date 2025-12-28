'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, User, MessageCircle } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error('Submit lead error:', err);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-dark-950 pt-32 pb-20">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <div className="inline-flex p-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-8 animate-in zoom-in duration-500">
                        <CheckCircle2 className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Mensagem Enviada!</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                        Obrigado pelo contato, <span className="font-bold text-primary-600">{formData.name}</span>.
                        Sua mensagem foi entregue com sucesso e responderei o mais rápido possível para o e-mail informado.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-primary-500/25"
                    >
                        Voltar para Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs />

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Vamos Conversar?
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Estou pronto para transformar suas ideias em realidade digital.
                        Envie uma mensagem e retornarei em breve.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Info */}
                    <div className="bg-slate-900 dark:bg-dark-900 p-8 md:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary-600/20 transition-all duration-700"></div>

                        <h2 className="text-2xl font-bold mb-8 relative z-10">Informações de Contato</h2>
                        <div className="space-y-8 relative z-10">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-xl">
                                    <Mail className="w-6 h-6 text-primary-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">E-mail</p>
                                    <a href="mailto:joseerilsonaraujo@gmail.com" className="text-lg hover:text-primary-400 transition-colors font-medium">joseerilsonaraujo@gmail.com</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-xl">
                                    <Phone className="w-6 h-6 text-primary-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">WhatsApp</p>
                                    <p className="text-lg font-medium">+55 88 9 9452-4753</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-xl">
                                    <MapPin className="w-6 h-6 text-primary-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Localização</p>
                                    <p className="text-lg font-medium text-slate-300 italic">Estratégico no Digital, presente em todo o Brasil.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-12 border-t border-white/10 relative z-10">
                            <p className="text-slate-400 mb-6 font-medium">Siga meu trabalho:</p>
                            <div className="flex gap-4">
                                {/* Placeholders for social icons */}
                                <div className="p-3 bg-white/10 rounded-full hover:bg-primary-600 transition-all cursor-pointer"><MessageCircle className="w-5 h-5" /></div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white dark:bg-dark-900 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-dark-800 shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status === 'error' && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                                    Erro ao enviar sua mensagem. Por favor, tente novamente.
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Nome Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                    placeholder="Como prefere ser chamado?"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">E-mail Corporativo</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                    placeholder="seu@exemplo.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Assunto / Necessidade</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none resize-none"
                                    placeholder="Descreva seu projeto ou objetivo..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-5 rounded-2xl transition-all shadow-xl hover:shadow-primary-500/25 active:scale-95 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Enviando...' : (
                                    <>
                                        Enviar Mensagem
                                        <Send className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
