const path = require('path');
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

const withReactSvg = require('next-react-svg')({
    include: path.resolve(__dirname, './public/icons')
});
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    productionBrowserSourceMaps: true,
    sassOptions: {
        silenceDeprecations: ['legacy-js-api']
    },
    eslint: {
        dirs: [
            'app',
            'app-models',
            'component-models', 'components', 'config',
            'helpers', 'hooks',
            'mappers', 'models',
            'repositories',
            'services',
            'tests',
            'view-models', 'views'
        ]
    },
    transpilePackages: ['@prisma/client'],
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.plugins = [...config.plugins, new PrismaPlugin()];
        }
        return config;
    }
};

module.exports = withBundleAnalyzer(withReactSvg(nextConfig));
