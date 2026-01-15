import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SERVICE_DETAILS_BY_LANG } from '@/constants';
import Breadcrumbs from '@/components/Breadcrumbs';
import ServicePageContent from '@/components/pages/ServicePageContent';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_DETAILS_BY_LANG.pt.map((service) => ({ slug: service.id }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICE_DETAILS_BY_LANG.pt.find((item) => item.id === slug);
  if (!service) return {};
  return {
    title: `${service.title} | Erilson Digital`,
    description: service.summary,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const pt = SERVICE_DETAILS_BY_LANG.pt.find((item) => item.id === slug);
  const en = SERVICE_DETAILS_BY_LANG.en.find((item) => item.id === slug);
  const es = SERVICE_DETAILS_BY_LANG.es.find((item) => item.id === slug);
  if (!pt || !en || !es) return notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: pt.title,
    description: pt.description,
    provider: {
      '@type': 'Organization',
      name: 'Erilson Digital',
      url: 'https://erilsondigital.com',
    },
  };

  return (
    <div className="min-h-screen bg-ink-950 pt-10 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs />
        <ServicePageContent detailsByLanguage={{ pt, en, es }} />
      </div>
    </div>
  );
}
