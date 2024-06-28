/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jsfacqpeqskkbnvhyvxt.supabase.co',
        pathname: '**',
      },
    ]
    },
    experimental: {
    serverComponentsExternalPackages: ['sequelize'],
  },
};

export default nextConfig;
