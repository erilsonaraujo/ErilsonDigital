'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '@/constants';

const Projects: React.FC = () => {
    return (
        <section id="portfolio" className="py-24 bg-ink-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between gap-10 mb-16">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Cases estrategicos</p>
                        <h2 className="section-title mt-4">Resultados reais, engenharia com impacto.</h2>
                    </div>
                    <p className="section-lead max-w-xl">
                        Cada caso representa uma solucao critica em producao: sistemas financeiros, IA para operacoes e plataformas que exigem escala.
                        O foco e sempre ROI, seguranca e confianca.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {PROJECTS.slice(0, 4).map((project) => (
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
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">Desafio</p>
                                        <p className="text-sm text-graphite-200">{project.problem}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">Solucao</p>
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
                                            Ver projeto <ArrowUpRight size={16} />
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
