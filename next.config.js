/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/posts",
        destination: "/posts/1",
        permanent: true,
      },
      {
        source: "/post",
        destination: "/posts/1",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
