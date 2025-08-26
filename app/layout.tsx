import '@/styles/global.css';
import { Metadata } from 'next';

import ThemeRegistry from '@/components/providers/ThemeRegistry/ThemeRegistry';

// Checks whether the app is running in a production or development mode
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Page metadata.
 */
export const metadata: Metadata = {
    title: {
        default: `GDCK Buje kviz ${isProduction ? '' : '- development'}`,
        template: '%s | GDCK Buje kviz'
    },
    description: 'Kviz za potrebe GDCK Buje. Kviz omogućava rješavanje kvizova iz područja prve pomoći i poznavanja pokreta Crvenog križa.',
    icons: {
        icon: [
            {
                url: '/icons/logo.png',
                href: '/icons/logo.png'
            }
        ]
    }
};

type RootLayoutProps = {
    children: React.ReactNode;
};

/**
 * Function representing the RootLayout component.
 *
 * @returns RootLayout component
 */
export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50 dark:bg-none dark:bg-slate-900">
                <ThemeRegistry>
                    {/* Background decorative elements - only visible in light mode */}
                    <div className="fixed inset-0 overflow-hidden pointer-events-none dark:hidden">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                    </div>

                    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
                        <div className="flex flex-col justify-start lg:justify-center items-center min-h-screen pt-8 md:pt-8">
                            <div className="w-full max-w-2xl">
                                {children}
                            </div>
                        </div>
                    </div>
                </ThemeRegistry>
            </body>
        </html>
    );
}
