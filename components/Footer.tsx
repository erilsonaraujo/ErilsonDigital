import React from 'react';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { GITHUB_URL, LINKEDIN_URL, EMAIL_ADDRESS, WHATSAPP_NUMBER } from '@/constants';

const Footer = () => {
    return (
        <footer className="bg-ink-950 border-t border-graphite-800 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr_0.8fr] gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cobalt-400 to-tide-400 text-ink-950 flex items-center justify-center font-semibold">
                                ED
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-[0.3em] text-graphite-500">Erilson Digital</p>
                                <p className="text-lg text-graphite-900 font-semibold">Engenharia Premium</p>
                            </div>
                        </div>
                        <p className="text-sm text-graphite-300 leading-relaxed">
                            Consultoria boutique para software, IA e produto. Arquitetura segura, execucao precisa e entregas de alto impacto.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Contato direto</p>
                        <div className="space-y-3 text-sm text-graphite-300">
                            <a href={`mailto:${EMAIL_ADDRESS}`} className="flex items-center gap-2 hover:text-graphite-900">
                                <Mail className="w-4 h-4" /> {EMAIL_ADDRESS}
                            </a>
                            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-graphite-900">
                                <Phone className="w-4 h-4" /> +55 84 99434-9355
                            </a>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Presenca</p>
                        <div className="flex gap-3">
                            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full border border-graphite-700 text-graphite-300 flex items-center justify-center hover:border-graphite-500 hover:text-graphite-900">
                                <Linkedin className="h-4 w-4" />
                            </a>
                            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full border border-graphite-700 text-graphite-300 flex items-center justify-center hover:border-graphite-500 hover:text-graphite-900">
                                <Github className="h-4 w-4" />
                            </a>
                            <a href={`mailto:${EMAIL_ADDRESS}`} className="h-10 w-10 rounded-full border border-graphite-700 text-graphite-300 flex items-center justify-center hover:border-graphite-500 hover:text-graphite-900">
                                <Mail className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-graphite-800 flex flex-col md:flex-row justify-between items-center text-xs text-graphite-500 gap-4">
                    <p>&copy; {new Date().getFullYear()} Erilson Digital. Todos os direitos reservados.</p>
                    <div className="flex flex-wrap gap-4">
                        <a href="/legal/privacidade" className="hover:text-graphite-900">Privacidade</a>
                        <a href="/legal/cookies" className="hover:text-graphite-900">Cookies</a>
                        <a href="/legal/termos" className="hover:text-graphite-900">Termos</a>
                        <a href="/legal/seguranca" className="hover:text-graphite-900">Seguranca</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
