import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid wrong workspace root when another package-lock.json exists (e.g. in user home)
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
