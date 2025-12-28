import { Metadata } from 'next';
import { Code2, Briefcase, Award, Target, Heart, Zap, Shield, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Sobre Mim | Erilson Digital',
    description: 'Desenvolvedor Full Stack especializado em IA e automação. Transformando ideias em soluções digitais de alto impacto.',
};

export default function AboutPage() {
    const skills = [
        { name: 'React & Next.js', level: 95 },
        { name: 'Node.js & Python', level: 90 },
        { name: 'IA & Machine Learning', level: 85 },
        { name: 'Cloud & DevOps', level: 88 },
    ];

    const values = [
        { icon: Shield, title: 'Segurança', desc: 'Código seguro e confiável' },
        { icon: Zap, title: 'Performance', desc: 'Otimização em cada detalhe' },
        { icon: Heart, title: 'Dedicação', desc: 'Comprometimento total' },
        { icon: TrendingUp, title: 'Resultados', desc: 'Foco em ROI e crescimento' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950">
            {/* Hero */}
            <section className="pt-32 pb-20 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-dark-950 dark:to-dark-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Olá, sou <span className="text-primary-400">Erilson Araújo</span>
                            </h1>
                            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                                Desenvolvedor Full Stack especializado em criar soluções digitais que transformam negócios.
                                Com experiência em IA, automação e desenvolvimento web, ajudo empresas a alcançarem seus objetivos através da tecnologia.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/contato"
                                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-all shadow-lg"
                                >
                                    Fale Comigo
                                </Link>
                                <Link
                                    href="/agendar"
                                    className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-lg transition-all shadow-lg"
                                >
                                    Agendar Reunião
                                </Link>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-64 h-64 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-2xl">
                                <Code2 className="w-32 h-32 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                                Minha História
                            </h2>
                            <div className="space-y-4 text-slate-600 dark:text-slate-400">
                                <p>
                                    Com formação em Direito e paixão por tecnologia, encontrei na programação a forma perfeita de unir lógica,
                                    criatividade e solução de problemas. Essa combinação única me permite entender profundamente as necessidades
                                    dos clientes e criar soluções que realmente fazem diferença.
                                </p>
                                <p>
                                    Especializado em desenvolvimento Full Stack, trabalho com as tecnologias mais modernas do mercado:
                                    React, Next.js, Node.js, Python e ferramentas de IA. Meu foco está em criar aplicações web robustas,
                                    escaláveis e que entreguem resultados mensuráveis.
                                </p>
                                <p>
                                    Acredito que tecnologia deve ser acessível e trazer retorno real para os negócios. Por isso,
                                    cada projeto que desenvolvo é pensado estrategicamente para maximizar o ROI e impulsionar o crescimento.
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                                Habilidades Técnicas
                            </h2>
                            <div className="space-y-6">
                                {skills.map((skill) => (
                                    <div key={skill.name}>
                                        <div className="flex justify-between mb-2">
                                            <span className="font-medium text-slate-900 dark:text-white">{skill.name}</span>
                                            <span className="text-slate-600 dark:text-slate-400">{skill.level}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-dark-800 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-primary-600 to-primary-500 h-3 rounded-full transition-all duration-1000"
                                                style={{ width: `${skill.level}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-white dark:bg-dark-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                            Meus Valores
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Princípios que guiam cada projeto e decisão técnica
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value) => (
                            <div key={value.title} className="text-center p-6 rounded-xl border border-slate-200 dark:border-dark-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all">
                                <div className="inline-flex p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                                    <value.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{value.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                        Pronto para Começar seu Projeto?
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
                        Vamos conversar sobre como posso ajudar a transformar suas ideias em realidade.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            href="/contato"
                            className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-all shadow-lg"
                        >
                            Entrar em Contato
                        </Link>
                        <Link
                            href="/servicos"
                            className="px-8 py-4 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-lg transition-all shadow-lg"
                        >
                            Ver Serviços
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
