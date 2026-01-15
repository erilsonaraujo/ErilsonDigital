import React from 'react';
import LandingTemplate from '@/components/landing/LandingTemplate';
import type { LandingConfig } from '@/components/landing/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Odontologia Premium | Erilson Digital',
    description: 'Landing page para implantes, lentes e Invisalign com estrutura de venda, triagem, follow-up e atribuicao.',
};

export default function DentistryPage() {
    const config: LandingConfig = {
        slug: 'odontologia-premium',
        pageTitle: 'Odontologia Premium',
        badge: 'Odontologia (high-ticket)',
        headline: 'Implantes, lentes e Invisalign vendidos com previsibilidade.',
        subheadline:
            'Uma pagina de vendas que filtra perfil, cria urgencia certa e conduz para o WhatsApp com dados. Menos perda, mais fechamentos e agenda protegida.',
        heroImage: {
            src: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=1800',
            alt: 'Doutora sorrindo em consultorio odontologico',
        },
        primaryCta: { label: 'Quero o funil da minha odontologia', href: '#form' },
        secondaryCta: { label: 'Ver a estrutura', href: '#oferta' },
        metrics: [
            { label: 'Tratamentos', value: 'High-ticket' },
            { label: 'Foco', value: 'Fechamento' },
            { label: 'Prazo', value: '10–21 dias' },
            { label: 'Canal', value: 'WhatsApp' },
        ],
        proofChips: ['Implantes', 'Lentes', 'Invisalign', 'Ortodontia', 'Qualificacao', 'Anti no-show'],
        procedureSection: {
            title: 'Oferta por procedimento (pagina por campanha)',
            subtitle: 'Para cada tratamento, uma pagina com copy e objecoes do paciente, prova, triagem e follow-up.',
            items: [
                {
                    slug: 'implantes',
                    title: 'Implantes',
                    description: 'Pagina para venda high-ticket com prova, objecoes e triagem para reduzir perda.',
                    highlights: ['Prova e processo', 'Triagem e agenda', 'Eventos de conversao'],
                    image: { src: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1800', alt: 'Profissional de odontologia sorrindo' },
                    ctaLabel: 'Campanha',
                },
                {
                    slug: 'lentes',
                    title: 'Lentes de contato dental',
                    description: 'Pagina com posicionamento premium e CTA orientado a triagem no WhatsApp.',
                    highlights: ['Design premium', 'Triagem por perfil', 'Follow-up automatico'],
                    image: { src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1800', alt: 'Paciente sorrindo em consultorio odontologico' },
                    ctaLabel: 'Campanha',
                },
                {
                    slug: 'invisalign',
                    title: 'Invisalign / alinhadores',
                    description: 'Pagina para conduzir decisao com roteiro e prova, com mensuracao e conversao.',
                    highlights: ['Roteiro de decisao', 'Atribuicao e eventos', 'Confirmacao e reagendamento'],
                    image: { src: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=1800', alt: 'Dentista sorrindo em clinica' },
                    ctaLabel: 'Campanha',
                },
            ],
        },
        comparisonSection: {
            title: 'Comparativo: por que a odontologia perde lead',
            subtitle: 'Pagina de venda e atendimento precisam trabalhar juntos — senao o paciente esfria e some.',
            leftLabel: 'Pagina generica',
            middleLabel: 'WhatsApp sem esteira',
            rightLabel: 'Funil completo',
            rows: [
                { topic: 'Decisao', left: 'Nao conduz.', middle: 'Conversa solta.', right: 'Roteiro + CTA + proximo passo.' },
                { topic: 'Qualificacao', left: 'Lead ruim entra.', middle: 'Time perde tempo.', right: 'Triagem e tags antes da agenda.' },
                { topic: 'Agenda', left: 'No-show alto.', middle: 'Buracos na cadeira.', right: 'Confirmacao e reativacao automatizadas.' },
                { topic: 'ROI', left: 'Imprevisivel.', middle: 'Oscila.', right: 'Eventos e atribuicao para otimizar.' },
            ],
        },
        painTitle: 'Por que o lead nao fecha (mesmo interessado)',
        painCards: [
            {
                eyebrow: 'Venda',
                title: 'Sem roteiro de decisao',
                description: 'O paciente chega com duvida e voce responde no improviso. Isso derruba conversao.',
            },
            {
                eyebrow: 'Agenda',
                title: 'Buracos e faltas',
                description: 'Sem confirmacao e reativacao, sua cadeira fica ociosa e o custo de marketing sobe.',
            },
            {
                eyebrow: 'Qualificacao',
                title: 'Lead sem perfil',
                description: 'Sem filtro, voce investe tempo em quem nao tem fit (ou nao tem urgencia/capacidade).',
            },
        ],
        offerTitle: 'Pagina de vendas + esteira comercial (odontologia)',
        offerSubtitle:
            'Estrutura orientada a conversao para tratamento de alto valor, com fluxo para WhatsApp, triagem e follow-up. Tudo mensurado.',
        offerCards: [
            { eyebrow: 'Copy', title: 'Roteiro de venda', description: 'Oferta, prova, objecoes e CTA para levar o paciente ao proximo passo.' },
            { eyebrow: 'UX', title: 'Design que inspira confianca', description: 'Pagina premium, rapida, mobile-first e sem “cara de promocao”.' },
            { eyebrow: 'WhatsApp', title: 'Triagem inteligente', description: 'Perguntas para qualificar e direcionar para equipe/agenda.' },
            { eyebrow: 'Recuperacao', title: 'Follow-up', description: 'Rotinas para recuperar indecisos e reagendar sem esforço.' },
            { eyebrow: 'Agenda', title: 'Anti no-show', description: 'Confirmacao automatica e lembretes para reduzir faltas.' },
            { eyebrow: 'Dados', title: 'Atribuicao e eventos', description: 'Pixel/GA/GTM com eventos para otimizar ROAS e CAC.' },
        ],
        processTitle: 'Como colocamos isso no ar',
        processSteps: [
            { title: 'Diagnostico', description: 'Tratamento foco, publico, ticket e gargalos.' },
            { title: 'Estrutura', description: 'Copy e blocos: prova, oferta, objecoes e CTA.' },
            { title: 'Build', description: 'Pagina + rastreio + WhatsApp e testes.' },
            { title: 'Otimizar', description: 'Ajustes iniciais e leitura de funil.' },
        ],
        faqTitle: 'FAQ',
        faqs: [
            {
                question: 'Isso serve para mais de um tratamento?',
                answer:
                    'Sim, mas para conversao maxima eu recomendo uma pagina por tratamento foco (ou por campanha). Comecamos pelo que da mais retorno.',
            },
            {
                question: 'Voce integra com CRM?',
                answer:
                    'Se voce ja usa CRM, podemos integrar (depende da ferramenta). Se nao usa, eu organizo o minimo viavel para nao perder lead.',
            },
            {
                question: 'O que preciso te enviar?',
                answer:
                    'Tratamento foco, precos/faixas (se tiver), publico ideal, diferenciais e principais duvidas que chegam no WhatsApp.',
            },
            {
                question: 'Como medir se deu certo?',
                answer:
                    'Com eventos (lead, triagem, agendamento) e funil. Sem isso, marketing vira achismo.',
            },
        ],
        formTitle: 'Quer uma pagina que venda tratamento?',
        formSubtitle: 'Me diga o foco da sua odontologia e eu retorno com um plano de estrutura e implementacao.',
        formSource: 'lp-odontologia',
        accent: 'ember',
    };

    return <LandingTemplate config={config} />;
}
