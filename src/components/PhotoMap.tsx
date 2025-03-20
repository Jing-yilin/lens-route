'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Photo } from '@/types/photo';
import React from 'react';
// 不使用未使用的类型导入
// import type L from 'leaflet';

// 解决Leaflet图标问题
function FixLeafletIcons(): React.ReactElement | null {
  useEffect(() => {
    // 只在客户端执行
    import('leaflet').then(L => {
      // @ts-expect-error: Leaflet内部属性，类型定义中不存在
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    });
  }, []);
  
  return null;
}

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
  const defaultCenter: [number, number] = photos.length > 0 && photos[0].location 
    ? [photos[0].location.lat, photos[0].location.lng] 
    : [35, 105]; // 中国中心
  
  // 如果有活跃照片，获取其位置
  const activePhoto = activePhotoIndex !== null && photos[activePhotoIndex] ? photos[activePhotoIndex] : null;
  const activeCenter: [number, number] = activePhoto && activePhoto.location 
    ? [activePhoto.location.lat, activePhoto.location.lng] 
    : defaultCenter;
  
  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={5} 
      style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}
    >
      <FixLeafletIcons />
      <MapViewControl center={activeCenter} zoom={10} />
      
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      {photos.map((photo, index) => {
        if (!photo.location) return null;
        
        return (
          <Marker 
            key={index}
            position={[photo.location.lat, photo.location.lng]}
            eventHandlers={{
              click: () => setActivePhotoIndex(index),
            }}
            opacity={index === activePhotoIndex ? 1 : 0.7}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{photo.title || `照片 ${index + 1}`}</h3>
                {photo.location.name && <p>{photo.location.name}</p>}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}