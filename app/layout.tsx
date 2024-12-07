import { Metadata } from 'next';
import '@/styles/global.css';
import { Box, Container } from '@mui/material';

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
            <body>
                <ThemeRegistry>
                    <Container maxWidth="md">
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: { xs: 'flex-start', lg: 'center' },
                                alignItems: 'center',
                                minHeight: { xs: 'auto', lg: '100vh' },
                                paddingTop: { xs: 8, md: 8 }
                            }}
                        >
                            {children}
                        </Box>
                    </Container>
                </ThemeRegistry>
            </body>
        </html>
    );
}
