import React from 'react';
import { Photo } from '@/types/photo';

interface RoutePathSvgProps {
  photos: Photo[];
  activePhotoIndex: number | null;
}

export default function RoutePathSvg({ photos, activePhotoIndex }: RoutePathSvgProps): React.ReactElement {
  // 过滤掉没有坐标的照片
  const validPhotos = photos.filter(photo => photo.location?.coordinates);
  
  if (validPhotos.length < 2) {
    return <></>;
  }
  
  // 确定SVG画布尺寸和边距
  const width = 980;
  const height = 100;
  const margin = 40;
  const innerWidth = width - margin * 2;
  
  // 简化坐标转换为一维数组
  // 取经度值作为X轴
  const longitudes = validPhotos.map(photo => photo.location!.coordinates![0]);
  const minLong = Math.min(...longitudes);
  const maxLong = Math.max(...longitudes);
  const longRange = maxLong - minLong;
  
  // 根据范围确定绘图比例
  const scale = (lng: number) => {
    return margin + (innerWidth * (lng - minLong) / (longRange || 1));
  };
  
  // 生成路径
  const pathPoints = validPhotos.map((photo, i) => {
    const x = scale(photo.location!.coordinates![0]);
    // 使路径在SVG中垂直居中，并添加一些随机波动
    const y = height / 2 + Math.sin(i * 0.8) * 10;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  return (
    <div className="w-full overflow-hidden py-8 mb-12 border-t border-b border-gray-200">
      <h3 className="text-center text-gray-500 mb-4 text-sm font-light">熊野古道徒步路线</h3>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* 路径线条 */}
        <path
          d={pathPoints}
          stroke="#d80000"
          strokeWidth="1.5"
          strokeDasharray="5,5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* 站点标记 */}
        {validPhotos.map((photo, i) => {
          const x = scale(photo.location!.coordinates![0]);
          const y = height / 2 + Math.sin(i * 0.8) * 10;
          const isActive = i === activePhotoIndex;
          const pointRadius = isActive ? 5 : 3;
          const textSize = isActive ? "11" : "10";
          const textY = y - 10;
          
          return (
            <g key={i} className={isActive ? "font-medium" : ""}>
              {/* 点标记 */}
              <circle
                cx={x}
                cy={y}
                r={pointRadius}
                fill={isActive ? '#000' : '#d80000'}
                stroke="#fff"
                strokeWidth="1"
              />
              
              {/* 站点名称 */}
              {photo.location?.name && (
                <text
                  x={x}
                  y={textY}
                  fontSize={textSize}
                  textAnchor="middle"
                  fill={isActive ? '#000' : '#666'}
                  fontWeight={isActive ? 'medium' : 'normal'}
                  className="select-none"
                >
                  {photo.location.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
} 