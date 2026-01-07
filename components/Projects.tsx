'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { FEATURED_PROJECTS_BY_LANG, TRANSLATIONS } from '@/constants';
import { useThemeLanguage } from '@/contexts/ThemeLanguageContext';

const Projects: React.FC = () => {
    const { language } = useThemeLanguage();
    const t = TRANSLATIONS[language];
    const projects = FEATURED_PROJECTS_BY_LANG[language];
    return (
        <section id="portfolio" className="py-24 bg-ink-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between gap-10 mb-16">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">{t.nav.cases}</p>
                        <h2 className="section-title mt-4">{t.projects.title}</h2>
                    </div>
                    <p className="section-lead max-w-xl">
                        {t.projects.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="lg:col-span-2 mb-8">
                        <h3 className="text-xl font-semibold text-white border-b border-graphite-800 pb-4 mb-8">
                            Para clínicas: exemplos de entregáveis (demo)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "Esteira de WhatsApp + Triagem",
                                    label: "Projeto demonstrativo",
                                    desc: "Automação que qualifica o lead antes dele falar com a secretária.",
                                    metric: "+40% leads qualificados"
                                },
                                {
                                    title: "Landing Premium Implante",
                                    label: "Projeto demonstrativo",
                                    desc: "Página de alta conversão focada em procedimento high-ticket.",
                                    metric: "ROI estimado 5x"
                                },
                                {
                                    title: "Sistema Anti No-Show",
                                    label: "Projeto demonstrativo",
                                    desc: "Régua de lembretes e confirmação automática de presença.",
                                    metric: "-30% faltas"
                                }
                            ].map((demo) => (
                                <div key={demo.title} className="rounded-2xl border border-graphite-800 bg-ink-950/50 p-6 hover:border-graphite-600 transition-colors">
                                    <span className="text-[10px] uppercase tracking-widest text-cobalt-400 font-semibold">{demo.label}</span>
                                    <h4 className="text-lg font-semibold text-white mt-2">{demo.title}</h4>
                                    <p className="text-sm text-graphite-300 mt-2">{demo.desc}</p>
                                    <div className="mt-4 pt-4 border-t border-graphite-800/50 flex items-center gap-2">
                                        <ArrowUpRight size={14} className="text-tide-400" />
                                        <span className="text-xs font-semibold text-tide-300">{demo.metric}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {projects.map((project) => (
                        <div key={project.id} className="group rounded-[28px] border border-graphite-800 bg-ink-900/70 overflow-hidden shadow-xl">
                            <div className="relative h-52">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-transparent" />
                                <div className="absolute bottom-4 left-5">
                                    <p className="text-xs uppercase tracking-[0.3em] text-graphite-300">{project.category}</p>
                                    <h3 className="text-xl text-white font-semibold">{project.title}</h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <p className="text-sm text-graphite-300">{project.summary}</p>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">{t.projects.challenge}</p>
                                        <p className="text-sm text-graphite-200">{project.problem}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">{t.projects.solution}</p>
                                        <p className="text-sm text-graphite-200">{project.solution}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech) => (
                                        <span key={tech} className="rounded-full border border-graphite-700 px-3 py-1 text-[11px] text-graphite-300">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-tide-300">
                                    {project.liveLink && (
                                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                                            {t.projects.viewProject} <ArrowUpRight size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
