import { Metadata } from 'next';
import { Code2, Award, Target, Heart, Zap, Shield, TrendingUp, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
    title: 'Sobre Mim | Erilson Digital',
    description: 'Desenvolvedor Full Stack especializado em IA e automação. Transformando ideias em soluções digitais de alto impacto.',
};

export default function AboutPage() {
    const skills = [
        { name: 'React & Next.js', level: 95, color: 'from-blue-500 to-cyan-500' },
        { name: 'Node.js & Python', level: 90, color: 'from-green-500 to-emerald-500' },
        { name: 'IA & Machine Learning', level: 85, color: 'from-purple-500 to-pink-500' },
        { name: 'Cloud & DevOps', level: 88, color: 'from-orange-500 to-red-500' },
    ];

    const values = [
        { icon: Shield, title: 'Segurança', desc: 'Código seguro e confiável', color: 'bg-blue-500' },
        { icon: Zap, title: 'Performance', desc: 'Otimização em cada detalhe', color: 'bg-yellow-500' },
        { icon: Heart, title: 'Dedicação', desc: 'Comprometimento total', color: 'bg-red-500' },
        { icon: TrendingUp, title: 'Resultados', desc: 'Foco em ROI e crescimento', color: 'bg-green-500' },
    ];

    const achievements = [
        { number: '50+', label: 'Projetos Entregues' },
        { number: '5+', label: 'Anos de Experiência' },
        { number: '100%', label: 'Satisfação dos Clientes' },
        { number: '24/7', label: 'Suporte Disponível' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-dark-950 dark:to-dark-900">
            {/* Hero */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Breadcrumbs />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-block mb-4">
                                <span className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold">
                                    👋 Prazer em conhecê-lo!
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                                Olá, sou <br />
                                <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                                    Erilson Araújo
                                </span>
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                Desenvolvedor Full Stack especializado em criar soluções digitais que transformam negócios.
                                Com experiência em <strong className="text-slate-900 dark:text-white">IA, automação e desenvolvimento web</strong>,
                                ajudo empresas a alcançarem seus objetivos através da tecnologia.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/contato"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <Mail className="w-5 h-5" />
                                    Fale Comigo
                                </Link>
                                <Link
                                    href="/agendar"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-dark-800 hover:bg-slate-50 dark:hover:bg-dark-700 text-slate-900 dark:text-white font-bold rounded-xl transition-all shadow-lg border-2 border-slate-200 dark:border-dark-700"
                                >
                                    <Calendar className="w-5 h-5" />
                                    Agendar Reunião
                                </Link>
                            </div>
                        </div>

                        {/* Profile Image */}
                        <div className="flex justify-center lg:justify-end">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
                                <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px] rounded-2xl overflow-hidden border-4 border-white dark:border-dark-800 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 group">
                                    <Image
                                        src="/erilson.jpg"
                                        alt="Erilson Araujo"
                                        fill
                                        className="object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent opacity-60"></div>
                                </div>
                                {/* Floating badges */}
                                <div className="absolute -right-4 top-10 bg-white dark:bg-dark-800 p-3 rounded-xl shadow-xl border border-slate-100 dark:border-dark-700 animate-bounce-slow">
                                    <p className="text-primary-600 font-bold text-xs sm:text-sm">AI Agent Expert 🤖</p>
                                </div>
                                <div className="absolute -left-8 bottom-20 bg-white dark:bg-dark-800 p-3 rounded-xl shadow-xl border border-slate-100 dark:border-dark-700 animate-bounce-slow delay-700">
                                    <p className="text-secondary-500 font-bold text-xs sm:text-sm">Fullstack Dev 💻</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
                        {achievements.map((achievement, index) => (
                            <div key={index} className="text-center p-6 bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-slate-200 dark:border-dark-700">
                                <p className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    {achievement.number}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{achievement.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About */}
            <section className="py-20 bg-white dark:bg-dark-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                                Minha História
                            </h2>
                            <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                <p>
                                    Com formação em <strong className="text-slate-900 dark:text-white">Direito</strong> e paixão por tecnologia,
                                    encontrei na programação a forma perfeita de unir lógica, criatividade e solução de problemas.
                                    Essa combinação única me permite entender profundamente as necessidades dos clientes e criar
                                    soluções que realmente fazem diferença.
                                </p>
                                <p>
                                    Especializado em <strong className="text-slate-900 dark:text-white">desenvolvimento Full Stack</strong>,
                                    trabalho com as tecnologias mais modernas do mercado: React, Next.js, Node.js, Python e ferramentas de IA.
                                    Meu foco está em criar aplicações web robustas, escaláveis e que entreguem resultados mensuráveis.
                                </p>
                                <p>
                                    Acredito que tecnologia deve ser <strong className="text-slate-900 dark:text-white">acessível e trazer retorno real</strong> para os negócios.
                                    Por isso, cada projeto que desenvolvo é pensado estrategicamente para maximizar o ROI e impulsionar o crescimento.
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
                                Habilidades Técnicas
                            </h2>
                            <div className="space-y-6">
                                {skills.map((skill) => (
                                    <div key={skill.name}>
                                        <div className="flex justify-between mb-3">
                                            <span className="font-semibold text-slate-900 dark:text-white text-lg">{skill.name}</span>
                                            <span className="text-slate-600 dark:text-slate-400 font-medium">{skill.level}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-dark-800 rounded-full h-4 overflow-hidden">
                                            <div
                                                className={`bg-gradient-to-r ${skill.color} h-4 rounded-full transition-all duration-1000 shadow-lg`}
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
            <section className="py-20 bg-slate-50 dark:bg-dark-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Meus Valores
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Princípios que guiam cada projeto e decisão técnica
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value) => (
                            <div key={value.title} className="group relative bg-white dark:bg-dark-900 p-8 rounded-2xl border-2 border-slate-200 dark:border-dark-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                <div className={`inline-flex p-4 ${value.color} rounded-2xl mb-4 shadow-lg`}>
                                    <value.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">{value.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/10"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Pronto para Começar seu Projeto?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Vamos conversar sobre como posso ajudar a transformar suas ideias em realidade.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            href="/contato"
                            className="px-8 py-4 bg-white hover:bg-slate-100 text-primary-600 font-bold rounded-xl transition-all shadow-lg transform hover:scale-105"
                        >
                            Entrar em Contato
                        </Link>
                        <Link
                            href="/servicos"
                            className="px-8 py-4 bg-transparent hover:bg-white/10 text-white font-bold rounded-xl transition-all shadow-lg border-2 border-white"
                        >
                            Ver Serviços
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
