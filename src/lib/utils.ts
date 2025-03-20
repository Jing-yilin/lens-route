/**
 * 工具函数集合
 */

/**
 * 获取资源的完整路径，会自动添加basePath前缀
 * 
 * @param path - 资源路径
 * @returns 添加了basePath的完整路径
 */
export function getAssetPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (path.startsWith('/')) {
    return `${basePath}${path}`;
  }
  return `${basePath}/${path}`;
} 