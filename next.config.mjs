const nextConfig = {
  env: {
    public_APIUrl: process.env.PUBLIC_API_URL,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compress: true,
  crossOrigin: 'anonymous',
  poweredByHeader: false,
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  experimental: {
    serverActions: {
      // Limit file upload size
      bodySizeLimit: process.env.MAX_FILE_SIZE
    },
      webpackMemoryOptimizations: true,
  },
   typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*", 
      },
      {
        protocol: "http",
        hostname: "*", 
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  }
};

export default nextConfig;