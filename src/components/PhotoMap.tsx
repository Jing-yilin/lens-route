'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

interface MapViewControlProps {
  center: [number, number];
  zoom: number;
}

// 地图视图控制组件
function MapViewControl({ center, zoom }: MapViewControlProps): React.ReactElement | null {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(center, zoom);
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
    : [35, 135]; // 日本中心位置
  
  // 如果有活跃照片，获取其位置
  const activePhoto = activePhotoIndex !== null && photos[activePhotoIndex] ? photos[activePhotoIndex] : null;
  const activeCenter: [number, number] = activePhoto && activePhoto.location?.coordinates 
    ? [activePhoto.location.coordinates[1], activePhoto.location.coordinates[0]] 
    : defaultCenter;
  
  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={8} 
      style={{ 
        height: '100%', 
        width: '100%', 
        borderRadius: '0px',
        background: 'rgba(242, 242, 242, 0.8)',
        filter: 'grayscale(0.2) contrast(0.9)'
      }}
      zoomControl={false}
    >
      <MapViewControl center={activeCenter} zoom={11} />
      
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      {photos.map((photo, index) => {
        if (!photo.location?.coordinates) return null;
        
        return (
          <Marker 
            key={index}
            position={[photo.location.coordinates[1], photo.location.coordinates[0]]}
            icon={index === activePhotoIndex ? activeMarkerIcon : redMarkerIcon}
            eventHandlers={{
              click: () => setActivePhotoIndex(index),
            }}
          >
            <Popup className="minimal-popup">
              <div className="text-sm">
                <h3 className="font-medium text-gray-900">{photo.title || `照片 ${index + 1}`}</h3>
                {photo.location.name && <p className="text-gray-600">{photo.location.name}</p>}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}