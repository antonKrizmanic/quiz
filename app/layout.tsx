import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import { headers } from 'next/headers';
import { SiteFooter, SiteHeader } from '@/components/app/site-chrome';
import { ConfigProvider } from '@/components/quiz/config-provider';
import { getCityConfig } from '@/lib/city-config';
import { getPublicQuizApiUrl } from '@/lib/quiz-api-url';
import '@/styles/global.css';

const storyFont = Bricolage_Grotesque({
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
    variable: '--font-bricolage',
});

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

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    themeColor: '#c8102e',
    colorScheme: 'light',
};

export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const city = getCityConfig((await headers()).get('x-quiz-city'));
    const apiBaseUrl = getPublicQuizApiUrl();
    return (
        <html lang="hr" className={storyFont.variable}>
            <body>
                <div className="flex min-h-dvh flex-col">
                    <SiteHeader title={city.title} />
                    <main className="gutter mx-auto w-full max-w-5xl flex-1 pt-2 pb-10 sm:pt-6 sm:pb-16">
                        <ConfigProvider config={city} apiBaseUrl={apiBaseUrl}>
                            {children}
                        </ConfigProvider>
                    </main>
                    <SiteFooter title={city.title} />
                </div>
            </body>
        </html>
    );
}
