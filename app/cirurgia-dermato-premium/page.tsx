import React from 'react';
import LandingTemplate from '@/components/landing/LandingTemplate';
import type { LandingConfig } from '@/components/landing/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cirurgia & Dermato | Erilson Digital',
    description: 'Pagina premium para high-ticket com triagem criteriosa, confirmacao de agenda, mensuracao e privacidade.',
};

export default function SurgeryPage() {
    const config: LandingConfig = {
        slug: 'cirurgia-dermato-premium',
        pageTitle: 'Cirurgia & Dermato',
        badge: 'Cirurgia & Dermato (posicionamento premium)',
        headline: 'Autoridade nao se vende com desconto. Se vende com processo.',
        subheadline:
            'Uma pagina de vendas premium para high-ticket + triagem criteriosa + fluxo de confirmacao. Menos curiosos, mais pacientes alinhados com valor e cirurgia/dermato.',
        heroImage: {
            src: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=1800',
            alt: 'Doutora sorrindo em consultorio moderno',
        },
        primaryCta: { label: 'Quero a pagina premium', href: '#form' },
        secondaryCta: { label: 'Ver o que esta incluso', href: '#oferta' },
        metrics: [
            { label: 'Publico', value: 'High-ticket' },
            { label: 'Foco', value: 'Qualificacao' },
            { label: 'Prazo', value: '10–21 dias' },
            { label: 'Base', value: 'Privacidade' },
        ],
        proofChips: ['Cirurgia plastica', 'Dermato avancada', 'Transplante capilar', 'Prova e narrativa', 'LGPD', 'Experiencia premium'],
        procedureSection: {
            title: 'Oferta por procedimento (pagina por campanha)',
            subtitle: 'Cada procedimento exige narrativa, provas e triagem diferentes. Aqui voce tem uma pagina por campanha, sem desvalorizar sua consulta.',
            items: [
                {
                    slug: 'cirurgia-plastica',
                    title: 'Cirurgia plastica (high-ticket)',
                    description: 'Pagina premium com prova, objecoes e triagem criteriosa para proteger agenda e posicionamento.',
                    highlights: ['Narrativa de autoridade', 'Triagem por perfil e intencao', 'Mensuracao de funil'],
                    image: { src: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&q=80&w=1800', alt: 'Medica sorrindo com paciente' },
                    ctaLabel: 'Campanha',
                },
                {
                    slug: 'dermato',
                    title: 'Dermatologia avancada',
                    description: 'Pagina com linguagem premium e oferta alinhada ao seu modelo de consulta e procedimento.',
                    highlights: ['Prova adequada e segura', 'CTA para proximo passo', 'Protecao de agenda'],
                    image: { src: 'https://images.unsplash.com/photo-1580281657527-47f249e8f6b7?auto=format&fit=crop&q=80&w=1800', alt: 'Doutora sorrindo em clinica' },
                    ctaLabel: 'Campanha',
                },
                {
                    slug: 'transplante-capilar',
                    title: 'Transplante capilar',
                    description: 'Pagina orientada a agendamento com triagem e follow-up para reduzir perda e indecisao.',
                    highlights: ['Triagem e expectativas', 'Follow-up automatico', 'Eventos de conversao'],
                    image: { src: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1800', alt: 'Profissional de saude sorrindo em consultorio' },
                    ctaLabel: 'Campanha',
                },
            ],
        },
        comparisonSection: {
            title: 'Comparativo: posicionamento premium vs. pagina comum',
            subtitle: 'High-ticket precisa de autoridade, processo e triagem — nao de “promocao”.',
            leftLabel: 'Pagina comum',
            middleLabel: 'Anuncio sem filtro',
            rightLabel: 'Premium (pagina + triagem)',
            rows: [
                { topic: 'Valor percebido', left: 'Parece “mais do mesmo”.', middle: 'Atrai curiosos.', right: 'Narra autoridade e diferenciais.' },
                { topic: 'Agenda', left: 'No-show e perda.', middle: 'Equipe sobrecarrega.', right: 'Criterio + confirmacao protegem agenda.' },
                { topic: 'Confianca', left: 'Pouca prova.', middle: 'Conversa solta.', right: 'Prova, processo e proximo passo claro.' },
                { topic: 'Dados', left: 'Sem leitura.', middle: 'Otimiza no achismo.', right: 'Eventos e atribuicao para campanha.' },
            ],
        },
        painTitle: 'O que derruba conversao no high-ticket medico',
        painCards: [
            {
                eyebrow: 'Percepcao de valor',
                title: 'Pagina generica',
                description: 'Se o digital nao parece premium, o paciente negocia. E a clinica vira commodity.',
            },
            {
                eyebrow: 'Qualificacao',
                title: 'Curiosos ocupando agenda',
                description: 'Sem triagem e criterio, sua equipe perde tempo e atrasa pacientes certos.',
            },
            {
                eyebrow: 'Risco',
                title: 'Dados sem cuidado',
                description: 'Formularios e mensagens sem governanca aumentam risco e diminuem confianca.',
            },
        ],
        offerTitle: 'Pagina de vendas premium (com criterio e blindagem)',
        offerSubtitle:
            'A pagina vira seu argumento: narrativa, prova, objecoes, jornada e um fluxo que protege sua agenda e seu posicionamento.',
        offerCards: [
            { eyebrow: 'Story', title: 'Narrativa premium', description: 'Mensagem e estrutura alinhadas a autoridade e valor percebido.' },
            { eyebrow: 'Prova', title: 'Prova social e credenciais', description: 'Blocos para evidencias (sem promessas indevidas), diferenciais e processo.' },
            { eyebrow: 'Jornada', title: 'Triagem criteriosa', description: 'Perguntas objetivas para filtrar perfil e direcionar atendimento.' },
            { eyebrow: 'Agenda', title: 'Confirmacao e reagendamento', description: 'Fluxos anti no-show para consultas e retornos.' },
            { eyebrow: 'Dados', title: 'Mensuracao de funil', description: 'Eventos e atribuicao para otimizar campanhas sem achismo.' },
            { eyebrow: 'Compliance', title: 'Privacidade e seguranca', description: 'Boas praticas e base legal para reduzir risco e aumentar confianca.' },
        ],
        processTitle: 'Execucao (cirurgica, sem ruído)',
        processSteps: [
            { title: 'Diagnostico', description: 'Procedimentos foco, posicionamento, publico e metas.' },
            { title: 'Copy', description: 'Narrativa, provas e objecoes, com linguagem de autoridade.' },
            { title: 'Implementacao', description: 'Pagina + rastreio + fluxo WhatsApp e validacoes.' },
            { title: 'Ajuste fino', description: 'Otimizar com dados e feedback do atendimento.' },
        ],
        faqTitle: 'Perguntas frequentes',
        faqs: [
            {
                question: 'Isso e para medico ou para clinica?',
                answer:
                    'Serve para ambos. O importante e a oferta (procedimento foco) e o fluxo de triagem/agenda. A pagina respeita seu posicionamento e linguagem.',
            },
            {
                question: 'Posso usar antes/depois?',
                answer:
                    'Depende do seu contexto e regras. Eu prefiro trabalhar com prova de processo, autoridade, bastidores e evidencias adequadas ao seu caso.',
            },
            {
                question: 'Como evita curiosos?',
                answer:
                    'Com copy e CTA corretos, e com triagem que identifica perfil, urgencia e capacidade. Isso protege sua equipe e seu tempo.',
            },
            {
                question: 'E sobre LGPD?',
                answer:
                    'Minimizamos dados, aplicamos boas praticas e orientamos textos/fluxos para contato e consentimento, reduzindo risco.',
            },
        ],
        formTitle: 'Quer uma pagina realmente premium?',
        formSubtitle: 'Me envie seu contexto e eu retorno com um plano de estrutura (pagina, triagem, agenda e mensuracao).',
        formSource: 'lp-cirurgia-dermato',
        accent: 'cobalt',
    };

    return <LandingTemplate config={config} />;
}
