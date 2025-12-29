import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { SERVICE_DETAILS } from '@/constants';
import Breadcrumbs from '@/components/Breadcrumbs';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_DETAILS.map((service) => ({ slug: service.id }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICE_DETAILS.find((item) => item.id === slug);
  if (!service) return {};
  return {
    title: `${service.title} | Erilson Digital`,
    description: service.summary,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = SERVICE_DETAILS.find((item) => item.id === slug);
  if (!service) return notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'Erilson Digital',
      url: 'https://erilsondigital.com',
    },
  };

  return (
    <div className="min-h-screen bg-ink-950 pt-28 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs />
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Servico premium</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white mt-4">{service.title}</h1>
            <p className="text-lg text-graphite-300 mt-6">{service.description}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/agendar" className="primary-cta">
                Agendar diagnostico <ArrowUpRight size={16} />
              </Link>
              <Link href="/contato" className="secondary-cta">
                Enviar briefing
              </Link>
            </div>

            <div className="mt-10 rounded-[24px] border border-graphite-800 bg-ink-900/70 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Resultados esperados</p>
              <ul className="mt-4 space-y-3 text-sm text-graphite-200">
                {service.outcomes.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-tide-300 mt-1" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-[32px] border border-graphite-800 bg-ink-900/70 p-6">
            <div className="rounded-[24px] overflow-hidden border border-graphite-800">
              <Image
                src={service.image}
                alt={service.title}
                width={600}
                height={520}
                className="h-64 w-full object-cover"
              />
            </div>
            <div className="mt-6 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Entregaveis</p>
                <ul className="mt-3 space-y-2 text-sm text-graphite-200">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-cobalt-300 mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Timeline media</p>
                <p className="text-sm text-graphite-200 mt-2">{service.timeline}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Stack recomendada</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {service.stack.map((item) => (
                    <span key={item} className="rounded-full border border-graphite-700 px-3 py-1 text-[11px] text-graphite-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-graphite-500">Indicado para</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {service.suitableFor.map((item) => (
                    <span key={item} className="rounded-full border border-graphite-700 px-3 py-1 text-[11px] text-graphite-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
