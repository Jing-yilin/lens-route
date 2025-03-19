'use client';

import dynamic from 'next/dynamic';
import { Photo } from '@/types/photo';

interface DynamicMapProps {
  photos: Photo[];
  activePhotoIndex: number | null;
  setActivePhotoIndex: (index: number) => void;
}

// 动态导入地图组件，禁用SSR
const DynamicMap = dynamic(
  () => import('./PhotoMap'),
  {
    ssr: false, // 禁用服务端渲染
    loading: () => <div className="h-[400px] w-full bg-gray-100 rounded-lg flex items-center justify-center">加载地图中...</div>,
  }
) as React.FC<DynamicMapProps>;

export default DynamicMap;