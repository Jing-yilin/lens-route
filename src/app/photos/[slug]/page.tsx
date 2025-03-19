'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getPhotoPostBySlug } from '@/lib/mdx';
import DynamicMap from '@/components/DynamicMap';
import { PhotoPost } from '@/types/photo';

interface PhotoDetailProps {
  params: {
    slug: string;
  };
}

export default function PhotoDetail({ params }: PhotoDetailProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  
  // 客户端获取数据
  // 注意：在生产环境中，你可能需要使用Server Components和静态生成
  const post = getPhotoPostBySlug(params.slug) as PhotoPost;
  
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
      
      {/* 照片展示区 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          {/* 当前选中照片 */}
          {post.photos && post.photos.length > 0 && activePhotoIndex < post.photos.length && (
            <div className="mb-4">
              <Image
                src={post.photos[activePhotoIndex].file}
                alt={post.photos[activePhotoIndex].title}
                width={800}
                height={600}
                className="rounded-lg"
              />
              <h3 className="text-xl font-medium mt-2">{post.photos[activePhotoIndex].title}</h3>
              {post.photos[activePhotoIndex].description && (
                <p className="text-gray-600">{post.photos[activePhotoIndex].description}</p>
              )}
            </div>
          )}
          
          {/* 缩略图列表 */}
          <div className="grid grid-cols-4 gap-2">
            {post.photos && post.photos.map((photo, index) => (
              <div 
                key={index}
                className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                  index === activePhotoIndex ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => setActivePhotoIndex(index)}
              >
                <Image
                  src={photo.file}
                  alt={photo.title}
                  width={200}
                  height={150}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* 地图区域 */}
        <div>
          <DynamicMap 
            photos={post.photos} 
            activePhotoIndex={activePhotoIndex}
            setActivePhotoIndex={setActivePhotoIndex}
          />
        </div>
      </div>
      
      {/* Markdown内容 */}
      <div className="prose max-w-none">
        {post.content}
      </div>
    </div>
  );
}

// 静态路径生成
export async function generateStaticParams() {
  const posts = getAllPhotoPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}