'use client';

import React, { useState } from 'react';
import { Photo, PhotoPost } from '@/types/photo';
import PhotoMap from './PhotoMap';
import Image from 'next/image';

interface KumanoLayoutProps {
  post: PhotoPost;
}

export default function KumanoLayout({ post }: KumanoLayoutProps): React.ReactElement {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  
  return (
    <div className="relative w-full min-h-screen bg-[white]">
      {/* 博客标题 */}
      <header className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-[300] tracking-[-0.025em] text-[rgb(17,24,39)]">{post.title}</h1>
        <div className="mt-2 flex items-center text-[rgb(75,85,99)]">
          <span>{new Date(post.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          {post.location?.name && (
            <span className="ml-4 flex items-center">
              <span className="mx-2">·</span>
              {post.location.name}
            </span>
          )}
        </div>
      </header>
      
      {/* 主体内容 */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row">
          {/* 左侧内容区 */}
          <div className="w-full lg:w-7/12 pr-0 lg:pr-8">
            {/* 内容和照片 */}
            <div className="prose max-w-none mb-12">
              <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
            </div>
            
            <div className="space-y-16">
              {post.photos.map((photo, index) => (
                <div 
                  key={index} 
                  className="photo-item"
                  onMouseEnter={() => setActivePhotoIndex(index)}
                >
                  <div className="relative w-full h-[500px] bg-[rgb(243,244,246)] overflow-hidden">
                    {/* 照片 */}
                    <Image
                      src={`/images/${post.slug}/${photo.file}`}
                      alt={photo.title}
                      className="object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                      fill
                      priority={index < 2}
                    />
                  </div>
                  
                  {/* 照片标题和描述 */}
                  <div className="mt-4 mb-8">
                    <h2 className="text-2xl font-[300] text-[rgb(17,24,39)]">{photo.title}</h2>
                    {photo.location?.name && (
                      <p className="text-[rgb(75,85,99)] mt-1">{photo.location.name}</p>
                    )}
                    {photo.description && (
                      <p className="text-[rgb(55,65,81)] mt-3 leading-relaxed">{photo.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 右侧固定地图 */}
          <div className="hidden lg:block lg:w-5/12 relative">
            <div className="sticky top-8 h-[calc(100vh-4rem)]">
              <PhotoMap 
                photos={post.photos} 
                activePhotoIndex={activePhotoIndex} 
                setActivePhotoIndex={setActivePhotoIndex} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 