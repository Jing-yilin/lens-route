export const dynamic = 'force-static';

import { getPhotoPostBySlug, getAllPhotoPosts } from '@/lib/mdx';
import KumanoLayout from '@/components/KumanoLayout';

// 简化页面组件定义，让TypeScript检查通过
export default function PhotoDetail({ params }) {
  const post = getPhotoPostBySlug(params.slug);
  
  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-600">摄影集未找到</p>
      </div>
    );
  }
  
  return <KumanoLayout post={post} />;
}

// 必须导出这个函数以支持静态导出和动态路由
export async function generateStaticParams() {
  const posts = getAllPhotoPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}