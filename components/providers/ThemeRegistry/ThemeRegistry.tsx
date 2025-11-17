'use client';

import { useTheme } from 'next-themes';
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
    const { setTheme, theme } = useTheme();

    return (
        <div className={theme === 'dark' ? 'dark' : ''}>
            <ThemeSwitcher
                isDarkMode={theme === 'dark'}
                onModeChange={() =>
                    setTheme(theme === 'dark' ? 'light' : 'dark')
                }
            />
            {children}
        </div>
    );
}
