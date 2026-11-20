'use client';

import { createColorScheme, createLocalStorage } from '@ui-sdk/core';
import { Preferences, usePreference } from '@ui-sdk/react/preferences';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { ReactNode } from 'react';
import { Segmented } from '@/components/ui/segmented';

const colorScheme = createColorScheme({
    global: true,
    storage: createLocalStorage('quiz-color-scheme'),
});

type Scheme = 'system' | 'light' | 'dark';

export function AppPreferences({ children }: { children: ReactNode }) {
    return <Preferences preferences={[colorScheme]}>{children}</Preferences>;
}

export function ThemeSwitcher() {
    const { value } = usePreference(colorScheme);
    return (
        <Segmented<Scheme>
            aria-label="Tema"
            value={value as Scheme}
            onValueChange={(next) => colorScheme.set(next)}
            items={[
                {
                    value: 'system',
                    ariaLabel: 'Tema sustava',
                    label: <Monitor aria-hidden="true" />,
                },
                {
                    value: 'light',
                    ariaLabel: 'Svijetla tema',
                    label: <Sun aria-hidden="true" />,
                },
                {
                    value: 'dark',
                    ariaLabel: 'Tamna tema',
                    label: <Moon aria-hidden="true" />,
                },
            ]}
        />
    );
}
