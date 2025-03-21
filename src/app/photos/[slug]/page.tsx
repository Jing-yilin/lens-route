export const dynamic = 'force-static';

import { getPhotoPostBySlug, getAllPhotoPosts } from '@/lib/mdx';
import KumanoLayout from '@/components/KumanoLayout';

// Using a more generic params type that will work with Next.js build
export default async function PhotoDetail({ 
  params 
}: { 
  params: any 
}) {
  // 确保params是已解析的对象
  const slug = params.slug as string;
  const post = getPhotoPostBySlug(slug);
  
  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-[rgb(75,85,99)]">摄影集未找到</p>
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