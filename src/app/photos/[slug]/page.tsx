export const dynamic = 'force-static';

import { getPhotoPostBySlug, getAllPhotoPosts } from '@/lib/mdx';

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
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-8">
        {new Date(post.date).toLocaleDateString()} 
        {post.location?.name && ` · ${post.location.name}`}
      </p>
      
      <div className="prose max-w-none">
        {post.content}
      </div>
    </div>
  );
}

// 必须导出这个函数以支持静态导出和动态路由
export async function generateStaticParams() {
  const posts = getAllPhotoPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}