const composePlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const withOffline = require('next-offline');
const withGraphql = require('next-plugin-graphql');

const Dotenv = require('dotenv-webpack');
const path = require('path');

require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? path.resolve(__dirname, './.env.production') : undefined,
});

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  crossOrigin: 'anonymous',
  assetPrefix: isProd ? `https:${process.env.CDN_URL}` : '',
  // experimental: {
  //   granularChunks: true,
  // },
  // assetPrefix: `https:${process.env.CDN_URL}`,
  useFileSystemPublicRoutes: false,
  webpack(config, options) {
    // config.plugins.push(
    //   new SWPrecacheWebpackPlugin({
    //     navigateFallback: '/index',
    //     minify: true,
    //     staticFileGlobsIgnorePatterns: [/\.next\//],
    //     staticFileGlobs: [
    //       '.next/bundles/**/*.{js,json}',
    //       '.next/static/**/*.{js,css,jpg,jpeg,png,svg,gif}'
    //     ],
    //     staticFileGlobsIgnorePatterns: [/_.*\.js$/, /\.map/],
    //     runtimeCaching: [
    //       { handler: 'fastest', urlPattern: /[.](jpe?g|png|svg|gif)/ },
    //       { handler: 'networkFirst', urlPattern: /^https.*(js|css)/ }
    //     ],
    //   })
    // )
    // const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
    // config.plugins.push(
    //   new BundleAnalyzerPlugin({
    //     analyzerMode: 'static',
    //     reportFilename: options.isServer
    //       ? '../analyze/server.html'
    //       : './analyze/client.html',
    //   }),
    // );
    config.plugins.push(
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true,
      }),
    );

    config.resolve = {
      ...config.resolve,
      ...{
        alias: {
          ...config.resolve.alias,
          '@lib': path.resolve(__dirname, 'lib'),
          '@common': path.resolve(__dirname, 'common'),
          '@pages': path.resolve(__dirname, 'pages'),
          'google-libphonenumber': path.resolve(__dirname, './libphonenumber-stub.js'),
        },
      },
    };
    return config;
  },
};

module.exports = composePlugins(
  [
    [withOffline, {
      target: process.env.NEXT_TARGET || 'serverless',
      workboxOpts: {
        swDest: 'static/service-worker.js',
        runtimeCaching: [
          {
            urlPattern: /[.](png|jpg|ico|css)/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^http.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'http-cache',
            },
          },
        ],
      },
    }],
    // [withBundleAnalyzer, { enabled: true }],
    withGraphql,
  ],
  nextConfig,
);
