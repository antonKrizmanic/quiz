import type { CityConfig } from '@/components/providers/ConfigProvider';

export async function loadCityConfig(city: string): Promise<CityConfig> {
    switch (city) {
        case 'buje':
            return (await import('@/config/cityAssociations/buje.json'))
                .default as CityConfig;
        case 'bnm':
            return (await import('@/config/cityAssociations/bnm.json'))
                .default as CityConfig;
        default:
            return (await import('@/config/cityAssociations/buje.json'))
                .default as CityConfig;
    }
}
