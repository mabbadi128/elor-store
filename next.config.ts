import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ngeqxokmbjvmsiqshmvr.supabase.co", // تم إضافة رابط Supabase هنا
      },
    ],
  },
};

export default nextConfig;