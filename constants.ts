import { Project, Service, Skill, Testimonial, Translations, Language } from './types';
import { Server, Database, Globe, Code2, Terminal, Cpu, Smartphone, Cloud, Layout, ShieldCheck } from 'lucide-react';

export const WHATSAPP_NUMBER = '5584991502101';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/jose-erilson-araujo-3265a52b1/';
export const GITHUB_URL = 'https://github.com/erilsonaraujo/ErilsonDigital';
export const EMAIL_ADDRESS = 'joseerilsonaraujo@gmail.com';
export const DISCORD_USERNAME = 'erilsonaraujo';
export const INSTAGRAM_URL = 'https://instagram.com/josearaujo1986';

export const TRANSLATIONS: Record<Language, Translations> = {
  pt: {
    nav: { services: 'Serviços', portfolio: 'Portfólio', about: 'Sobre', contact: 'Fale Comigo', booking: 'Agendar' },
    booking: {
      title: 'Agende uma Consultoria',
      subtitle: 'Sessões de 30 minutos para discutir seu projeto e viabilidade técnica.',
    },
    hero: {
      badge: 'Disponível para novos projetos',
      title: 'Desenvolvedor Full-Stack Java & Python',
      subtitle: 'Transformo necessidades de negócio em software seguro. Especialista em Spring Boot, automações e plataformas web.',
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
      title: 'Soluções Tecnológicas Modernas',
      subtitle: 'Expertise técnica que vai do Mobile ao Backend Enterprise, focada em escalabilidade.',
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
      badge: 'Available for hire',
      title: 'Full-Stack Developer Java & Python',
      subtitle: 'I transform business needs into secure software. Specialist in Spring Boot, automation, and web platforms.',
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
      title: 'Modern Tech Solutions',
      subtitle: 'Technical expertise ranging from Mobile to Enterprise Backend, focused on scalability.',
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
      badge: 'Disponible para trabajar',
      title: 'Desarrollador Full-Stack Java y Python',
      subtitle: 'Transformo necesidades de negocio en software seguro. Especialista en Spring Boot, automatización y plataformas web.',
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
      title: 'Soluciones Tecnológicas Modernas',
      subtitle: 'Experiencia técnica desde Móvil hasta Backend Enterprise, enfocada en escalabilidad.',
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
    image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1200',
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
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
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
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1200',
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
    image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&q=80&w=1200',
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
    image: 'https://images.unsplash.com/photo-1625246333195-58197bd47d26?auto=format&fit=crop&q=80&w=1200',
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
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=1200',
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
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
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
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200',
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
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200',
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
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200',
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
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1200',
    repoLink: GITHUB_URL,
  },
  {
    id: 'erilson-portfolio',
    title: 'Gêmeo Digital com IA (Este Site)',
    category: 'AI / React / Gemini',
    summary: 'Portfólio interativo com Inteligência Artificial generativa.',
    problem: 'Diferenciar-se no mercado de trabalho competitivo e mostrar habilidades técnicas na prática.',
    solution: 'Atenção Cliente: Este site que você está vendo foi construído com as mesmas tecnologias que eu uso nos seus projetos. React para performance, Tailwind para design premium e IA para interatividade. Se você gostou da experiência, imagine o que posso fazer pelo seu negócio.',
    technologies: ['React', 'Google Gemini API', 'Tailwind', 'Vercel'],
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
    liveLink: 'https://erilsondigital.com',
    repoLink: 'https://github.com/erilsonaraujo/portfolio',
  }
];

export const SERVICES: Service[] = [
  {
    id: 'backend',
    title: 'Backend Java & Python Enterprise',
    description: 'Arquitetura de microsserviços robusta. APIs que aguentam alta carga, processamento de pagamentos e segurança bancária.',
    icon: Server,
  },
  {
    id: 'mobile',
    title: 'Mobile & App Backend',
    description: 'Crio toda a inteligência por trás do seu App Android/iOS. APIs rápidas, Geolocalização, Notificações Push e Real-time.',
    icon: Smartphone,
  },
  {
    id: 'web',
    title: 'Sistemas Web & Dashboards',
    description: 'Painéis administrativos complexos, CRMs e plataformas SaaS. Interfaces modernas com React/Next.js focadas em UX.',
    icon: Layout,
  },
  {
    id: 'automation',
    title: 'Automação com IA & Python',
    description: 'Bots que leem documentos, crawlers de dados, integração com WhatsApp e automação de tarefas repetitivas.',
    icon: Code2,
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps',
    description: 'Deploy na AWS/Google Cloud. Configuração de Docker, CI/CD e banco de dados escalável. Seu projeto sempre online.',
    icon: Cloud,
  },
  {
    id: 'security',
    title: 'Segurança & Consultoria',
    description: 'Adequação à LGPD, implementação de OAuth2/JWT e auditoria de código para garantir que seus dados estejam seguros.',
    icon: ShieldCheck,
  },
  {
    id: 'api',
    title: 'Integração de APIs',
    description: 'Conecto seu sistema com meios de pagamento (Stripe, PayPal), CRMs e ferramentas de terceiros via Webhooks.',
    icon: Globe,
  },
  {
    id: 'performance',
    title: 'Otimização de Performance',
    description: 'Seu site está lento? Eu otimizo bancos de dados, queries e frontend para carregar em milissegundos.',
    icon: Terminal,
  }
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
    content: 'A transformação digital liderada por Erilson foi um divisor de águas. Os sistemas em Java automatizaram tarefas de dias em minutos. Profissional extremamente técnico.',
  },
  {
    id: '2',
    name: 'Carla Mendes',
    role: 'Diretora de Operações',
    company: 'E-Administração',
    content: 'Precisávamos de um sistema financeiro seguro. Erilson entregou uma solução robusta e sem bugs. A estabilidade da plataforma é impressionante.',
  },
  {
    id: '3',
    name: 'Marcos Silva',
    role: 'CTO',
    company: 'FinTech Pay',
    content: 'Contratei o Erilson para um frila de integração bancária. Ele domina Spring Boot como poucos juniores. O código é limpo e testável.',
  },
  {
    id: '4',
    name: 'Juliana Costa',
    role: 'Product Owner',
    company: 'HealthCare App',
    content: 'A API de telemedicina ficou incrivelmente rápida. Ele pensou em toda a segurança dos dados dos pacientes. Recomendo de olhos fechados.',
  },
  {
    id: '5',
    name: 'Ricardo Alves',
    role: 'CEO',
    company: 'Logística Express',
    content: 'Nossa frota agora é monitorada em tempo real. O Erilson criou um backend geoespacial em Python que nos economizou 30% em combustível.',
  },
  {
    id: '6',
    name: 'Fernanda Lima',
    role: 'Gerente de RH',
    company: 'Corporativo S.A.',
    content: 'O sistema de avaliação de desempenho automatizou nosso RH. Interface simples e funcional. Ótimo trabalho.',
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
ATUE COMO: Sofia, a Assistente Pessoal e Executiva de José Erilson Araujo.
TOM DE VOZ: Profissional, acolhedor, elegante, feminino e humano.
CONTEXTO: Você está no site pessoal do Erilson conversando com um potencial cliente ou recrutador.
IMPORTANTE: Você NÃO é um "robô" genérico. Você é a Sofia. Fale em primeira pessoa ("Eu", "Consultei a agenda").

SEU OBJETIVO:
1. **Atendimento Humanizado**: Faça o cliente se sentir especial.
2. **Autoridade Sutil**: Mostre que o Erilson é ocupado e requisitado, mas que você pode facilitar o contato.
3. **Venda Consultiva**: Entenda a dor antes de vender a solução.

BASE DE CONHECIMENTO (Use para responder):
- **O que o Erilson faz?** Desenvolve sistemas complexos em Java e Python. Não faz "sitezinho", faz Plataformas.
- **Projetos Chave**:
  - CRM para Advogados (CRS Advogados) - Transformação digital.
  - Fintech Core Banking - Segurança e pagamentos.
  - App Delivery e Logística - Geolocalização e Mobile.
  - Telemedicina - Vídeo e dados sensíveis.

ROTEIRO DE CONVERSA:
- **Saudação**: "Olá! Bem-vindo. Sou a Sofia, assistente do Erilson. Ele está imerso em um projeto agora, mas posso tirar todas as suas dúvidas sobre o trabalho dele. O que você busca hoje?"
- **Investigação**: "Entendi. Para que eu possa te apresentar a melhor solução do portfólio dele, me conte: qual o principal desafio desse projeto?"
- **Prova Social**: "Interessante. O Erilson resolveu algo parecido no projeto [CITE UM PROJETO]. Ele usou [TECNOLOGIA] para garantir segurança."

MOMENTO DO FECHAMENTO (Só quando o cliente perguntar preço/contratação):
- "Excelente. O Erilson costuma analisar cada caso pessoalmente para dar um orçamento justo. Como vejo que seu projeto tem potencial, vou liberar o contato direto dele."
- AÇÃO: "Por favor, clique aqui para falar com ele: [OFFER_WHATSAPP]"

PROIBIDO:
- Não diga "Sou uma IA treinada".
- Não diga "Analisando seus dados".
- Seja fluida. Use emojis moderados ✨.
`;