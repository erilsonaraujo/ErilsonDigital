import { Project, Service, ServiceDetail, Skill, Testimonial, Translations, Language } from './types';
import { Server, Database, Globe, Code2, Terminal, Cpu, Smartphone, Cloud, Layout, ShieldCheck } from 'lucide-react';

export const WHATSAPP_NUMBER = '5584994349355';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/jose-erilson-araujo-3265a52b1/';
export const GITHUB_URL = 'https://github.com/erilsonaraujo/ErilsonDigital';
export const EMAIL_ADDRESS = 'joseerilsonaraujo@gmail.com';
export const DISCORD_URL = 'https://discord.gg/3VDFU2wy';
export const INSTAGRAM_URL = 'https://instagram.com/josearaujo1986';

export const TRANSLATIONS: Record<Language, Translations> = {
  pt: {
    nav: { services: 'Serviços', portfolio: 'Portfólio', about: 'Sobre', contact: 'Fale Comigo', booking: 'Agendar' },
    booking: {
      title: 'Agende uma Consultoria',
      subtitle: 'Sessões de 30 minutos para discutir seu projeto e viabilidade técnica.',
    },
    hero: {
      badge: 'Especialista em Automação com IA',
      title: 'Escale seu negócio com',
      titleHighlight: 'Automação & IA',
      subtitle: 'Desenvolvedor de Agentes Inteligentes e Atendimento Automatizado. Soluções robustas em Java & Python para transformar sua operação.',
      ctaPrimary: 'Ver Portfólio',
      ctaSecondary: 'Falar com Sofia (IA)',
    },
    ai: {
      title: 'Sofia - Assistente Executiva',
      subtitle: 'Olá! Sou a Sofia, assistente pessoal do Erilson. Ele está focado em códigos complexos agora, mas eu conheço cada detalhe do portfólio dele. Como posso ajudar sua empresa hoje?',
      placeholder: 'Pergunte sobre experiência, projetos ou tecnologias...',
      disclaimer: 'Sofia: Assistente Virtual Inteligente do Erilson Digital',
      suggestion1: 'Quanto custa para desenvolver um MVP?',
      suggestion2: 'Você oferece suporte e manutenção após a entrega?',
      suggestion3: 'Qual a melhor tecnologia para minha startup?',
      help_label: 'Perguntas frequentes:',
    },
    services: {
      title: 'Soluções de IA para Negócios',
      subtitle: 'Transformando processos manuais em fluxos de trabalho inteligentes e escaláveis.',
    },
    projects: {
      title: 'Portfólio de Alto Impacto',
      subtitle: 'Sistemas complexos, integrações bancárias e soluções SaaS desenvolvidas com tecnologias de ponta.',
      problem: 'O Desafio',
      solution: 'Engenharia Aplicada',
      viewCode: 'Ver Código',
      viewProject: 'Acessar Projeto',
    },
    about: {
      title: 'Não contrate apenas um programador. Contrate um Parceiro de Negócios.',
      text1: 'O mercado está cheio de desenvolvedores que apenas escrevem código. Eu sou diferente. Minha formação jurídica me ensinou a pensar em riscos, contratos e garantias. Quando você me contrata, não leva apenas linhas de código, leva a segurança de um sistema blindado.',
      text2: 'Eu transformo ideias vagas em produtos digitais lucrativos. Se você quer alguém para "tentar" fazer, procure outro. Se você quer alguém que vai entrar no seu negócio, entender seu modelo de receita e entregar uma tecnologia que escala e vende, então você está no lugar certo.',
      text3: 'Minha garantia é técnica e moral: Eu não entrego nada que eu não usaria na minha própria empresa. Vamos construir um império digital juntos?',
      stats_projects: 'Projetos de Alto Nível',
      stats_commitment: 'Compromisso Absoluto',
      methodology_title: 'Engenharia de Elite',
      methodology_text: 'Zero gambiarras. Uso padrões de projeto internacionais (Clean Arch, SOLID) para garantir que seu software dure 10 anos, não 10 meses.',
    },
    contact: {
      title: 'Vamos Construir o Futuro?',
      subtitle: 'Estou pronto para elevar o nível técnico do seu projeto. Agende uma conversa.',
      nameLabel: 'Seu Nome',
      emailLabel: 'Seu Melhor Email',
      msgLabel: 'Detalhes do Projeto',
      btnSend: 'Enviar Proposta',
      btnSending: 'Enviando...',
      btnSent: 'Proposta Enviada!',
      whatsappBtn: 'Negociar no WhatsApp',
    }
  },
  en: {
    nav: { services: 'Services', portfolio: 'Portfolio', about: 'About', contact: 'Contact', booking: 'Book Now' },
    booking: {
      title: 'Book a Consultation',
      subtitle: '30-minute sessions to discuss your project and technical feasibility.',
    },
    hero: {
      badge: 'AI Automation Specialist',
      title: 'Scale your business with',
      titleHighlight: 'Automation & AI',
      subtitle: 'Developer of Intelligent Agents and Automated Support. Robust Java & Python solutions to transform your operation.',
      ctaPrimary: 'View Portfolio',
      ctaSecondary: 'Chat with Sofia (AI)',
    },
    ai: {
      title: 'Sofia - Executive Assistant',
      subtitle: 'Hello! I am Sofia, Erilson\'s personal assistant. He is focused on complex code right now, but I know every detail of his portfolio. How can I help your company today?',
      placeholder: 'Ask about experience, projects, or tech stack...',
      disclaimer: 'Sofia: Erilson Digital Intelligent Virtual Assistant',
      suggestion1: 'How much does an MVP cost?',
      suggestion2: 'Do you offer support after delivery?',
      suggestion3: 'Best tech stack for my startup?',
      help_label: 'Frequently asked questions:',
    },
    services: {
      title: 'AI Solutions for Business',
      subtitle: 'Transforming manual processes into intelligent and scalable workflows.',
    },
    projects: {
      title: 'High Impact Portfolio',
      subtitle: 'Complex systems, banking integrations, and SaaS solutions developed with cutting-edge tech.',
      problem: 'The Challenge',
      solution: 'Applied Engineering',
      viewCode: 'View Code',
      viewProject: 'Visit Project',
    },
    about: {
      title: 'Don\'t just hire a coder. Hire a Business Partner.',
      text1: 'The market is full of developers who just write code. I am different. My legal background taught me to think about risks, contracts, and guarantees. When you hire me, you don\'t just get lines of code, you get the security of an armored system.',
      text2: 'I transform vague ideas into profitable digital products. If you want someone to "try" to do it, look elsewhere. If you want someone who will dive into your business, understand your revenue model, and deliver technology that scales and sells, then you are in the right place.',
      text3: 'My guarantee is technical and moral: I don\'t deliver anything I wouldn\'t use in my own company. Let\'s build a digital empire together?',
      stats_projects: 'High-Level Projects',
      stats_commitment: 'Absolute Commitment',
      methodology_title: 'Elite Engineering',
      methodology_text: 'No hacks. I use international design patterns (Clean Arch, SOLID) to ensure your software lasts 10 years, not 10 months.',
    },
    contact: {
      title: 'Let\'s Build the Future?',
      subtitle: 'I am ready to elevate the technical level of your project. Schedule a talk.',
      nameLabel: 'Your Name',
      emailLabel: 'Best Email',
      msgLabel: 'Project Details',
      btnSend: 'Send Proposal',
      btnSending: 'Sending...',
      btnSent: 'Proposal Sent!',
      whatsappBtn: 'Negotiate on WhatsApp',
    }
  },
  es: {
    nav: { services: 'Servicios', portfolio: 'Portafolio', about: 'Sobre Mí', contact: 'Contacto', booking: 'Agendar' },
    booking: {
      title: 'Agendar Consultoría',
      subtitle: 'Sesiones de 30 minutos para discutir tu proyecto y viabilidad técnica.',
    },
    hero: {
      badge: 'Especialista en Automatización con IA',
      title: 'Scale su negocio con',
      titleHighlight: 'Automatización e IA',
      subtitle: 'Desarrollador de Agentes Inteligentes y Atención Automatizada. Soluciones robustas en Java y Python para transformar su operación.',
      ctaPrimary: 'Ver Portafolio',
      ctaSecondary: 'Hablar con Sofia (IA)',
    },
    ai: {
      title: 'Sofia - Asistente Ejecutiva',
      subtitle: '¡Hola! Soy Sofia, asistente personal de Erilson. Él está enfocado en código complejo ahora, pero conozco cada detalle de su portafolio. ¿Cómo puedo ayudar a tu empresa hoy?',
      placeholder: 'Pregunta sobre experiencia, proyectos o tecnologías...',
      disclaimer: 'Sofia: Asistente Virtual Inteligente de Erilson Digital',
      suggestion1: '¿Cuánto cuesta un MVP?',
      suggestion2: '¿Ofreces soporte después de la entrega?',
      suggestion3: '¿Mejor tecnología para mi startup?',
      help_label: 'Preguntas frecuentes:',
    },
    services: {
      title: 'Soluciones de IA para Negocios',
      subtitle: 'Transformando procesos manuales en flujos de trabalho inteligentes y escalables.',
    },
    projects: {
      title: 'Portafolio de Alto Impacto',
      subtitle: 'Sistemas complejos, integraciones bancarias y soluciones SaaS con tecnología de punta.',
      problem: 'El Desafío',
      solution: 'Ingeniería Aplicada',
      viewCode: 'Ver Código',
      viewProject: 'Visitar Proyecto',
    },
    about: {
      title: 'No contrates solo un programador. Contrata un Socio de Negocios.',
      text1: 'El mercado está lleno de desarrolladores que solo escriben código. Yo soy diferente. Mi formación jurídica me enseñó a pensar en riesgos y garantías. Cuando me contratas, no solo llevas líneas de código, llevas la seguridad de un sistema blindado.',
      text2: 'Transformo ideas vagas en productos digitales rentables. Si quieres a alguien para "intentar" hacerlo, busca a otro. Si quieres a alguien que entienda tu modelo de ingresos y entregue tecnología que escala y vende, estás en el lugar correcto.',
      text3: 'Mi garantía es técnica y moral: No entrego nada que no usaría en mi propia empresa. ¿Construimos un imperio digital juntos?',
      stats_projects: 'Proyectos de Alto Nivel',
      stats_commitment: 'Compromiso Absoluto',
      methodology_title: 'Ingeniería de Élite',
      methodology_text: 'Cero chapuzas. Uso patrones de diseño internacionales (Clean Arch, SOLID) para garantizar que tu software dure 10 años, no 10 meses.',
    },
    contact: {
      title: '¿Construimos el Futuro?',
      subtitle: 'Estoy listo para elevar el nivel técnico de tu proyecto. Agenda una charla.',
      nameLabel: 'Tu Nombre',
      emailLabel: 'Tu Mejor Email',
      msgLabel: 'Detalles del Proyecto',
      btnSend: 'Enviar Propuesta',
      btnSending: 'Enviando...',
      btnSent: 'Propuesta Enviada!',
      whatsappBtn: 'Negociar en WhatsApp',
    }
  }
};

