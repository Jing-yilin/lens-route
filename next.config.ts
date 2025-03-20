import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'export', // 启用导出模式用于GitHub Pages部署
  trailingSlash: true, // 添加尾部斜杠，有助于静态部署
  images: {
    unoptimized: true,
  },
  basePath, // 使用环境变量中定义的basePath
  assetPrefix: basePath, // 添加assetPrefix确保资源路径正确
};

export default nextConfig;