import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // 启用导出模式用于GitHub Pages部署
  trailingSlash: true, // 添加尾部斜杠，有助于静态部署
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/lens-route' : '',
};

export default nextConfig;