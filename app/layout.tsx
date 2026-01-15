import { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';
import { Manrope, Space_Grotesk } from 'next/font/google';
import RootLayoutWrapper from './layout-wrapper';
import TrackingScripts from '@/components/TrackingScripts';
import Script from 'next/script';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
    metadataBase: new URL('https://erilsondigital.com'),
    title: 'Erilson Digital | Produto Digital, IA e Growth',
    description: 'Consultoria premium em produto digital, automacao e IA aplicada para negocios de alto crescimento.',
    applicationName: 'Erilson Digital',
    openGraph: {
        title: 'Erilson Digital | Consultoria Premium em Produto, IA e Growth',
        description: 'Solucoes digitais de alto impacto com qualidade, seguranca e performance de nivel global.',
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
        title: 'Erilson Digital | Consultoria Premium em Produto',
        description: 'Produto digital, IA aplicada e entregas de alto padrao para empresas ambiciosas.',
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
    const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
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
        <html lang="pt-BR" className={`${manrope.variable} ${spaceGrotesk.variable} scroll-smooth light`} suppressHydrationWarning>
            <body className="bg-graphite-50 text-graphite-700 font-sans selection:bg-cobalt-500 selection:text-white">
                <TrackingScripts />
                {recaptchaKey && (
                    <Script
                        src={`https://www.google.com/recaptcha/api.js?render=${recaptchaKey}`}
                        strategy="afterInteractive"
                    />
                )}
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
