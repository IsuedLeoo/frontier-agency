import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // @ts-ignore — disable Turbopack to avoid subprocess spawning in sandbox
  experimental: { turbo: false },
};

export default nextConfig;

if (process.env.NODE_ENV !== 'production') {
  import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
}
