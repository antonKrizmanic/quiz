'use client';

import { createContext, type ReactNode, useContext, useMemo } from 'react';
import type { CityConfig } from '@/lib/city-config';
import { createQuizApi } from '@/lib/quiz-api';

type ConfigContextValue = {
    config: CityConfig;
    api: ReturnType<typeof createQuizApi>;
};

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({
    config,
    apiBaseUrl,
    children,
}: {
    config: CityConfig;
    apiBaseUrl: string;
    children: ReactNode;
}) {
    const api = useMemo(() => createQuizApi(apiBaseUrl), [apiBaseUrl]);
    const value = useMemo(() => ({ config, api }), [config, api]);
    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
}

function useConfigContext() {
    const context = useContext(ConfigContext);
    if (!context) throw new Error('ConfigProvider is missing.');
    return context;
}

export function useConfig() {
    return useConfigContext().config;
}

export function useQuizApi() {
    return useConfigContext().api;
}
