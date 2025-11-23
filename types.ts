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

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isActionable?: boolean;
  // actionType indicates which actionable button(s) to show: 'whatsapp', 'calendly', or 'both'
  actionType?: 'whatsapp' | 'calendly' | 'both';
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
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  ai: {
    title: string;
    subtitle: string;
    placeholder: string;
    disclaimer: string;
    suggestion1: string;
    suggestion2: string;
    suggestion3: string;
    help_label: string;
  };
  services: {
    title: string;
    subtitle: string;
  };
  projects: {
    title: string;
    subtitle: string;
    problem: string;
    solution: string;
    viewCode: string;
    viewProject: string;
  };
  about: {
    title: string;
    text1: string;
    text2: string;
    text3: string;
    stats_projects: string;
    stats_commitment: string;
    methodology_title: string;
    methodology_text: string;
  };
  contact: {
    title: string;
    subtitle: string;
    nameLabel: string;
    emailLabel: string;
    msgLabel: string;
    btnSend: string;
    btnSending: string;
    btnSent: string;
    whatsappBtn: string;
  };
  nav: {
    services: string;
    portfolio: string;
    about: string;
    contact: string;
    booking: string;
  };
  booking: {
    title: string;
    subtitle: string;
  };
}