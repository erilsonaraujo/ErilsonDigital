import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Sparkles, Target, Workflow } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
    title: 'Sobre | Erilson Digital',
    description: 'Consultoria premium em engenharia, IA e produto digital com foco em ROI, seguranca e escalabilidade.',
};

export default function AboutPage() {
    const highlights = [
        { icon: Target, title: 'Visao estrategica', text: 'Projetos orientados a ROI e crescimento sustentavel.' },
        { icon: ShieldCheck, title: 'Risco sob controle', text: 'Governanca tecnica e mitigacao de vulnerabilidades.' },
        { icon: Workflow, title: 'Execucao precisa', text: 'Processos claros, sprints e comunicacao executiva.' },
        { icon: Sparkles, title: 'Percepcao premium', text: 'Design e engenharia para alto ticket.' },
    ];

    return (
        <div className="min-h-screen bg-ink-950">
            <section className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumbs />
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Sobre o consultor</p>
                            <h1 className="text-4xl md:text-5xl font-semibold text-white mt-4">
                                Engenharia premium com mentalidade de negocio.
                            </h1>
                            <p className="text-lg text-graphite-300 mt-6">
                                Minha formacao hibrida em tecnologia e direito garante visao de risco, contratos e protecao de dados.
                                O resultado sao sistemas robustos que sustentam crescimento e mantem valor percebido alto.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link href="/contato" className="primary-cta">
                                    Iniciar conversa <ArrowUpRight size={16} />
                                </Link>
                                <Link href="/agendar" className="secondary-cta">
                                    Diagnostico estrategico
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-[32px] border border-graphite-800 bg-ink-900/70 p-6">
                            <div className="rounded-[24px] overflow-hidden border border-graphite-800">
                                <Image
                                    src="/erilson.jpg"
                                    alt="Erilson Araujo"
                                    width={600}
                                    height={720}
                                    className="h-[420px] w-full object-cover"
                                    priority
                                />
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-graphite-300">
                                <div className="rounded-2xl border border-graphite-800 bg-ink-950/70 p-4">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">Especialidade</p>
                                    <p className="mt-2 text-graphite-200">IA aplicada e sistemas criticos</p>
                                </div>
                                <div className="rounded-2xl border border-graphite-800 bg-ink-950/70 p-4">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-graphite-500">Posicionamento</p>
                                    <p className="mt-2 text-graphite-200">Projetos de alto ticket</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 border-t border-graphite-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {highlights.map((item) => (
                            <div key={item.title} className="rounded-[24px] border border-graphite-800 bg-ink-900/70 p-6">
                                <div className="h-11 w-11 rounded-xl bg-cobalt-500/10 text-cobalt-300 flex items-center justify-center">
                                    <item.icon size={20} />
                                </div>
                                <h3 className="text-lg font-semibold text-white mt-4">{item.title}</h3>
                                <p className="text-sm text-graphite-300 mt-2">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[32px] border border-graphite-800 bg-ink-900/80 p-10 md:p-14">
                        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Convite</p>
                                <h2 className="text-3xl md:text-4xl font-semibold text-white mt-4">
                                    Vamos construir algo que pareca global desde o primeiro dia.
                                </h2>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/contato" className="primary-cta">
                                    Solicitar proposta <ArrowUpRight size={16} />
                                </Link>
                                <Link href="/portfolio" className="secondary-cta">
                                    Ver resultados
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
