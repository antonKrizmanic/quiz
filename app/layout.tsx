import { Metadata } from 'next';
import { roboto } from '@/config/fonts';
import '@/styles/global.css';

// Checks whether the app is running in a production or development mode
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Page metadata.
 */
export const metadata: Metadata = {
  title: {
    default: `GDCK Buje kviz ${isProduction ? '' : '- development'}`,
    template: `%s | GDCK Buje kviz`
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
      <body className="min-h-screen flex flex-col bg-gray-200	">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="flex flex-col space-y-4">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
