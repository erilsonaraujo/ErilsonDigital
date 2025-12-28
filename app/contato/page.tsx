'use client';

import { Metadata } from 'next';
import { Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react';
import { WHATSAPP_NUMBER, EMAIL_ADDRESS } from '@/constants';

export const metadata: Metadata = {
    title: 'Contato | Erilson Digital',
    description: 'Entre em contato para discutir seu projeto. Atendimento via WhatsApp, Email ou formulário de contato.',
};

export default function ContactPage() {
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Gostaria de conversar sobre um projeto.')}`;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Vamos Conversar?
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Estou pronto para transformar suas ideias em realidade digital. Entre em contato e vamos construir algo incrível juntos.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-dark-900 p-8 rounded-2xl border border-slate-200 dark:border-dark-800 shadow-lg">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                Informações de Contato
                            </h2>

                            <div className="space-y-6">
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors group"
                                >
                                    <div className="p-3 bg-[#25D366]/10 rounded-lg group-hover:bg-[#25D366]/20 transition-colors">
                                        <MessageCircle className="w-6 h-6 text-[#25D366]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">WhatsApp</h3>
                                        <p className="text-slate-600 dark:text-slate-400">+55 (84) 99434-9355</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Resposta rápida em horário comercial</p>
                                    </div>
                                </a>

                                <a
                                    href={`mailto:${EMAIL_ADDRESS}`}
                                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors group"
                                >
                                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                                        <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Email</h3>
                                        <p className="text-slate-600 dark:text-slate-400">{EMAIL_ADDRESS}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Resposta em até 24h</p>
                                    </div>
                                </a>

                                <div className="flex items-start gap-4 p-4">
                                    <div className="p-3 bg-slate-100 dark:bg-dark-800 rounded-lg">
                                        <MapPin className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Localização</h3>
                                        <p className="text-slate-600 dark:text-slate-400">Natal, RN - Brasil</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Atendimento remoto em todo Brasil</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-8 rounded-2xl text-white shadow-xl">
                            <h3 className="text-2xl font-bold mb-4">Prefere falar agora?</h3>
                            <p className="mb-6 text-primary-100">
                                Clique no botão abaixo para iniciar uma conversa no WhatsApp. Estou online e pronto para ajudar!
                            </p>
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-all shadow-lg"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Abrir WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white dark:bg-dark-900 p-8 rounded-2xl border border-slate-200 dark:border-dark-800 shadow-lg">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                            Envie uma Mensagem
                        </h2>

                        <form className="space-y-6" onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const name = formData.get('name');
                            const email = formData.get('email');
                            const phone = formData.get('phone');
                            const message = formData.get('message');

                            const whatsappMessage = `*Nova mensagem do site*%0A%0A*Nome:* ${name}%0A*Email:* ${email}%0A*Telefone:* ${phone}%0A%0A*Mensagem:*%0A${message}`;
                            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`, '_blank');
                        }}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="Seu nome"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="seu@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Telefone (opcional)
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Mensagem *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Conte-me sobre seu projeto..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                                Enviar Mensagem
                            </button>

                            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                                Ao enviar, você será redirecionado para o WhatsApp com sua mensagem pré-formatada.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
