import React from 'react';
import LandingTemplate from '@/components/landing/LandingTemplate';
import type { LandingConfig } from '@/components/landing/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Para Clinicas | Erilson Digital',
  description: 'Landing page de alta conversao + triagem + follow-up + metricas para transformar campanhas em agendamentos.',
};

const config: LandingConfig = {
  slug: 'para-clinicas',
  pageTitle: 'Para Clinicas',
  badge: 'Para Clinicas (operacao completa)',
  headline: 'Pare de comprar lead. Comece a comprar agenda.',
  subheadline:
    'Uma landing de alta conversao + triagem + follow-up + metricas. Tudo conectado para transformar campanhas em agendamentos reais, com previsibilidade e controle.',
  heroImage: {
    src: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1800',
    alt: 'Profissional de saude sorrindo em clinica moderna',
  },
  primaryCta: { label: 'Quero o plano da minha clinica', href: '#form' },
  secondaryCta: { label: 'Ver o que voce recebe', href: '#oferta' },
  metrics: [
    { label: 'Prazo', value: '10–21 dias' },
    { label: 'Foco', value: 'High-ticket' },
    { label: 'Canal', value: 'WhatsApp' },
    { label: 'Base', value: 'LGPD + seguranca' },
  ],
  proofChips: ['Copy orientada a conversao', 'Automacao anti no-show', 'Rastreio (Meta/Google)', 'Qualificacao antes da secretaria', 'Design premium'],
  procedureSection: {
    title: 'Oferta por procedimento (1 pagina por campanha)',
    subtitle: 'Campanhas vencedoras raramente compartilham a mesma pagina. Aqui voce tem uma pagina por procedimento, com copy, prova e triagem alinhadas ao ticket.',
    items: [
      {
        slug: 'harmonizacao',
        title: 'Harmonizacao facial',
        description: 'Pagina para filtrar perfil, reduzir curiosos e agendar pacientes com intencao real.',
        highlights: ['Oferta e prova por procedimento', 'Triagem para perfil/ticket', 'Eventos de conversao para campanha'],
        image: { src: 'https://images.unsplash.com/photo-1616391182219-e080b4d2e9b9?auto=format&fit=crop&q=80&w=1800', alt: 'Mulher sorrindo em clinica de estetica' },
        ctaLabel: 'Campanha',
      },
      {
        slug: 'implantes',
        title: 'Implantes / Reabilitacao',
        description: 'Pagina de venda high-ticket com narrativa, objecoes e decisao orientada ao proximo passo.',
        highlights: ['Copy e objecoes do paciente', 'Qualificacao e follow-up', 'Mensuracao e atribuicao'],
        image: { src: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1800', alt: 'Profissional de odontologia sorrindo' },
        ctaLabel: 'Campanha',
      },
      {
        slug: 'dermato',
        title: 'Dermato premium',
        description: 'Pagina premium para posicionamento e triagem criteriosa sem desvalorizar sua consulta.',
        highlights: ['Design premium e autoridade', 'Triagem criteriosa', 'Protecao de agenda e no-show'],
        image: { src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1800', alt: 'Medica sorrindo em ambiente clinico' },
        ctaLabel: 'Campanha',
      },
    ],
  },
  comparisonSection: {
    title: 'Comparativo: por que algumas campanhas nao fecham',
    subtitle: 'Nao e sobre “ter site”. E sobre ter processo: pagina que vende + triagem + follow-up + dados.',
    leftLabel: 'Site bonito',
    middleLabel: 'Trafego sem funil',
    rightLabel: 'Sistema (pagina + operacao)',
    rows: [
      {
        topic: 'Conversao',
        left: 'Mensagem generica e CTA fraco.',
        middle: 'Clique entra, mas nao vira atendimento.',
        right: 'Copy, prova, objecoes e CTA para proximo passo.',
      },
      {
        topic: 'Qualificacao',
        left: 'Curioso chega igual lead bom.',
        middle: 'Equipe vira SAC de preco.',
        right: 'Triagem antes da secretaria + tags + direcionamento.',
      },
      {
        topic: 'Agenda',
        left: 'No-show continua alto.',
        middle: 'Custo por agendamento sobe.',
        right: 'Confirmacao, lembretes e reagendamento automatizados.',
      },
      {
        topic: 'Dados',
        left: 'Sem eventos, sem leitura de funil.',
        middle: 'Otimiza no achismo.',
        right: 'Eventos, atribuicao e melhorias com previsibilidade.',
      },
    ],
  },
  painTitle: 'O problema nao e trafego. E vazamento no funil.',
  painCards: [
    {
      eyebrow: 'WhatsApp',
      title: 'Leads entram e somem',
      description: 'Atendimento sem esteira, sem tag, sem follow-up. Resultado: perda silenciosa de receita.',
    },
    {
      eyebrow: 'Agenda',
      title: 'No-show e ociosidade',
      description: 'Sem confirmacao e lembretes, voce paga para lotar conversa — e esvaziar a cadeira.',
    },
    {
      eyebrow: 'Marketing',
      title: 'Sem dados, sem decisao',
      description: 'Sem eventos e atribuicao, fica impossivel ajustar campanha com seguranca e ROI.',
    },
  ],
  offerTitle: 'O que voce recebe (pagina de vendas + operacao)',
  offerSubtitle:
    'Nao e “um site bonito”. E um sistema: mensagem certa + prova + experiencia + automacao + rastreio. Tudo focado em agendamento e fechamento.',
  offerCards: [
    {
      eyebrow: 'Conversao',
      title: 'Landing premium',
      description: 'Estrutura de venda completa com oferta, prova social, objecoes e CTA certo para clinica.',
    },
    {
      eyebrow: 'Qualificacao',
      title: 'Triagem no WhatsApp',
      description: 'Perguntas-chave + segmentacao + encaminhamento. Menos curiosos, mais pacientes prontos.',
    },
    {
      eyebrow: 'Recuperacao',
      title: 'Follow-up automatico',
      description: 'Régua para recuperar indecisos e reativar base com mensagens e timing corretos.',
    },
    {
      eyebrow: 'Anti no-show',
      title: 'Confirmacao e lembretes',
      description: 'Fluxo de confirmacao e reagendamento para reduzir faltas e proteger a agenda.',
    },
    {
      eyebrow: 'Dados',
      title: 'Eventos e atribuicao',
      description: 'Setup de Pixel/GA/GTM com eventos relevantes para otimizar campanhas e ROAS.',
    },
    {
      eyebrow: 'Governanca',
      title: 'Seguranca + LGPD',
      description: 'Boas praticas, minimizacao de dados e politica/fluxos alinhados para reduzir risco.',
    },
  ],
  // anchors
  // oferta section is in the template; keep link targets consistent
  processTitle: 'Como funciona (sem caos, com previsibilidade)',
  processSteps: [
    { title: 'Diagnostico', description: 'Mapeio do funil atual, gargalos e metas. Saida: plano objetivo.' },
    { title: 'Copy + oferta', description: 'Mensagem, estrutura e provas. Pagina vira argumento de venda.' },
    { title: 'Implementacao', description: 'Landing + rastreio + automacoes. Tudo integrado e testado.' },
    { title: 'Ajustes', description: 'Primeiras otimizacoes com dados e feedback do atendimento.' },
  ],
  faqTitle: 'Perguntas frequentes',
  faqs: [
    {
      question: 'Isso serve para qualquer especialidade?',
      answer:
        'Sim. A estrutura e o sistema sao os mesmos; o que muda e a oferta, provas e criterios de triagem. Eu adapto o roteiro e os blocos para seu procedimento/prioridade.',
    },
    {
      question: 'Preciso trocar meu site atual?',
      answer:
        'Nao necessariamente. A landing pode rodar como pagina de campanha (melhor para conversao) e conviver com seu site institucional.',
    },
    {
      question: 'Voce faz anuncios?',
      answer:
        'Posso apoiar com estrutura e mensuracao. Gestao de trafego pode ser sua equipe/parceiro; o sistema fica pronto para o marketing performar.',
    },
    {
      question: 'Quanto tempo para ver resultado?',
      answer:
        'Em geral, voce ja percebe melhora nas primeiras semanas ao reduzir perda no atendimento e no-show. Otimizacao de campanha e incremental.',
    },
  ],
  formTitle: 'Receba um plano claro (sem enrolacao)',
  formSubtitle: 'Me diga seu contexto e eu retorno com um plano de ataque: paginas, automacao, dados e proximos passos.',
  formSource: 'lp-para-clinicas',
  accent: 'cobalt',
};

export default function ParaClinicasPage() {
  return (
    <LandingTemplate config={config} />
  );
}
