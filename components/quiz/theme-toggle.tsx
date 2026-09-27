'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const saved = window.localStorage.getItem('quiz-theme');
        const isDark = saved === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        setDark(isDark);
    }, []);

    function toggleTheme() {
        const next = !dark;
        document.documentElement.classList.toggle('dark', next);
        window.localStorage.setItem('quiz-theme', next ? 'dark' : 'light');
        setDark(next);
    }

    return (
        <button
            type="button"
            className="quiz-theme-button"
            onClick={toggleTheme}
            aria-label={dark ? 'Uključi svijetlu temu' : 'Uključi tamnu temu'}
            title={dark ? 'Svijetla tema' : 'Tamna tema'}
        >
            {dark ? (
                <Moon size={19} aria-hidden="true" />
            ) : (
                <Sun size={19} aria-hidden="true" />
            )}
        </button>
    );
}
