const path = require('path');

const withReactSvg = require('next-react-svg')({
    include: path.resolve(__dirname, './public/icons'),
});
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    productionBrowserSourceMaps: true,
    sassOptions: {
        silenceDeprecations: ['legacy-js-api'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = withBundleAnalyzer(withReactSvg(nextConfig));
