import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone", // Required for Docker deployment
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5053",
        pathname: "/uploads/**", // Cho phép tất cả ảnh trong thư mục uploads
      },
      {
        protocol: "http",
        hostname: "164.152.167.138",
        port: "5053",
        pathname: "/uploads/**", // VPS production (direct IP)
      },
      {
        protocol: "https",
        hostname: "chat.cloverhand.click",
        pathname: "/uploads/**", // Production domain with HTTPS
      },
    ],
  },
};

export default nextConfig;
