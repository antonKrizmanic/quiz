// Component imports

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ThemeSwitcherProps = {
    isDarkMode?: boolean;
    onModeChange?: () => void;
};

/**
 * Function representing the theme switcher component.
 *
 * @returns ThemeSwitcher component
 */
export default function ThemeSwitcher(props: ThemeSwitcherProps) {
    const { isDarkMode, onModeChange } = props;

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label="Dark mode toggle button"
            className="fixed top-4 right-4 z-50"
            onClick={onModeChange}
        >
            {isDarkMode ? (
                <Moon className="h-5 w-5" />
            ) : (
                <Sun className="h-5 w-5" />
            )}
        </Button>
    );
}
