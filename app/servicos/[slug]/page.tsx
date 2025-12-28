import React from 'react';
import { SERVICES, WHATSAPP_NUMBER } from '@/constants'; // Adjusted import path
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle, Code2, Cpu, Zap, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

// Generate static params for all services
export async function generateStaticParams() {
    return SERVICES.map((service) => ({
        slug: service.id,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const service = SERVICES.find((s) => s.id === slug);
    if (!service) return { title: 'Serviço Não Encontrado' };

    return {
        title: `${service.title} | Erilson Digital`,
        description: service.description,
    };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const service = SERVICES.find((s) => s.id === slug);

    if (!service) {
        notFound();
    }

    // Expanded content (mock data for now based on service type)
    // Ideally this should come from a richer data source
    const benefits = [
        "Aumento de produtividade imediato",
        "Redução de custos operacionais",
        "Segurança e escalabilidade garantidas",
        "Suporte técnico especializado"
    ];

    const processSteps = [
        { title: "Análise", desc: "Entendemos seu negócio e necessidades." },
        { title: "Design", desc: "Desenhamos a melhor solução técnica." },
        { title: "Desenvolvimento", desc: "Codificação com melhores práticas." },
        { title: "Entrega", desc: "Deploy e treinamento da equipe." }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950">
            {/* Hero Service */}
            <section className="bg-dark-900 border-b border-white/5 py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 blur-3xl -mr-20 -mt-20 rounded-full"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/servicos" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Serviços
                    </Link>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-primary-600/10 rounded-xl border border-primary-600/30 text-primary-500">
                            <service.icon className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">{service.title}</h1>
                    </div>
                    <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
                        {service.description} Transforme a maneira como sua empresa opera com soluções de ponta.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-16">
                            {/* Problem / Solution */}
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Zap className="w-6 h-6 text-yellow-500" /> O Problema
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                    Empresas perdem milhões anualmente com processos manuais, sistemas lentos e falta de inteligência de dados.
                                    Se você sente que sua operação está travada ou que poderia vender mais com a tecnologia certa, nós temos a solução.
                                </p>

                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <CheckCircle className="w-6 h-6 text-green-500" /> A Solução
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Implementamos {service.title} com foco total em ROI. Nossa abordagem não é apenas entregar código,
                                    mas entregar um ativo digital que trabalha pela sua empresa 24 horas por dia.
                                </p>
                            </div>

                            {/* Process */}
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Nosso Processo</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {processSteps.map((step, idx) => (
                                        <div key={idx} className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800">
                                            <span className="text-4xl font-bold text-slate-100 dark:text-dark-800 block mb-2">0{idx + 1}</span>
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Cpu className="w-6 h-6 text-primary-500" /> Tecnologias
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {['React', 'Next.js', 'Node.js', 'Python', 'AI / LLMs', 'Supabase', 'AWS'].map(tech => (
                                        <span key={tech} className="px-4 py-2 bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-dark-900 p-8 rounded-2xl border border-slate-200 dark:border-dark-800 shadow-xl sticky top-24">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Por que escolher?</h3>
                                <ul className="space-y-4 mb-8">
                                    {benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-slate-600 dark:text-slate-400">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Tenho interesse em ${encodeURIComponent(service.title)}.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-[#25D366] hover:bg-[#128C7E] text-white text-center font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl mb-4 flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Falar no WhatsApp
                                </a>
                                <Link
                                    href="/agendar"
                                    className="block w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-center font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl mb-4"
                                >
                                    Agendar Consultoria
                                </Link>
                                <p className="text-xs text-center text-slate-400">
                                    Resposta rápida em horário comercial.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Bottom */}
            <section className="py-20 bg-primary-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Pronto para escalar seu negócio?</h2>
                    <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
                        Não deixe para depois. A tecnologia avança rápido e sua empresa precisa acompanhar.
                    </p>
                    <Link href="/contact" className="inline-block bg-white text-primary-600 font-bold py-4 px-10 rounded-full hover:bg-slate-100 transition-all shadow-xl">
                        Solicitar Orçamento
                    </Link>
                </div>
            </section>
        </div>
    );
}
