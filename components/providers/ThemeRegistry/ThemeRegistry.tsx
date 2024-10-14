'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import useDarkMode from '@/hooks/useDarkMode';
import theme from '@/config/theme';
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher';



type ThemeRegistryProps = {
  children: React.ReactNode;
};

/**
 * Function representing the ThemeRegistry component.
 *
 * @returns ThemeRegistry component
 */
export default function ThemeRegistry({ children }: ThemeRegistryProps) {
    const [isDarkMode, toggleThemeChange] = useDarkMode();

    const finalTheme = theme(isDarkMode);

    return (
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={finalTheme}>
                <CssBaseline />
                <ThemeSwitcher
                    isDarkMode={isDarkMode ?? false}
                    onModeChange={toggleThemeChange}
                />
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}
