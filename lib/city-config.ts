import bnm from '@/config/cityAssociations/bnm.json';
import buje from '@/config/cityAssociations/buje.json';

export type CityConfig = {
    name: string;
    title: string;
    cityAssociationId: number;
    heroSection: {
        title: string;
        description: string;
    };
};

const cityConfigs = { buje, bnm } as const;

const hostToCity: Record<string, keyof typeof cityConfigs> = {
    'www.kviz.gdckapp.com': 'buje',
    'kviz.gdckapp.com': 'buje',
    'www.kviz.bnm.gdckapp.com': 'bnm',
    'kviz.bnm.gdckapp.com': 'bnm',
    localhost: 'buje',
    '127.0.0.1': 'bnm',
};

export function cityForHost(host: string | null): keyof typeof cityConfigs {
    const hostname = host?.split(':')[0].toLowerCase() ?? '';
    return hostToCity[hostname] ?? 'buje';
}

export function getCityConfig(city: string | null): CityConfig {
    return cityConfigs[city === 'bnm' ? 'bnm' : 'buje'];
}
