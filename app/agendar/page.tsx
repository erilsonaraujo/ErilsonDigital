'use client';

import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, User, Mail, Phone, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function BookingPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        preferredDate: '',
        preferredTime: '',
        message: ''
    });

    const services = [
        'Desenvolvimento Web',
        'Automação com IA',
        'Agentes Inteligentes',
        'Consultoria Técnica',
        'Outro'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    service: formData.service,
                    preferred_date: formData.preferredDate,
                    preferred_time: formData.preferredTime,
                    message: formData.message,
                }),
            });

            if (response.ok) {
                setStatus('success');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error('Failed to save appointment', err);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-dark-950 pt-32 pb-20">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <div className="inline-flex p-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-8 animate-bounce">
                        <CheckCircle2 className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Solicitação Recebida!</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                        Muito obrigado pelo interesse, <span className="font-bold text-primary-600">{formData.name.split(' ')[0]}</span>.
                        Já registrei seu pedido de agendamento para o dia <span className="font-bold">{new Date(formData.preferredDate).toLocaleDateString('pt-BR')}</span> às <span className="font-bold">{formData.preferredTime}</span>.
                        Entrarei em contato via e-mail ou WhatsApp em breve para confirmarmos!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary-500/25"
                        >
                            Voltar para o Início
                        </Link>
                        <button
                            onClick={() => setStatus('idle')}
                            className="px-8 py-4 bg-white dark:bg-dark-900 text-slate-700 dark:text-slate-300 font-bold rounded-xl border border-slate-200 dark:border-dark-800 hover:bg-slate-50 transition-all"
                        >
                            Agendar outro horário
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs />
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                        <Calendar className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Agende sua Consultoria
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Preencha os detalhes abaixo para reservar seu horário.
                        Sua solicitação será processada internamente e respondida rapidamente.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-dark-900 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-dark-800 shadow-2xl relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                        {status === 'error' && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                                Ops! Ocorreu um erro ao processar seu agendamento. Por favor, tente novamente ou entre em contato diretamente.
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary-500" />
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                    placeholder="Como prefere ser chamado?"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-primary-500" />
                                    Seu melhor E-mail
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                    placeholder="seu@exemplo.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-primary-500" />
                                    WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="service" className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary-500" />
                                    Serviço de Interesse
                                </label>
                                <select
                                    id="service"
                                    required
                                    value={formData.service}
                                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                    className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none appearance-none"
                                >
                                    <option value="">Selecione um serviço...</option>
                                    {services.map((service) => (
                                        <option key={service} value={service}>{service}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label htmlFor="preferredDate" className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary-500" />
                                    Data Preferida
                                </label>
                                <input
                                    type="date"
                                    id="preferredDate"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.preferredDate}
                                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                                    className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="preferredTime" className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary-500" />
                                    Melhor Período
                                </label>
                                <select
                                    id="preferredTime"
                                    required
                                    value={formData.preferredTime}
                                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                                    className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none appearance-none"
                                >
                                    <option value="">Selecione o turno...</option>
                                    <option value="Manhã (09h - 12h)">Manhã (09h - 12h)</option>
                                    <option value="Tarde (14h - 18h)">Tarde (14h - 18h)</option>
                                    <option value="Noite (19h - 21h)">Noite (19h - 21h)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Mensagem Adicional (opcional)
                            </label>
                            <textarea
                                id="message"
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none resize-none"
                                placeholder="Fale um pouco sobre sua necessidade..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-5 rounded-2xl transition-all shadow-xl hover:shadow-primary-500/25 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                        >
                            {status === 'loading' ? (
                                <>Aguarde...</>
                            ) : (
                                <>Confirmar Minha Solicitação</>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                    <p>Ao solicitar, você concorda com nossos Termos de Uso e Política de Privacidade.</p>
                </div>
            </div>
        </div>
    );
}
