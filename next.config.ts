import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/rewards/vendedor",
        destination: "/rewards/vendedor",
      },
      {
        source: "/rewards/cliente",
        destination: "/rewards/cliente",
      },
      {
        source: "/rewards/promotora",
        destination: "/rewards/promotora",
      },
      {
        source: "/rewards/rider",
        destination: "/rewards/rider",
      },
      {
        source: "/rewards/arquitecto",
        destination: "/rewards/arquitecto",
      },
    ];
  },
};

export default nextConfig;
