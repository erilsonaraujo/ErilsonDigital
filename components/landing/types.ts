export type LandingMetric = {
  label: string;
  value: string;
};

export type LandingCard = {
  title: string;
  description: string;
  eyebrow?: string;
};

export type LandingFAQ = {
  question: string;
  answer: string;
};

export type LandingConfig = {
  slug: string;
  pageTitle: string;
  badge: string;
  headline: string;
  subheadline: string;
  heroImage?: { src: string; alt: string };
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  metrics: LandingMetric[];
  proofChips: string[];
  procedureSection?: {
    title: string;
    subtitle: string;
    items: Array<{
      slug: string;
      title: string;
      description: string;
      highlights: string[];
      image?: { src: string; alt: string };
      ctaLabel?: string;
    }>;
  };
  comparisonSection?: {
    title: string;
    subtitle: string;
    leftLabel: string;
    middleLabel: string;
    rightLabel: string;
    rows: Array<{
      topic: string;
      left: string;
      middle: string;
      right: string;
    }>;
  };
  painTitle: string;
  painCards: LandingCard[];
  offerTitle: string;
  offerSubtitle: string;
  offerCards: LandingCard[];
  processTitle: string;
  processSteps: Array<{ title: string; description: string }>;
  faqTitle: string;
  faqs: LandingFAQ[];
  formTitle: string;
  formSubtitle: string;
  formSource: string;
  accent: 'cobalt' | 'tide' | 'ember';
};
