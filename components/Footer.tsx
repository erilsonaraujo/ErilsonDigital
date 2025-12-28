import React from 'react';
import { Github, Linkedin, Mail, Phone, Instagram, MessageCircle } from 'lucide-react';
import { GITHUB_URL, LINKEDIN_URL, EMAIL_ADDRESS, WHATSAPP_NUMBER, DISCORD_URL, INSTAGRAM_URL } from '@/constants';

const Footer = () => {
    return (
        <footer className="bg-dark-900 border-t border-dark-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">

                    <div className="max-w-xs">
                        <span className="text-2xl font-display font-bold text-white">Erilson<span className="text-primary-500">.</span></span>
                        <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                            Desenvolvimento Full-Stack focado em resolver problemas de negócio com código limpo, seguro e escalável. Java & Python.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider">Contato Direto</h4>
                        <div className="flex flex-col gap-2 text-sm text-slate-400">
                            <a href={`mailto:${EMAIL_ADDRESS}`} className="hover:text-primary-500 transition-colors flex items-center gap-2">
                                <Mail className="w-4 h-4" /> {EMAIL_ADDRESS}
                            </a>
                            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors flex items-center gap-2">
                                <Phone className="w-4 h-4" /> +55 84 99434-9355
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider">Redes & Código</h4>
                        <div className="flex space-x-4">
                            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all transform hover:-translate-y-1">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all transform hover:-translate-y-1">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1">
                                <MessageCircle className="h-5 w-5" />
                            </a>
                            <a href={`mailto:${EMAIL_ADDRESS}`} className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all transform hover:-translate-y-1">
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-dark-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Erilson Digital. Todos os direitos reservados.</p>
                    <p className="mt-2 md:mt-0">Feito com React, Next.js, Tailwind & Supabase.</p>
                    <div className="mt-4 md:mt-0 flex gap-4">
                        <a href="/legal/privacidade" className="hover:text-primary-500">Privacidade</a>
                        <a href="/legal/termos" className="hover:text-primary-500">Termos</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
