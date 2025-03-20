'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Photo } from '@/types/photo';
import React from 'react';
import L from 'leaflet';

// 自定义红色标记图标
const redMarkerIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iI2Q4MDAwMCIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -8],
});

// 活动的标记图标（黑色）
const activeMarkerIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});

// 路线样式选项
const pathOptions = { 
  color: '#d80000', 
  weight: 3, 
  opacity: 0.7,
  dashArray: '5, 8' // 虚线样式
};

interface MapViewControlProps {
  center: [number, number];
  zoom: number;
}

// 地图视图控制组件
function MapViewControl({ center, zoom }: MapViewControlProps): React.ReactElement | null {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5, // 动画持续时间（秒）
      easeLinearity: 0.25
    });
  }, [center, map, zoom]);
  
  return null;
}

interface PhotoMapProps {
  photos: Photo[];
  activePhotoIndex: number | null;
  setActivePhotoIndex: (index: number) => void;
}

export default function PhotoMap({ photos, activePhotoIndex, setActivePhotoIndex }: PhotoMapProps): React.ReactElement {
  // 获取主要位置作为默认中心
  const defaultCenter: [number, number] = photos.length > 0 && photos[0].location?.coordinates 
    ? [photos[0].location.coordinates[1], photos[0].location.coordinates[0]] 
    : [34.1, 135.8]; // 和歌山县附近
  
  // 如果有活跃照片，获取其位置
  const activePhoto = activePhotoIndex !== null && photos[activePhotoIndex] ? photos[activePhotoIndex] : null;
  const activeCenter: [number, number] = activePhoto && activePhoto.location?.coordinates 
    ? [activePhoto.location.coordinates[1], activePhoto.location.coordinates[0]] 
    : defaultCenter;
  
  // 提取所有照片的坐标用于路线
  const pathPositions = photos
    .filter(photo => photo.location?.coordinates)
    .map(photo => [
      photo.location!.coordinates![1], 
      photo.location!.coordinates![0]
    ] as [number, number]);
  
  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={11} 
      style={{ 
        height: '100%', 
        width: '100%', 
        background: '#f7f7f7',
        filter: 'grayscale(0.9) contrast(0.8)'
      }}
      zoomControl={false}
      attributionControl={false}
      scrollWheelZoom={true}
      className="z-10"
    >
      <MapViewControl center={activeCenter} zoom={13} />
      
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        className="map-tiles"
      />
      
      {/* 添加路线连线 */}
      {pathPositions.length > 1 && (
        <Polyline positions={pathPositions} pathOptions={pathOptions} />
      )}
      
      {photos.map((photo, index) => {
        if (!photo.location?.coordinates) return null;
        
        const isActive = index === activePhotoIndex;
        
        return (
          <Marker 
            key={index}
            position={[photo.location.coordinates[1], photo.location.coordinates[0]]}
            icon={isActive ? activeMarkerIcon : redMarkerIcon}
            eventHandlers={{
              click: () => setActivePhotoIndex(index),
            }}
          >
            <Popup className="photo-popup">
              <div className="text-sm p-1">
                <h3 className="font-medium text-gray-900">{photo.title || `照片 ${index + 1}`}</h3>
                {photo.location.name && (
                  <p className="text-gray-600 text-xs">{photo.location.name}</p>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}