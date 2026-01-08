import { LucideIcon } from 'lucide-react';

export type Language = 'pt' | 'en' | 'es';
export type Theme = 'light' | 'dark';

export interface Project {
  id: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  technologies: string[];
  image: string;
  repoLink?: string;
  liveLink?: string;
  category: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ServiceDetail {
  id: string;
  title: string;
  summary: string;
  description: string;
  outcomes: string[];
  deliverables: string[];
  timeline: string;
  suitableFor: string[];
  stack: string[];
  image: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'assistant';
  text: string;
  isActionable?: boolean;
  // actionType indicates which actionable button(s) to show: 'whatsapp', 'booking', or 'both'
  actionType?: 'whatsapp' | 'booking' | 'both';
  pdfLink?: string; // URL to stored PDF on server
}

export interface Skill {
  name: string;
  level: number;
  category: 'Backend' | 'Frontend' | 'DevOps' | 'Database' | 'Soft Skills';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
}

export interface Translations {
  nav: {
    home: string;
    services: string;
    cases: string;
    process: string;
    about: string;
    contact: string;
    booking: string;
    themeToggle: string;
    languageToggle: string;
    menuToggle: string;
    forClinics: string;
    esthetics: string;
    surgery: string;
    dentistry: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    industriesLabel: string;
    industries: string[];
    highlights: { title: string; text: string }[];
    profileCards: { label: string; value: string }[];
  };
  services: {
    title: string;
    subtitle: string;
    note: string;
    cta: string;
  };
  process: {
    title: string;
    subtitle: string;
    stepLabel: string;
    steps: {
      title: string;
      text: string;
    }[];
  };
  projects: {
    title: string;
    subtitle: string;
    challenge: string;
    solution: string;
    viewProject: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
    lead: string;
  };
  booking: {
    label: string;
    title: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    items: string[];
    form: {
      dateLabel: string;
      timeLabel: string;
    };
    successTitle: string;
    successDescription: string;
    error: string;
  };
  about: {
    label: string;
    headline: string;
    description: string;
    highlights: { title: string; text: string }[];
    ctaPrimary: string;
    ctaSecondary: string;
    stackLabel: string;
  };
  contact: {
    title: string;
    subtitle: string;
    description: string;
    labels: {
      name: string;
      email: string;
      phone: string;
      company: string;
      projectType: string;
      budget: string;
      timeline: string;
      message: string;
    };
    projectOptions: string[];
    budgetOptions: string[];
    timelineOptions: string[];
    cta: string;
    ctaSending: string;
    ctaSent: string;
    success: string;
    error: string;
    whatsapp: string;
    infoLocation: string;
  };
  ai: {
    name: string;
    role: string;
    status: string;
    errorFallback: string;
    conversationTitle: string;
    conversationUserLabel: string;
    conversationAssistantLabel: string;
    subtitle: string;
    disclaimer: string;
    suggestions: string[];
    helpLabel: string;
    placeholder: string;
    bookingCta: string;
    whatsappCta: string;
  };
  servicePage: {
    outcomesLabel: string;
    deliverablesLabel: string;
    timelineLabel: string;
    stackLabel: string;
    idealForLabel: string;
  };
}
