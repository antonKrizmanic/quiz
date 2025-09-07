"use client";

import React, { createContext, useContext } from "react";

export type CityConfig = {
    name: string;
    title: string;
    cityAssociationId: number;
    heroSection: {
        title: string;
        description: string;
    };
};

const ConfigContext = createContext<CityConfig | null>(null);

export function ConfigProvider({
    config,
    children,
}: {
    config: CityConfig;
    children: React.ReactNode;
}) {
    return (
        <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
    );
}

// Helper tip za "keys of Config"
type Path<T> = {
    [K in Extract<keyof T, string>]: T[K] extends object
    ? K | `${K}.${Path<T[K]>}`
    : K;
}[Extract<keyof T, string>];

function get(obj: any, path: string) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function useConfig<T = CityConfig>(path?: Path<CityConfig>): T {
    const ctx = useContext(ConfigContext);
    if (!ctx) {
        throw new Error("useConfig mora biti korišten unutar <ConfigProvider>");
    }
    return (path ? get(ctx, path) : ctx) as T;
}


