'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Photo, PhotoPost } from '@/types/photo';
import DynamicMap from './DynamicMap';
import RoutePathSvg from './RoutePathSvg';
import Image from 'next/image';

interface KumanoLayoutProps {
  post: PhotoPost;
}

export default function KumanoLayout({ post }: KumanoLayoutProps): React.ReactElement {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // 照片滚动处理
  const scrollToPhoto = (index: number) => {
    photoRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  // 当地图上选择照片时，滚动到对应位置
  useEffect(() => {
    if (activePhotoIndex !== null) {
      scrollToPhoto(activePhotoIndex);
    }
  }, [activePhotoIndex]);
  
  // 判断元素是否在视图中
  const isInViewport = (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  // 监听滚动事件，更新当前活跃的照片
  useEffect(() => {
    const handleScroll = () => {
      // 找到第一个在视图中的照片
      const visibleIndex = photoRefs.current.findIndex(
        (ref) => ref && isInViewport(ref)
      );
      
      if (visibleIndex !== -1 && visibleIndex !== activePhotoIndex) {
        setActivePhotoIndex(visibleIndex);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activePhotoIndex]);
  
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white relative">
      {/* 左侧内容区 - 移动设备时在上方 */}
      <div className="w-full lg:w-1/2 p-4 pb-16 lg:overflow-y-auto lg:h-screen">
        {/* 页面标题 */}
        <header className="py-6 mb-8">
          <h1 className="text-4xl font-light tracking-tight text-gray-900">{post.title}</h1>
          <div className="mt-2 text-gray-600">
            <span>{new Date(post.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            {post.location?.name && (
              <span className="ml-2">· {post.location.name}</span>
            )}
          </div>
        </header>
        
        {/* 内容介绍 */}
        <div className="prose max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
        </div>
        
        {/* 路线SVG */}
        <RoutePathSvg 
          photos={post.photos} 
          activePhotoIndex={activePhotoIndex} 
        />
        
        {/* 照片列表 */}
        <div className="space-y-24 mt-8">
          {post.photos.map((photo, index) => (
            <div 
              key={index}
              ref={(el) => (photoRefs.current[index] = el)}
              className="photo-item scroll-mt-8"
              onMouseEnter={() => setActivePhotoIndex(index)}
            >
              <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                <Image
                  src={`/images/${post.slug}/${photo.file}`}
                  alt={photo.title || ''}
                  className="object-cover transition-all duration-700 ease-in-out"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index < 3}
                />
              </div>
              
              <div className="mt-4">
                <h2 className="text-2xl font-light text-gray-900">{photo.title}</h2>
                {photo.location?.name && (
                  <p className="text-gray-600 mt-1">{photo.location.name}</p>
                )}
                {photo.description && (
                  <p className="text-gray-700 mt-3 leading-relaxed">{photo.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 右侧固定地图 - 移动设备时在底部 */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen fixed lg:sticky bottom-0 lg:top-0 right-0">
        <DynamicMap 
          photos={post.photos} 
          activePhotoIndex={activePhotoIndex} 
          setActivePhotoIndex={setActivePhotoIndex} 
        />
      </div>
    </div>
  );
} 