/** @type {import('next').NextConfig} */

const NextFederationPlugin = require('@module-federation/nextjs-mf');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const nextConfig = {
    transpilePackages: [
        'query-string',
        'decode-uri-component',
        'filter-obj',
        'split-on-first',
        'nanoid',
    ],
    experimental: {
        // Disable next's experimental support for dynamic imports
        esmExternals: false,
    },
    reactStrictMode: true,
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
      },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
      },
    images: {
        domains: ['localhost'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
            },
        ],
    },
    webpack: (config) => {
        config.experiments = { ...config.experiments, topLevelAwait: true };
        config.plugins.push(
            new MiniCssExtractPlugin({
                filename: 'static/css/[name].css',
                chunkFilename: 'static/css/[name].[contenthash].css',
            })
        );
        config.module.rules.push({
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        });
        config.plugins.push(
            new NextFederationPlugin({
                name: 'canvasApp',
                filename: 'static/chunks/remoteEntry.js',
                exposes: {
                    './CanvasMainComponent': './pages/canvas/remoteIndex.tsx',
                },
                remotes: {
                    'auth': 'auth@https://auth-layout.vercel.app/_next/static/chunks/remoteEntry.js',
                },
                shared: [
                    'react',
                    'react-dom',
                    '@clerk/clerk-react',
                ]
            })
        );
        config.cache = false;
        return config;
    },
};

module.exports = nextConfig;
