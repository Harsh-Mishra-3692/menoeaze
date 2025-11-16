/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/ml/:path*',
        destination: 'http://ml_service:8000/:path*',
      },
    ];
  },
};

export default nextConfig;

