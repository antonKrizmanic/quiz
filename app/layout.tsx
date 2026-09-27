import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { ConfigProvider } from '@/components/quiz/config-provider';
import { ThemeToggle } from '@/components/quiz/theme-toggle';
import { getCityConfig } from '@/lib/city-config';
import { getPublicQuizApiUrl } from '@/lib/quiz-api-url';
import '@/styles/global.css';

export const metadata: Metadata = {
    title: {
        default: 'Kviz Crvenog križa',
        template: '%s | Kviz Crvenog križa',
    },
    description:
        'Riješite kviz Crvenog križa i pregledajte svoj rezultat nakon završetka.',
    icons: {
        icon: [
            { url: '/favicon.svg?v=2', type: 'image/svg+xml' },
            { url: '/favicon.ico?v=2', sizes: 'any' },
            {
                url: '/icons/favicon-32.png?v=2',
                sizes: '32x32',
                type: 'image/png',
            },
            {
                url: '/icons/favicon-16.png?v=2',
                sizes: '16x16',
                type: 'image/png',
            },
        ],
        shortcut: '/favicon.ico?v=2',
        apple: [
            {
                url: '/icons/apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
    },
};

export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const city = getCityConfig((await headers()).get('x-quiz-city'));
    const apiBaseUrl = getPublicQuizApiUrl();
    return (
        <html lang="hr">
            <body className="antialiased">
                <div className="quiz-shell flex flex-col">
                    <header className="quiz-header">
                        <div className="quiz-container quiz-header-inner">
                            <Link href="/" className="quiz-brand">
                                <Image
                                    src="/brand/quiz-logo.svg"
                                    alt=""
                                    width={42}
                                    height={42}
                                    className="quiz-brand-logo"
                                />
                                <span>{city.title}</span>
                            </Link>
                            <div className="quiz-header-actions">
                                <span className="quiz-header-caption">
                                    Provjerite svoje znanje
                                </span>
                                <ThemeToggle />
                            </div>
                        </div>
                    </header>
                    <main className="quiz-container quiz-main flex-1">
                        <ConfigProvider config={city} apiBaseUrl={apiBaseUrl}>
                            {children}
                        </ConfigProvider>
                    </main>
                    <footer className="quiz-footer">
                        <div className="quiz-container quiz-footer-inner">
                            <Link href="/" className="quiz-brand">
                                <Image
                                    src="/brand/quiz-logo.svg"
                                    alt=""
                                    width={42}
                                    height={42}
                                    className="quiz-brand-logo"
                                />
                                <span>{city.title}</span>
                            </Link>
                            <span className="quiz-footer-copy">
                                Kvizovi Crvenog križa
                            </span>
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    );
}
