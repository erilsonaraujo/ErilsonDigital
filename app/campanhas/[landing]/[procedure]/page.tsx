import React from 'react';
import type { Metadata } from 'next';
import LandingTemplate from '@/components/landing/LandingTemplate';
import type { LandingConfig } from '@/components/landing/types';

type Params = { landing: string; procedure: string };

const fallbackImage = (src: string, alt: string) => ({ src, alt });

const getProcedureConfig = (landing: string, procedure: string): LandingConfig | null => {
  const base: Record<string, Omit<LandingConfig, 'slug' | 'pageTitle' | 'badge' | 'headline' | 'subheadline' | 'heroImage' | 'primaryCta' | 'secondaryCta' | 'metrics' | 'proofChips' | 'painTitle' | 'painCards' | 'offerTitle' | 'offerSubtitle' | 'offerCards' | 'processTitle' | 'processSteps' | 'faqTitle' | 'faqs' | 'formTitle' | 'formSubtitle' | 'formSource' | 'accent'>> = {};
  void base;

  if (landing === 'clinicas-estetica' && procedure === 'harmonizacao-facial') {
    return {
      slug: landing,
      pageTitle: 'Estetica - Harmonizacao',
      badge: 'Campanha por procedimento',
      headline: 'Harmonizacao facial: pagina para vender com criterio (e agendar quem tem perfil).',
      subheadline: 'Estrutura de venda + prova + objecoes + triagem no WhatsApp. Tudo desenhado para reduzir curiosos e aumentar agendamentos qualificados.',
      heroImage: fallbackImage(
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1800',
        'Mulher sorrindo em clinica de estetica'
      ),
      primaryCta: { label: 'Quero essa pagina', href: '#form' },
      secondaryCta: { label: 'Ver entregaveis', href: '#oferta' },
      metrics: [
        { label: 'Campanha', value: 'Procedimento foco' },
        { label: 'Canal', value: 'WhatsApp' },
        { label: 'Prazo', value: '10–21 dias' },
        { label: 'Base', value: 'Mensuracao' },
      ],
      proofChips: ['Copy de conversao', 'Triagem', 'Anti no-show', 'Eventos', 'Design premium'],
      painTitle: 'O que derruba a conversao na harmonizacao',
      painCards: [
        { eyebrow: 'Curiosos', title: 'Preco como primeira pergunta', description: 'Sem estrutura, voce vira balcão de preço. A pagina precisa vender valor e conduzir.' },
        { eyebrow: 'Perfil', title: 'Sem criterio', description: 'Triagem errada ocupa sua equipe e atrasa pacientes prontos para fechar.' },
        { eyebrow: 'No-show', title: 'Agendamento instavel', description: 'Sem confirmacao e follow-up, o lead esfria e some.' },
      ],
      offerTitle: 'O que voce recebe (harmonizacao)',
      offerSubtitle: 'Pagina completa por procedimento, com copy, prova, objecoes e um fluxo que protege sua agenda.',
      offerCards: [
        { eyebrow: 'Pagina', title: 'Sales page completa', description: 'Oferta, provas, antes/depois (quando aplicavel), diferenciais e CTA certo.' },
        { eyebrow: 'WhatsApp', title: 'Triagem', description: 'Perguntas para fit, objetivo e expectativa. Encaminhamento e tags.' },
        { eyebrow: 'Agenda', title: 'Confirmacao', description: 'Lembretes e confirmacao para reduzir faltas.' },
        { eyebrow: 'Dados', title: 'Eventos', description: 'Pixel/GA/GTM com eventos essenciais do funil.' },
        { eyebrow: 'Recuperacao', title: 'Follow-up', description: 'Rotina automatizada para indecisos e reativacao.' },
        { eyebrow: 'Premium', title: 'Design e motion', description: 'Visual atual com microinteracoes e leitura mobile impecavel.' },
      ],
      processTitle: 'Como colocamos no ar',
      processSteps: [
        { title: 'Briefing', description: 'Procedimento, publico e diferencas. Em 30 min voce sai com direcao.' },
        { title: 'Copy', description: 'Estrutura e narrativa para venda, com objecoes e prova.' },
        { title: 'Build', description: 'Implementacao, rastreio, QA e entrega.' },
        { title: 'Ajustes', description: 'Otimizar com dados nas primeiras semanas.' },
      ],
      faqTitle: 'FAQ',
      faqs: [
        { question: 'Isso substitui meu site?', answer: 'Nao. E uma pagina de campanha para conversao maxima, convivendo com seu site institucional.' },
        { question: 'Preciso de anuncio?', answer: 'Ideal para campanha. Mas a pagina tambem melhora conversao de trafego organico e referrals.' },
        { question: 'Posso ter varias paginas?', answer: 'Sim. O modelo ideal e 1 pagina por procedimento/campanha.' },
      ],
      formTitle: 'Quer uma pagina por procedimento?',
      formSubtitle: 'Me diga seu procedimento foco e eu retorno com um plano e faixa de investimento.',
      formSource: `lp-${landing}-${procedure}`,
      accent: 'tide',
    };
  }

  if (landing === 'odontologia-premium' && procedure === 'implantes') {
    return {
      slug: landing,
      pageTitle: 'Odontologia - Implantes',
      badge: 'Campanha por tratamento',
      headline: 'Implantes: venda high-ticket com pagina, triagem e follow-up.',
      subheadline: 'Uma pagina de venda por tratamento, com roteiro de decisao e mensuracao para otimizar campanhas sem achismo.',
      heroImage: fallbackImage(
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1800',
        'Profissional de odontologia sorrindo'
      ),
      primaryCta: { label: 'Quero essa pagina', href: '#form' },
      secondaryCta: { label: 'Ver entregaveis', href: '#oferta' },
      metrics: [
        { label: 'Tratamento', value: 'Implantes' },
        { label: 'Ticket', value: 'High-ticket' },
        { label: 'Canal', value: 'WhatsApp' },
        { label: 'Prazo', value: '10–21 dias' },
      ],
      proofChips: ['Roteiro de venda', 'Qualificacao', 'Anti no-show', 'Eventos', 'Atribuicao'],
      painTitle: 'O que trava a decisao no implante',
      painCards: [
        { eyebrow: 'Confianca', title: 'Sem prova e processo', description: 'O paciente quer segurança. A pagina precisa mostrar método e previsibilidade.' },
        { eyebrow: 'Time', title: 'Atendimento reativo', description: 'Sem esteira, a equipe responde solto e perde timing.' },
        { eyebrow: 'Dados', title: 'Sem leitura de funil', description: 'Sem eventos, você nao sabe onde o paciente desiste.' },
      ],
      offerTitle: 'O que voce recebe (implantes)',
      offerSubtitle: 'Uma pagina que vende com autoridade e uma operacao que protege cadeira e conversao.',
      offerCards: [
        { eyebrow: 'Sales', title: 'Pagina completa', description: 'Oferta, prova, objecoes e CTA orientado ao proximo passo.' },
        { eyebrow: 'Triagem', title: 'WhatsApp estruturado', description: 'Perguntas-chave para perfil e urgencia + tags.' },
        { eyebrow: 'Agenda', title: 'Anti no-show', description: 'Confirmacao e lembretes automatizados.' },
        { eyebrow: 'Dados', title: 'Mensuracao', description: 'Eventos e atribuicao para campanha.' },
        { eyebrow: 'Recuperacao', title: 'Follow-up', description: 'Rotina para recuperar indecisos e reagendar.' },
        { eyebrow: 'Premium', title: 'Design', description: 'Visual moderno, confiavel e mobile-first.' },
      ],
      processTitle: 'Metodo',
      processSteps: [
        { title: 'Diagnostico', description: 'Tratamento foco, publico e metas.' },
        { title: 'Copy', description: 'Roteiro de decisao e provas.' },
        { title: 'Build', description: 'Pagina + rastreio + QA.' },
        { title: 'Ajuste', description: 'Otimizar com dados.' },
      ],
      faqTitle: 'FAQ',
      faqs: [
        { question: 'Serve para outras campanhas?', answer: 'Sim. O ideal e 1 pagina por tratamento/campanha para copy e prova especificas.' },
        { question: 'Integra com CRM?', answer: 'Se voce ja usa CRM, da para integrar dependendo da ferramenta.' },
      ],
      formTitle: 'Quer uma pagina por tratamento?',
      formSubtitle: 'Me diga o tratamento foco e o contexto do seu atendimento.',
      formSource: `lp-${landing}-${procedure}`,
      accent: 'ember',
    };
  }

  if (landing === 'cirurgia-dermato-premium' && procedure === 'dermato') {
    return {
      slug: landing,
      pageTitle: 'Dermato Premium',
      badge: 'Campanha por especialidade',
      headline: 'Dermato premium: posicione autoridade e filtre perfil no WhatsApp.',
      subheadline: 'Pagina premium com prova e narrativa, triagem criteriosa e confirmacao de agenda.',
      heroImage: fallbackImage(
        'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=1800',
        'Doutora sorrindo em consultorio'
      ),
      primaryCta: { label: 'Quero essa pagina', href: '#form' },
      secondaryCta: { label: 'Ver entregaveis', href: '#oferta' },
      metrics: [
        { label: 'Posicionamento', value: 'Premium' },
        { label: 'Foco', value: 'Qualificacao' },
        { label: 'Canal', value: 'WhatsApp' },
        { label: 'Prazo', value: '10–21 dias' },
      ],
      proofChips: ['Autoridade', 'Triagem', 'Privacidade', 'Mensuracao', 'Agenda protegida'],
      painTitle: 'O que derruba conversao no premium',
      painCards: [
        { eyebrow: 'Valor', title: 'Pagina sem narrativa', description: 'Sem historia e prova, o paciente negocia e perde confianca.' },
        { eyebrow: 'Agenda', title: 'Curioso ocupa tempo', description: 'Sem triagem, voce perde pacientes alinhados.' },
        { eyebrow: 'Risco', title: 'Dados sem governanca', description: 'Privacidade e seguranca sao parte do premium.' },
      ],
      offerTitle: 'O que voce recebe (dermato premium)',
      offerSubtitle: 'Pagina de campanha que protege posicionamento e conduz o paciente com criterio.',
      offerCards: [
        { eyebrow: 'Story', title: 'Narrativa premium', description: 'Copy e estrutura alinhadas a valor percebido.' },
        { eyebrow: 'Triagem', title: 'Criterio', description: 'Perguntas para filtrar perfil e expectativa.' },
        { eyebrow: 'Agenda', title: 'Confirmacao', description: 'Lembretes e reagendamento.' },
        { eyebrow: 'Dados', title: 'Eventos', description: 'Mensuracao do funil da campanha.' },
        { eyebrow: 'Design', title: 'Premium', description: 'Motion e microinteracoes sem exagero.' },
        { eyebrow: 'Compliance', title: 'Privacidade', description: 'Minimizacao de dados e boas praticas.' },
      ],
      processTitle: 'Metodo',
      processSteps: [
        { title: 'Diagnostico', description: 'Oferta, publico e metas.' },
        { title: 'Copy', description: 'Prova e objecoes.' },
        { title: 'Build', description: 'Pagina + rastreio.' },
        { title: 'Ajuste', description: 'Otimizar com dados.' },
      ],
      faqTitle: 'FAQ',
      faqs: [
        { question: 'Isso vira varias paginas?', answer: 'Sim. 1 pagina por campanha (ou por especialidade) melhora conversao.' },
        { question: 'Posso usar antes/depois?', answer: 'Depende do seu contexto e regras. Podemos trabalhar com outras provas seguras.' },
      ],
      formTitle: 'Quer sua pagina premium?',
      formSubtitle: 'Me diga sua especialidade foco e seu modelo de atendimento.',
      formSource: `lp-${landing}-${procedure}`,
      accent: 'cobalt',
    };
  }

  return null;
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { landing, procedure } = await params;
  const config = getProcedureConfig(landing, procedure);
  if (!config) return { title: 'Campanha | Erilson Digital' };
  return { title: `${config.pageTitle} | Erilson Digital`, description: config.subheadline };
}

export default async function ProcedureLandingPage({ params }: { params: Promise<Params> }) {
  const { landing, procedure } = await params;
  const config = getProcedureConfig(landing, procedure);
  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-graphite-500">
        Pagina nao encontrada.
      </div>
    );
  }

  return <LandingTemplate config={config} />;
}

