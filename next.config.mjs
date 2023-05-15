import { config } from 'dotenv'

import withBundleAnalyze from '@next/bundle-analyzer'

process.title = 'Kami (NextJS)'

const env = config().parsed || {}
const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
// eslint-disable-next-line import/no-mutable-exports
let nextConfig = {
  experimental: {
    appDir: true,
    serverActions: true,
    scrollRestoration: true,
    legacyBrowsers: false,
    serverComponentsExternalPackages: ['socket.io-client', 'ws'],
  },
  output: 'standalone',
  assetPrefix: isProd ? env.ASSETPREFIX || undefined : undefined,
  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    })
    return config
  },
}

if (process.env.ANALYZE === 'true') {
  nextConfig = withBundleAnalyze({ enabled: true })(nextConfig)
}

export default nextConfig
