'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Photo } from '@/types/photo';

// 动态导入地图组件，禁用SSR
const PhotoMap = dynamic(() => import('./PhotoMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[rgb(243,244,246)] flex items-center justify-center">地图加载中...</div>
});

interface DynamicMapProps {
  photos: Photo[];
  activePhotoIndex: number | null;
  setActivePhotoIndex: (index: number) => void;
}

// 包装组件确保只在客户端渲染地图
export default function DynamicMap(props: DynamicMapProps): React.ReactElement {
  return <PhotoMap {...props} />;
}