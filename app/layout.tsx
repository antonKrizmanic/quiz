import { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
// eslint-disable-next-line import/order
import CssBaseline  from '@mui/material/CssBaseline';

import '@/styles/global.css';
import { Box, Container } from '@mui/material';

import theme from '@/theme';


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
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Container maxWidth="md">
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: { xs: 'flex-start', lg: 'center' },
                                    alignItems: 'center',
                                    minHeight: { xs: 'auto', lg: '100vh' },
                                    paddingTop: { xs: 2, md: 4 }
                                }}
                            >
                                {children}
                            </Box>
                        </Container>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
