import { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';
import { Manrope, Space_Grotesk } from 'next/font/google';
import RootLayoutWrapper from './layout-wrapper';
import TrackingScripts from '@/components/TrackingScripts';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
    metadataBase: new URL('https://erilsondigital.com'),
    title: 'Erilson Digital | Engenharia de Software, IA e Produto',
    description: 'Consultoria premium em engenharia de software, automacao e IA aplicada para negocios de alto crescimento.',
    applicationName: 'Erilson Digital',
    openGraph: {
        title: 'Erilson Digital | Consultoria Premium em Engenharia, IA e Produto',
        description: 'Solucoes digitais de alto impacto com engenharia robusta, seguranca e performance de nivel global.',
        url: 'https://erilsondigital.com',
        siteName: 'Erilson Digital',
        images: [
            {
                url: '/erilson.jpg',
                width: 1200,
                height: 630,
                alt: 'Erilson Digital - Consultoria Premium',
            },
        ],
        locale: 'pt_BR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Erilson Digital | Consultoria Premium em Engenharia',
        description: 'Engenharia de software, IA aplicada e entregas de alto padrao para empresas ambiciosas.',
        images: ['/erilson.jpg'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const orgSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Erilson Digital',
        url: 'https://erilsondigital.com',
        contactPoint: [
            {
                '@type': 'ContactPoint',
                contactType: 'sales',
                email: 'joseerilsonaraujo@gmail.com',
                telephone: '+55-84-99434-9355',
            },
        ],
    };

    return (
        <html lang="pt-BR" className={`${manrope.variable} ${spaceGrotesk.variable} scroll-smooth`} suppressHydrationWarning>
            <body className="bg-ink-950 text-graphite-100 font-sans selection:bg-cobalt-500 selection:text-white">
                <TrackingScripts />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
                <Providers>
                    <RootLayoutWrapper>
                        {children}
                    </RootLayoutWrapper>
                </Providers>
            </body>
        </html>
    );
}
