import React from 'react';
import LandingTemplate from '@/components/landing/LandingTemplate';
import type { LandingConfig } from '@/components/landing/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Estetica | Erilson Digital',
    description: 'Landing de estetica com venda completa, triagem no WhatsApp, anti no-show e mensuracao para aumentar agendamentos.',
};

export default function EstheticsPage() {
    const config: LandingConfig = {
        slug: 'clinicas-estetica',
        pageTitle: 'Estetica',
        badge: 'Estetica (alta conversao)',
        headline: 'Leads de estetica que viram agenda — nao conversa infinita.',
        subheadline:
            'Uma landing de venda + triagem no WhatsApp + follow-up e confirmacao. Menos curiosos, menos no-show e mais pacientes prontos para fechar.',
        heroImage: {
            src: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=1800',
            alt: 'Mulher sorrindo em clinica de estetica',
        },
        primaryCta: { label: 'Quero minha landing de estetica', href: '#form' },
        secondaryCta: { label: 'Ver a estrutura da pagina', href: '#oferta' },
        metrics: [
            { label: 'Objetivo', value: 'Agendamentos' },
            { label: 'Canal', value: 'WhatsApp' },
            { label: 'Prazo', value: '10–21 dias' },
            { label: 'Entrega', value: 'Pagina + automacao' },
        ],
        proofChips: ['Harmonizacao', 'Corporal', 'Laser', 'Capilar', 'Rastreio Meta/Google', 'Anti no-show'],
        procedureSection: {
            title: 'Oferta por procedimento (pagina por campanha)',
            subtitle: 'Para cada procedimento, uma pagina com promessa, prova e triagem alinhadas ao ticket e ao perfil certo.',
            items: [
                {
                    slug: 'harmonizacao-facial',
                    title: 'Harmonizacao facial',
                    description: 'Pagina para transformar curiosos em agendamentos com filtro de perfil e expectativa.',
                    highlights: ['Objecoes e prova por procedimento', 'Triagem antes da agenda', 'Eventos de conversao'],
                    image: { src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1800', alt: 'Mulher sorrindo em atendimento de estetica' },
                    ctaLabel: 'Campanha',
                },
                {
                    slug: 'laser',
                    title: 'Laser / depilacao',
                    description: 'Pagina com oferta e posicionamento, ideal para volume com qualificacao e follow-up.',
                    highlights: ['Oferta clara + prova', 'Follow-up automatico', 'Mensuracao de funil'],
                    image: { src: 'https://images.unsplash.com/photo-1607748851687-ba9a10438621?auto=format&fit=crop&q=80&w=1800', alt: 'Profissional sorrindo em clinica' },
                    ctaLabel: 'Campanha',
                },
                {
                    slug: 'corporal',
                    title: 'Corporal high-ticket',
                    description: 'Pagina para ticket maior com triagem, prova e condução para decisao.',
                    highlights: ['Qualificacao por perfil e objetivo', 'Anti no-show', 'CTA para proximo passo'],
                    image: { src: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1800', alt: 'Mulher feliz em clinica de estetica' },
                    ctaLabel: 'Campanha',
                },
            ],
        },
        comparisonSection: {
            title: 'Comparativo: “postar e impulsionar” vs. vender com processo',
            subtitle: 'Quando a pagina e o atendimento nao estao conectados, o marketing vira custo. Com funil, vira previsibilidade.',
            leftLabel: 'So Instagram',
            middleLabel: 'Trafego sem triagem',
            rightLabel: 'Pagina + triagem + agenda',
            rows: [
                { topic: 'Qualidade do lead', left: 'Muito curioso.', middle: 'Mistura lead bom e ruim.', right: 'Triagem separa perfil e intencao.' },
                { topic: 'No-show', left: 'Alto.', middle: 'Alto.', right: 'Confirmacao e lembretes reduzem faltas.' },
                { topic: 'Conversao', left: 'Baixa.', middle: 'Instavel.', right: 'Copy + prova + CTA conduzem decisao.' },
                { topic: 'ROI', left: 'Imprevisivel.', middle: 'Oscila.', right: 'Dados e funil permitem otimizar.' },
            ],
        },
        painTitle: 'O que faz sua estetica perder dinheiro hoje',
        painCards: [
            {
                eyebrow: 'Curiosos',
                title: 'Muita pergunta, pouca compra',
                description: 'Sem filtro, sua equipe vira SAC de preco e o lead bom mistura com o ruim.',
            },
            {
                eyebrow: 'No-show',
                title: 'Agenda instavel',
                description: 'Sem confirmacao e lembrete, voce paga lead e perde o horario de consulta.',
            },
            {
                eyebrow: 'Conversao',
                title: 'Pagina que nao vende',
                description: 'Sem prova, sem oferta clara e sem CTA certo, o lead cai e nao se decide.',
            },
        ],
        offerTitle: 'Pagina de vendas completa + operacao (do anuncio ao agendamento)',
        offerSubtitle:
            'Voce ganha uma pagina que vende procedimento e uma esteira que faz o atendimento funcionar com velocidade, filtro e previsibilidade.',
        offerCards: [
            { eyebrow: 'Oferta', title: 'Estrutura de venda', description: 'Oferta, provas, objecoes, diferenciais e CTA certo para estetica.' },
            { eyebrow: 'Visual', title: 'Design premium', description: 'Layout atual, com motion, credibilidade e leitura perfeita no mobile.' },
            { eyebrow: 'WhatsApp', title: 'Triagem e tags', description: 'Perguntas e segmentacao para separar curioso de paciente com potencial.' },
            { eyebrow: 'Recuperacao', title: 'Follow-up', description: 'Rotina automatizada para recuperar indecisos e reativar base.' },
            { eyebrow: 'Agenda', title: 'Confirmacao', description: 'Lembretes, confirmacao e reagendamento para reduzir faltas.' },
            { eyebrow: 'Dados', title: 'Mensuracao', description: 'Eventos, pixel/GA/GTM e leitura de funil para otimizar campanha.' },
        ],
        processTitle: 'Metodo (rapido, sem bagunca)',
        processSteps: [
            { title: 'Diagnostico', description: 'Procedimento foco, oferta, gargalos do atendimento e metas.' },
            { title: 'Copy + prova', description: 'Mensagem, provas, objecoes e estrutura de conversao.' },
            { title: 'Build + integracao', description: 'Landing + rastreio + fluxo no WhatsApp e testes.' },
            { title: 'Otimizar', description: 'Ajustes iniciais com dados e feedback do time.' },
        ],
        faqTitle: 'FAQ (objetivo e direto)',
        faqs: [
            {
                question: 'Isso funciona para harmonizacao e laser?',
                answer:
                    'Sim. A pagina e adaptada para seu procedimento foco e publico. O que muda e a promessa, provas e criterios de triagem.',
            },
            {
                question: 'Minha equipe precisa mudar o atendimento?',
                answer:
                    'Pouco. Eu organizo tags e um fluxo simples. O objetivo e reduzir trabalho manual, nao criar burocracia.',
            },
            {
                question: 'Preciso de muito trafego?',
                answer:
                    'Nao. Primeiro a gente fecha vazamento: pagina que vende + triagem + follow-up. A partir disso, trafego performa melhor.',
            },
            {
                question: 'Quanto custa?',
                answer:
                    'Depende do escopo (quantos procedimentos, automacoes e integracoes). No diagnostico eu te passo um plano com faixas e prioridades.',
            },
        ],
        formTitle: 'Vamos montar sua pagina de vendas',
        formSubtitle: 'Envie seus dados e eu retorno com o plano de estrutura (pagina, triagem, follow-up e dados).',
        formSource: 'lp-estetica',
        accent: 'tide',
    };

    return <LandingTemplate config={config} />;
}
