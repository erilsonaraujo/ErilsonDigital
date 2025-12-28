import { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';
import { Inter, Outfit } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
    title: 'ErilsonDigital - Desenvolvimento Full Stack & AI',
    description: 'Softwares premium, IA e automação para escalar seu negócio.',
};

import RootLayoutWrapper from './layout-wrapper';
import Script from 'next/script';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
            <head>
                <Script
                    src="https://cloud.umami.is/script.js"
                    data-website-id="458b37ce-b9e9-4105-aa3b-0f15f0f54d1f"
                    strategy="afterInteractive"
                />
            </head>
            <body className="bg-dark-950 text-slate-300 font-sans selection:bg-primary-600 selection:text-white">
                <Providers>
                    <RootLayoutWrapper>
                        {children}
                    </RootLayoutWrapper>
                </Providers>
            </body>
        </html>
    );
}
