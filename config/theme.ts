// General imports
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap'
});

/**
 * Material-UI theme.
 *
 * @param isDarkMode is dark mode selected flag
 * @type Material-UI theme
 */
export default function getTheme(isDarkMode: boolean) {
    return createTheme({
        cssVariables: true,
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
            primary: {
                main: '#FF5733'
            },
            secondary: {
                main: '#03a9f4',
                light: '#F5EBFF',
                contrastText: '#47008F'
            }
        },
        typography: {
            fontFamily: roboto.style.fontFamily,
            h1: {
                fontSize: '2.2rem',
                fontWeight: 400
            }
        },
        components: {
            MuiAlert: {
                styleOverrides: {
                    root: {
                        variants: [
                            {
                                props: { severity: 'info' },
                                style: {
                                    backgroundColor: '#60a5fa'
                                }
                            }
                        ]
                    }
                }
            }
        }
    });
}


