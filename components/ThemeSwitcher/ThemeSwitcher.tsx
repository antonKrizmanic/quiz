// Component imports
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

type ThemeSwitcherProps = {
  isDarkMode?: boolean;
  onModeChange?: () => void;
}

/**
 * Function representing the theme switcher component.
 *
 * @returns ThemeSwitcher component
 */
export default function ThemeSwitcher(props: ThemeSwitcherProps) {
    const {
        isDarkMode,
        onModeChange
    } = props;

    return (
        <IconButton
            aria-label="Dark mode toggle button"
            sx={{
                position: 'fixed',
                top: 16,
                right: 16
            }}
            onClick={onModeChange}
        >
            {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
    );
}