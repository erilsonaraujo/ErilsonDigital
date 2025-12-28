'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MessageCircle, User, Mail, Phone, FileText } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/constants';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function BookingPage() {
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

        // 1. Save to database
        try {
            await fetch('/api/appointments', {
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
        } catch (err) {
            console.error('Failed to save appointment', err);
        }

        // 2. Format message for WhatsApp
        const whatsappMessage = `*🗓️ SOLICITAÇÃO DE AGENDAMENTO*%0A%0A` +
            `*Nome:* ${formData.name}%0A` +
            `*Email:* ${formData.email}%0A` +
            `*Telefone:* ${formData.phone}%0A` +
            `*Serviço:* ${formData.service}%0A` +
            `*Data Preferida:* ${new Date(formData.preferredDate).toLocaleDateString('pt-BR')}%0A` +
            `*Horário Preferido:* ${formData.preferredTime}%0A%0A` +
            `*Mensagem:*%0A${formData.message || 'Não informada'}`;

        // Open WhatsApp with pre-filled message
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs />
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                        <Calendar className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Agende sua Consultoria
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Preencha o formulário abaixo e envie sua solicitação diretamente pelo WhatsApp.
                        Responderei em breve para confirmar o melhor horário!
                    </p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 text-center">
                        <Clock className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">Duração</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">30-60 minutos</p>
                    </div>
                    <div className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 text-center">
                        <MessageCircle className="w-8 h-8 text-[#25D366] mx-auto mb-3" />
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">Via WhatsApp</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Resposta rápida</p>
                    </div>
                    <div className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 text-center">
                        <Calendar className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">Flexível</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Horário comercial</p>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-dark-900 p-8 md:p-12 rounded-2xl border border-slate-200 dark:border-dark-800 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <User className="w-4 h-4 inline mr-2" />
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="Seu nome"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <Mail className="w-4 h-4 inline mr-2" />
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <Phone className="w-4 h-4 inline mr-2" />
                                    Telefone/WhatsApp *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>

                            <div>
                                <label htmlFor="service" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <FileText className="w-4 h-4 inline mr-2" />
                                    Serviço de Interesse *
                                </label>
                                <select
                                    id="service"
                                    required
                                    value={formData.service}
                                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Selecione...</option>
                                    {services.map((service) => (
                                        <option key={service} value={service}>{service}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="preferredDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-2" />
                                    Data Preferida *
                                </label>
                                <input
                                    type="date"
                                    id="preferredDate"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.preferredDate}
                                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="preferredTime" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <Clock className="w-4 h-4 inline mr-2" />
                                    Horário Preferido *
                                </label>
                                <select
                                    id="preferredTime"
                                    required
                                    value={formData.preferredTime}
                                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="09:00">09:00</option>
                                    <option value="10:00">10:00</option>
                                    <option value="11:00">11:00</option>
                                    <option value="14:00">14:00</option>
                                    <option value="15:00">15:00</option>
                                    <option value="16:00">16:00</option>
                                    <option value="17:00">17:00</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Mensagem Adicional (opcional)
                            </label>
                            <textarea
                                id="message"
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                                placeholder="Conte-me um pouco sobre seu projeto ou necessidade..."
                            ></textarea>
                        </div>

                        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                            <p className="text-sm text-primary-800 dark:text-primary-200">
                                <MessageCircle className="w-4 h-4 inline mr-2" />
                                Ao clicar em "Enviar Solicitação", você será redirecionado para o WhatsApp com sua mensagem pré-formatada.
                                Confirmarei o agendamento assim que possível!
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Enviar Solicitação via WhatsApp
                        </button>
                    </form>
                </div>

                {/* Alternative Contact */}
                <div className="mt-8 text-center">
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Prefere falar diretamente?
                    </p>
                    <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Gostaria de agendar uma consultoria.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Iniciar conversa no WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}