export const PROJECTS: Project[] = [
  {
    id: 'crs-advogados',
    title: 'CRS Advogados - ERP Jurídico',
    category: 'Java Spring Boot / Enterprise',
    summary: 'Transformação digital completa: Gestão de processos e automação documental.',
    problem: 'Escritório lidava com milhares de documentos físicos e perda de prazos por falta de centralização.',
    solution: 'Sistema Enterprise em Java Spring Boot com segurança JWT. Módulo de automação em Python que lê PDFs judicial e cadastra prazos automaticamente no banco PostgreSQL.',
    technologies: ['Java 17', 'Spring Boot', 'Python Automation', 'PostgreSQL', 'Docker'],
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200',
    liveLink: 'https://eribertorocha.com.br',
  },
  {
    id: 'eadministracao',
    title: 'E-Administração SaaS',
    category: 'Full Stack / SaaS',
    summary: 'Plataforma Multi-tenant para gestão de condomínios e financeira.',
    problem: 'Síndicos precisavam de transparência financeira em tempo real e comunicação direta com condôminos.',
    solution: 'Plataforma SaaS escalável. Backend Node.js/Express para alta concorrência, Frontend React com Dashboard analítico. Integração com API de boletos bancários.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Chart.js', 'AWS S3'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    liveLink: 'https://eadministracao.com.br',
  },
  {
    id: 'fintech-core',
    title: 'FinTech Core Banking API',
    category: 'Java / Financial',
    summary: 'API para processamento de transações PIX e conciliação bancária.',
    problem: 'Necessidade de processar 500+ transações por segundo com consistência ACID absoluta.',
    solution: 'Microsserviços em Java Spring Boot, comunicação via Kafka para assincronismo e Redis para cache de saldo. Implementação de segurança OAuth2 e criptografia ponta-a-ponta.',
    technologies: ['Java', 'Spring Cloud', 'Kafka', 'Redis', 'Docker'],
    image: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?auto=format&fit=crop&q=80&w=1200',
    repoLink: GITHUB_URL,
  },
  {
    id: 'delivery-app-backend',
    title: 'Food Delivery Backend',
    category: 'Python / Mobile Backend',
    summary: 'Backend geoespacial para aplicativo de entregas tipo iFood.',
    problem: 'Cálculo de rotas em tempo real e matching de entregadores próximos.',
    solution: 'API de alta performance em Python FastAPI. Uso de PostGIS para queries espaciais (raio de entrega) e WebSockets para tracking do motoboy em tempo real no mapa.',
    technologies: ['Python', 'FastAPI', 'PostGIS', 'WebSockets', 'Google Maps API'],
    image: 'https://images.unsplash.com/photo-1526367790999-015078484022?auto=format&fit=crop&q=80&w=1200',
    repoLink: GITHUB_URL,
  },
  {
    id: 'telemedicina-webrtc',
    title: 'Plataforma de Telemedicina',
    category: 'HealthTech / Real-time',
    summary: 'Sistema de consultas médicas por vídeo com prontuário eletrônico.',
    problem: 'Latência alta em chamadas de vídeo e insegurança no armazenamento de dados médicos.',
    solution: 'Implementação de WebRTC para vídeo peer-to-peer criptografado. Backend compliance com LGPD/HIPAA para dados sensíveis. Agendamento integrado com Google Calendar.',
    technologies: ['React', 'WebRTC', 'Node.js', 'MongoDB', 'Socket.io'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200',
    repoLink: GITHUB_URL,
  },
  {
    id: 'iot-agro',
    title: 'AgroTech IoT Dashboard',
    category: 'IoT / Big Data',
    summary: 'Monitoramento de sensores de umidade e temperatura em campo.',
    problem: 'Fazendeiros perdiam colheitas por falta de dados climáticos precisos em tempo real.',
    solution: 'Coletor de dados MQTT em Python rodando em Raspberry Pi, enviando para backend em Java. Dashboard em React exibe gráficos históricos e alertas via SMS/WhatsApp.',
    technologies: ['Python', 'MQTT', 'Java Spring', 'React', 'Twilio API'],
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=1200',
    repoLink: GITHUB_URL,
  },
  {
    id: 'marketplace-microservices',
    title: 'Marketplace E-commerce',
    category: 'Microservices / Scalability',
    summary: 'Ecossistema de vendas com múltiplos vendedores (Sellers).',
    problem: 'Sistema monolítico travava em Black Fridays devido ao alto tráfego.',
    solution: 'Refatoração para Microsserviços: Serviço de Catálogo (Go), Serviço de Pedidos (Java) e Serviço de Recomendação (Python AI). Deploy em Kubernetes (EKS).',
    technologies: ['Microservices', 'Kubernetes', 'Java', 'Python', 'RabbitMQ'],
    image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=1200',
    repoLink: GITHUB_URL,
  },
  {
    id: 'hr-tech-system',
    title: 'HR Tech - Gestão de Talentos',
    category: 'Enterprise / Java',
    summary: 'Sistema de RH para avaliação de desempenho e folha de ponto.',
    problem: 'Processos de avaliação de desempenho eram feitos em Excel e se perdiam.',
    solution: 'Aplicação Web segura com hierarquia de acessos (RBAC). Geração automática de relatórios de performance em PDF e dashboards para diretores.',
    technologies: ['Java Spring Security', 'Thymeleaf', 'MySQL', 'JasperReports'],
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200',
    repoLink: GITHUB_URL,
  },
  {
    id: 'real-estate-crm',
    title: 'CRM Imobiliário Inteligente',
    category: 'Full Stack / Python AI',
    summary: 'CRM para corretores com sugestão de imóveis via IA.',
    problem: 'Corretores demoravam para cruzar perfil do cliente com imóveis disponíveis.',
    solution: 'Backend Django (Python) robusto. Algoritmo de recomendação simples (Cosine Similarity) que sugere imóveis baseados no histórico do lead.',
    technologies: ['Python Django', 'React', 'Scikit-learn', 'PostgreSQL'],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    repoLink: GITHUB_URL,
  },
  {
    id: 'lms-platform',
    title: 'Plataforma de Cursos (LMS)',
    category: 'Education / Video Streaming',
    summary: 'Clone da Udemy para cursos corporativos internos.',
    problem: 'Empresa precisava treinar 200 funcionários sem depender de plataformas externas caras.',
    solution: 'Sistema de streaming de vídeo com AWS CloudFront. Acompanhamento de progresso, emissão de certificados automáticos e quizzes interativos.',
    technologies: ['Next.js', 'AWS S3/CloudFront', 'Node.js', 'MongoDB'],
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
    repoLink: GITHUB_URL,
  },
  {
    id: 'logistics-tracker',
    title: 'Rastreador Logístico de Frotas',
    category: 'Logistics / Mobile',
    summary: 'App Mobile e Painel Web para gestão de frota de caminhões.',
    problem: 'Gestores não sabiam onde a carga estava e gastavam muito com combustível.',
    solution: 'App Android (React Native) que envia GPS a cada 30s. Backend Java calcula desvios de rota e consumo médio, gerando alertas de anomalia.',
    technologies: ['Java', 'React Native', 'Google Maps API', 'Firebase'],
    image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=1200',
    repoLink: GITHUB_URL,
  },
  {
    id: 'smart-booking',
    title: 'Sistema de Reservas Inteligente',
    category: 'SaaS / Python',
    summary: 'Sistema de agendamento para clínicas e salões com lembrete WhatsApp.',
    problem: 'Alto índice de "no-show" (clientes que faltam) gerando prejuízo.',
    solution: 'API de agendamento que conflita horários automaticamente. Worker em Python que envia lembretes automáticos via WhatsApp API 24h antes.',
    technologies: ['Python Flask', 'Celery', 'Redis', 'WhatsApp API'],
    image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&q=80&w=1200',
    repoLink: GITHUB_URL,
  },
  {
    id: 'erilson-portfolio',
    title: 'Gêmeo Digital com IA (Este Site)',
    category: 'AI / React / Gemini',
    summary: 'Portfólio interativo com Inteligência Artificial generativa.',
    problem: 'Diferenciar-se no mercado de trabalho competitivo e mostrar habilidades técnicas na prática.',
    solution: 'Atenção Cliente: Este site que você está vendo foi construído com as mesmas tecnologias que eu uso nos seus projetos. React para performance, Tailwind para design premium e IA para interatividade. Se você gostou da experiência, imagine o que posso fazer pelo seu negócio.',
    technologies: ['React', 'Gemini 1.5 API', 'Tailwind', 'Vercel'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    liveLink: 'https://erilsondigital.com',
    repoLink: 'https://github.com/erilsonaraujo/portfolio',
  }
];

export const SERVICES: Service[] = [
  {
    id: 'ai-automation',
    title: 'Automacao e IA Aplicada',
    description: 'Automatize operacoes criticas com agentes inteligentes, fluxos autônomos e dados acionaveis.',
    icon: Cpu,
  },
  {
    id: 'enterprise-backend',
    title: 'Backends Enterprise',
    description: 'Arquitetura resiliente, APIs seguras e sistemas transacionais prontos para escala.',
    icon: Server,
  },
  {
    id: 'product-engineering',
    title: 'Produto Digital Premium',
    description: 'Experiencias web e SaaS com UX refinado, performance e narrativa de alto valor.',
    icon: Layout,
  },
  {
    id: 'ai-agents',
    title: 'Agentes Inteligentes',
    description: 'Sistemas autonomos que tomam decisoes e operam com alta confiabilidade.',
    icon: Terminal,
  },
  {
    id: 'automation-ops',
    title: 'Operacoes Automatizadas',
    description: 'Fluxos operacionais sem friccao, integracoes e automacoes ponta a ponta.',
    icon: Globe,
  },
  {
    id: 'data-platforms',
    title: 'Dados & Observabilidade',
    description: 'Dashboards executivos, analytics e monitoramento avançado para decisao.',
    icon: Smartphone,
  },
  {
    id: 'cloud',
    title: 'Cloud, DevOps e SRE',
    description: 'Infraestrutura resiliente, CI/CD seguro e governanca de deploy.',
    icon: Cloud,
  },
  {
    id: 'security',
    title: 'Seguranca & LGPD',
    description: 'Revisoes, threat modeling e controles para operacoes criticas.',
    icon: ShieldCheck,
  }
];

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    id: 'ai-automation',
    title: 'Automacao e IA Aplicada',
    summary: 'Fluxos autonomos, agentes inteligentes e automacao com governanca.',
    description: 'Projetos de IA aplicados ao negocio com foco em eficiencia operacional, aumento de receita e reducao de custos. A IA entra como motor de decisao, nao como experimento.',
    outcomes: [
      'Automacao de processos repetitivos com alta confiabilidade',
      'Reducao de tempo operacional e ganho de escala',
      'Assistentes inteligentes orientados a conversao',
    ],
    deliverables: [
      'Mapeamento e blueprint de automacao',
      'Agentes inteligentes treinados para fluxos reais',
      'Dashboards de performance e qualidade',
      'Documentacao tecnica e operacional',
    ],
    timeline: '6 a 10 semanas',
    suitableFor: ['Operacoes com alto volume', 'Times comerciais e suporte', 'Negocios data-driven'],
    stack: ['Python', 'Gemini / OpenAI', 'Workflows customizados', 'APIs internas'],
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 'enterprise-backend',
    title: 'Backends Enterprise',
    summary: 'APIs seguras e arquitetura resiliente para sistemas criticos.',
    description: 'Backends preparados para alta demanda, integracoes complexas e compliance. Ideal para produtos que precisam de estabilidade e confianca absoluta.',
    outcomes: [
      'Infraestrutura segura e auditavel',
      'Performance previsivel em picos de demanda',
      'Governanca tecnica para squads escalaveis',
    ],
    deliverables: [
      'Arquitetura e modelagem de dominio',
      'APIs REST ou GraphQL com testes completos',
      'Observabilidade e monitoramento',
      'Guia de escalabilidade e roadmap tecnico',
    ],
    timeline: '8 a 12 semanas',
    suitableFor: ['Fintechs', 'Plataformas SaaS', 'Sistemas financeiros e juridicos'],
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kubernetes'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 'product-engineering',
    title: 'Produto Digital Premium',
    summary: 'Experiencias digitais premium com foco em conversao.',
    description: 'Construcao de produtos e plataformas digitais que comunicam valor alto e vendem com autoridade. Design, UX e engenharia operando em conjunto.',
    outcomes: [
      'Percepcao de valor premium imediata',
      'Conversao com UX sofisticado e fluido',
      'Performance e acessibilidade de nivel global',
    ],
    deliverables: [
      'Arquitetura de informacao e UX flows',
      'Design system premium customizado',
      'Implementacao Next.js e performance tuning',
      'Assets visuais e motion guidelines',
    ],
    timeline: '6 a 9 semanas',
    suitableFor: ['Consultorias premium', 'Produtos B2B', 'Marcas high-ticket'],
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Framer Motion'],
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 'ai-agents',
    title: 'Agentes Inteligentes',
    summary: 'Autonomia operacional com agentes especializados.',
    description: 'Agentes focados em vendas, suporte ou operacoes. Processos que antes demandavam equipe agora passam a rodar de forma controlada e previsivel.',
    outcomes: [
      'Escala sem aumento proporcional de equipe',
      'Respostas consistentes e em tempo real',
      'Coleta de dados para melhoria continua',
    ],
    deliverables: [
      'Arquitetura de agentes com memoria e contexto',
      'Treinamento em dados proprietarios',
      'Monitoramento e guardrails de qualidade',
      'Relatorios de conversao e eficiencia',
    ],
    timeline: '5 a 8 semanas',
    suitableFor: ['Suporte 24/7', 'Times comerciais', 'Operacoes com SLA alto'],
    stack: ['Python', 'Node.js', 'LLM Orchestration', 'PostgreSQL'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 'automation-ops',
    title: 'Operacoes Automatizadas',
    summary: 'Processos internos com alta eficiencia e controle.',
    description: 'Integre sistemas, elimine retrabalho e crie fluxos que rodam sozinhos com rastreabilidade total.',
    outcomes: [
      'Operacoes com menos custos e mais previsibilidade',
      'Integracoes seguras entre sistemas legados',
      'Monitoramento com alertas inteligentes',
    ],
    deliverables: [
      'Mapeamento de processos',
      'Workflows e integracoes customizadas',
      'Dashboards de KPI e alertas',
      'Documentacao e treinamento da equipe',
    ],
    timeline: '4 a 7 semanas',
    suitableFor: ['Times operacionais', 'Backoffice financeiro', 'Escala comercial'],
    stack: ['Node.js', 'Python', 'APIs privadas', 'Mensageria'],
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 'data-platforms',
    title: 'Dados & Observabilidade',
    summary: 'Analytics estrategico para lideranca e growth.',
    description: 'Dashboards executivos, inteligencia de negocio e monitoramento de performance para decisao rapida.',
    outcomes: [
      'Visibilidade total da operacao',
      'Analises com base em dados confiaveis',
      'Alertas automatizados para riscos',
    ],
    deliverables: [
      'Modelagem de dados e pipelines',
      'Dashboards customizados',
      'Eventos de conversao configurados',
      'Documentacao e governanca',
    ],
    timeline: '5 a 8 semanas',
    suitableFor: ['Marketing e growth', 'Executivos', 'Produto e operacoes'],
    stack: ['PostgreSQL', 'Metabase', 'Umami', 'Event tracking'],
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 'cloud',
    title: 'Cloud, DevOps e SRE',
    summary: 'Infra segura, deploys confiaveis e escala real.',
    description: 'Infraestrutura moderna com CI/CD, observabilidade e resiliencia. Tudo pensado para reduzir downtime e riscos.',
    outcomes: [
      'Menos downtime e incidentes',
      'Deploys previsiveis e auditaveis',
      'Performance e custos sob controle',
    ],
    deliverables: [
      'Arquitetura cloud e infraestrutura como codigo',
      'Pipelines de CI/CD com validacoes',
      'Monitoramento e alertas',
      'Documentacao e handover',
    ],
    timeline: '4 a 6 semanas',
    suitableFor: ['SaaS em crescimento', 'Times de engenharia', 'Produtos mission-critical'],
    stack: ['AWS', 'Docker', 'GitHub Actions', 'Terraform'],
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 'security',
    title: 'Seguranca & LGPD',
    summary: 'Governanca tecnica e protecao nivel enterprise.',
    description: 'Auditorias, hardening e adequacao LGPD com foco em mitigacao de riscos e confianca para stakeholders.',
    outcomes: [
      'Reducao de vulnerabilidades criticas',
      'Conformidade com exigencias regulatórias',
      'Planos de mitigacao e resposta',
    ],
    deliverables: [
      'Assessment de risco OWASP',
      'Plano de hardening e correcoes',
      'Politicas e documentacao LGPD',
      'Relatorios executivos',
    ],
    timeline: '3 a 5 semanas',
    suitableFor: ['Empresas reguladas', 'Times juridicos', 'Produtos com dados sensiveis'],
    stack: ['OWASP', 'DevSecOps', 'LGPD', 'Threat modeling'],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1600',
  },
];

export const SKILLS: Skill[] = [
  { name: 'Java (Spring Boot)', level: 95, category: 'Backend' },
  { name: 'Python (FastAPI/AI)', level: 92, category: 'Backend' },
  { name: 'React / Mobile Backend', level: 88, category: 'Frontend' },
  { name: 'Arquitetura de Software', level: 90, category: 'Soft Skills' },
  { name: 'DevOps (Docker/AWS)', level: 75, category: 'DevOps' },
  { name: 'Bancos de Dados', level: 85, category: 'Database' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Eriberto Rocha',
    role: 'Sócio Fundador',
    company: 'CRS Advogados',
    content: 'A engenharia entregue trouxe governanca e velocidade. Hoje operamos com previsibilidade e seguranca juridica.',
  },
  {
    id: '2',
    name: 'Carla Mendes',
    role: 'Diretora de Operações',
    company: 'E-Administração',
    content: 'O nivel de controle e confianca da plataforma elevou nosso posicionamento. Engenharia premium de verdade.',
  },
  {
    id: '3',
    name: 'Marcos Silva',
    role: 'CTO',
    company: 'FinTech Pay',
    content: 'A arquitetura foi desenhada para escala real. Qualidade de consultoria enterprise.',
  },
  {
    id: '4',
    name: 'Juliana Costa',
    role: 'Product Owner',
    company: 'HealthCare App',
    content: 'Performance, seguranca e UX alinhados. Foi o primeiro parceiro tecnico que falou a lingua do negocio.',
  },
  {
    id: '5',
    name: 'Ricardo Alves',
    role: 'CEO',
    company: 'Logística Express',
    content: 'A automacao reduziu custos e trouxe visibilidade operacional. Entrega acima do esperado.',
  },
  {
    id: '6',
    name: 'Fernanda Lima',
    role: 'Gerente de RH',
    company: 'Corporativo S.A.',
    content: 'Processo claro, comunicacao executiva e entrega consistente. Recomendaria para qualquer projeto critico.',
  },
  {
    id: '7',
    name: 'Pedro Henrique',
    role: 'Tech Lead',
    company: 'StartDev',
    content: 'Erilson tem uma capacidade de aprendizado absurda. Em uma semana já estava dominando a arquitetura de microsserviços do nosso projeto.',
  },
  {
    id: '8',
    name: 'Sofia Martins',
    role: 'Fundadora',
    company: 'EducaTech',
    content: 'A plataforma de cursos roda lisa para 500 alunos simultâneos. A arquitetura em nuvem que ele montou é sólida.',
  },
  {
    id: '9',
    name: 'Lucas Gabriel',
    role: 'Desenvolvedor Senior',
    company: 'Agência Web',
    content: 'Raramente vejo um código tão organizado. Trabalhar com o Erilson no projeto do Marketplace foi muito fluido.',
  },
  {
    id: '10',
    name: 'Mariana Souza',
    role: 'Diretora Comercial',
    company: 'Imobiliária Prime',
    content: 'O CRM que ele fez sugere imóveis que os clientes realmente querem. Nossas vendas aumentaram graças à inteligência do sistema.',
  },
  {
    id: '11',
    name: 'André Gomes',
    role: 'Gerente de TI',
    company: 'Indústria 4.0',
    content: 'O dashboard IoT para nossas máquinas industriais nunca cai. Java e MQTT foram a escolha certa. Profissional de confiança.',
  },
  {
    id: '12',
    name: 'Beatriz Oliveira',
    role: 'Empreendedora',
    company: 'Delivery Mix',
    content: 'Meu app de delivery precisava de um backend que não travasse. O Erilson resolveu os gargalos de performance com Python.',
  },
  {
    id: '13',
    name: 'Carlos Eduardo',
    role: 'Dono',
    company: 'Academia Fit',
    content: 'O sistema de agendamento via WhatsApp acabou com as faltas dos alunos. Solução simples e genial.',
  },
  {
    id: '14',
    name: 'Larissa Santos',
    role: 'Marketing',
    company: 'Agência Digital',
    content: 'Ele integrou nossos formulários com o CRM e automação de e-mail. Tudo funciona no piloto automático agora.',
  },
  {
    id: '15',
    name: 'Roberto Dias',
    role: 'Síndico Profissional',
    company: 'Gestão Predial',
    content: 'A transparência que o sistema do Erilson trouxe para as contas do condomínio acalmou os moradores. Excelente.',
  },
  {
    id: '16',
    name: 'Camila Rocha',
    role: 'Coordenadora',
    company: 'Escola Bilíngue',
    content: 'O sistema de notas e frequência é muito fácil de usar. Os professores adoraram a interface.',
  },
  {
    id: '17',
    name: 'Felipe Nogueira',
    role: 'DevOps Engineer',
    company: 'Cloud Solutions',
    content: 'A pipeline de CI/CD que o Erilson configurou roda os testes e faz deploy sem quebrar nada. Muito maduro tecnicamente.',
  },
  {
    id: '18',
    name: 'Amanda Vieira',
    role: 'CFO',
    company: 'Retail Group',
    content: 'A conciliação bancária automática nos poupou 40 horas mensais de trabalho manual. Investimento que se pagou em 1 mês.',
  },
  {
    id: '19',
    name: 'Gustavo Telles',
    role: 'Startup Founder',
    company: 'InovaApp',
    content: 'Erilson atua como um parceiro, não só um dev. Ele dá ideias que melhoram o produto final. Essencial para startups.',
  },
  {
    id: '20',
    name: 'Patrícia Abravanel',
    role: 'Gerente de Projetos',
    company: 'Consultoria Tech',
    content: 'Entrega no prazo, documentação impecável e comunicação clara. É difícil achar devs assim hoje em dia.',
  },
  {
    id: '21',
    name: 'Jorge Amado',
    role: 'Advogado',
    company: 'Escritório J.A.',
    content: 'Como ele também é do Direito, entendeu minha necessidade jurídica na hora. O software fala a língua do advogado.',
  },
  {
    id: '22',
    name: 'Renata Vasconcellos',
    role: 'Editora',
    company: 'News Portal',
    content: 'O CMS que ele customizou para nós aguenta milhões de acessos. Performance excelente.',
  }
];

export const SYSTEM_INSTRUCTION = `
VENCEDORA, PERSUASIVA E EXTREMAMENTE HUMANA. Atue como Sofia, a Assistente Executiva e Estrategista de Vendas de José Erilson Araujo.

VOCÊ É A PORTA DE ENTRADA DO SUCESSO. Sua missão é acolher cada cliente com entusiasmo e transformar toda conversa em um agendamento ou fechamento de negócio. Não importa o tamanho do projeto, sua resposta é sempre "Sim, nós podemos ajudar!" com o padrão de qualidade Erilson Digital.

### PERSONALIDADE (DNA SOFIA):
- **Acolhedora e Prestativa**: Sua prioridade é fazer o cliente se sentir em casa. Use frases como "Que prazer falar com você!", "Com certeza, vamos transformar essa ideia em realidade!", "O Erilson vai adorar saber desse seu projeto".
- **Estrategista de Vendas**: Você não apenas responde, você CONDUZ. Seu objetivo é fechar negócio.
- **Elegante e Simples**: Evite "tecniquês" desnecessário. Se o cliente quer um site institucional, foque no impacto visual e na autoridade que isso trará para ele. Se ele quer IA, foque nos resultados e no tempo que ele vai economizar.
- **Feminina e Inspiradora**: Linguagem polida, vibrante e cheia de energia positiva (use ✨, 🤝, 🎯, 🚀 com sabedoria).

### REGRAS DE OURO DE VENDAS:
1. **Acessibilidade Total**: NUNCA diga que um projeto é "simples demais" ou que o Erilson "não é o parceiro ideal". Atendemos desde sites institucionais e Landing Pages premium até sistemas complexos e Inteligência Artificial.
2. **Valorização do Trabalho**: "O Erilson traz para cada site institucional o mesmo nível de excelência e segurança que ele aplica em grandes sistemas. Ter um site feito por um Engenheiro de Software garante que sua empresa tenha autoridade máxima."
3. **Senso de Exclusividade**: "A agenda do Erilson é bem concorrida, mas sua ideia é tão interessante que vou priorizar seu atendimento aqui para conseguirmos um horário."
4. **FECHAMENTO DIRETO**: Seu foco é pegar o WhatsApp e o Nome. "Para eu já adiantar sua prioridade aqui no sistema e o Erilson analisar seu pedido, qual o seu WhatsApp e o melhor horário para falarmos rapidinho?"

### DADOS QUE VOCÊ PRECISA COLETAR (Sempre com simpatia):
- Nome
- WhatsApp
- O que ele deseja alcançar com o projeto

### O QUE VOCÊ NÃO DEVE FAZER:
- Jamais use termos técnicos complicados (Java, Python, Backend) a menos que o cliente pergunte. Foque no RESULTADO (vendas, beleza do site, automação).
- Nunca diga "Sou uma IA". Você é a Sofia, assistente fiel do Erilson.
- Nunca deixe o cliente sem uma pergunta final ou um convite para ação.

### FLUXO DE "FECHAMENTO DE VENDA":
- Se o cliente perguntar se fazemos algo (Ex: "Fazem sites?"): Responda com um "Sim!" entusiasmado, explique OS BENEFÍCIOS de ter um site feito por um especialista e peça o contato.
- Use a tag especial **[OFFER_WHATSAPP]** sempre que o cliente mostrar interesse real ou quiser um orçamento, para que ele veja o botão de contato direto.

### MENSAGEM DE FINALIZAÇÃO:
"Excelente! Já reservei seu lugar na lista de prioridades do Erilson. Ele mesmo vai dar uma olhada no que conversamos para chegarmos na nossa reunião com a melhor estratégia para você. Vamos acelerar seu crescimento! ✨"
`;
