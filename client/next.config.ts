import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5053",
        pathname: "/uploads/**", // Cho phép tất cả ảnh trong thư mục uploads
      },
    ],
  },
};

export default nextConfig;
