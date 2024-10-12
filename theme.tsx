'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { lime, purple } from '@mui/material/colors';


const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#FF5733',
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#E0C2FF',
      light: '#F5EBFF',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#47008F',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,  
    h1: {
      fontSize: '2.2rem',
      fontWeight: 400,
    },      
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { severity: 'info' },
              style: {
                backgroundColor: '#60a5fa',
              },
            }
          ],
        },
      },
    },
  },
});

export default theme;