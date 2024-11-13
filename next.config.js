/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'console-minios3-minio.dpbdp1.easypanel.host',
        pathname: '/**',
      }
    ],
    domains: [
      'assets.themembers.com.br',
      'assets.coingecko.com',
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 