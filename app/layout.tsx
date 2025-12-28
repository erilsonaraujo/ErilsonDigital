import { Metadata } from 'next';
import { Providers } from './providers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './globals.css';
import { Inter, Outfit } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
    title: 'ErilsonDigital - Desenvolvimento Full Stack & AI',
    description: 'Softwares premium, IA e automação para escalar seu negócio.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
            <body className="bg-dark-950 text-slate-300 font-sans selection:bg-primary-600 selection:text-white">
                <Providers>
                    <Navbar />
                    <main className="flex-grow flex flex-col pt-16">
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
