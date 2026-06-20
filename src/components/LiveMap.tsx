import { KFS_BRAND } from "../config/brandConfig";
"use client";
import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configurar iconos por defecto
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Iconos personalizados estilo KFS
const riderIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png', // Moto de delivery
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const storeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/10555/10555818.png', // Tienda
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const customerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3595/3595456.png', // Casa
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const MapFitter = ({ positions }: { positions: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    }
  }, [map, positions]);
  return null;
};

export default function LiveMap({ riderPos, storePos, customerPos, className = "h-64" }: any) {
  const [animatedRiderPos, setAnimatedRiderPos] = useState(riderPos);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!riderPos) return;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Capture starting position from current state or fallback to target
    const startLat = animatedRiderPos ? animatedRiderPos.lat : riderPos.lat;
    const startLng = animatedRiderPos ? animatedRiderPos.lng : riderPos.lng;
    const endLat = riderPos.lat;
    const endLng = riderPos.lng;
    
    const duration = 1800; // smooth interpolation slightly faster than 2s update rate to catch up
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeInOutQuad easing for high premium feel
      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      const nextLat = startLat + (endLat - startLat) * ease;
      const nextLng = startLng + (endLng - startLng) * ease;
      
      setAnimatedRiderPos({ lat: nextLat, lng: nextLng });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      }
    };

    animationRef.current = requestAnimationFrame(step);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [riderPos?.lat, riderPos?.lng]);

  const positions: [number, number][] = [];
  if (animatedRiderPos) positions.push([animatedRiderPos.lat, animatedRiderPos.lng]);
  if (storePos) positions.push([storePos.lat, storePos.lng]);
  if (customerPos) positions.push([customerPos.lat, customerPos.lng]);

  const defaultCenter: [number, number] = positions.length > 0 ? positions[0] : [10.4806, -66.9036]; // Default Caracas

  return (
    <div className={`w-full rounded-2xl overflow-hidden shadow-inner border border-gray-200/20 z-0 relative ${className}`}>
      <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={false}>
        {/* Carto Voyager tiles are clean and look great for delivery apps */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap'
        />
        
        {storePos && (
          <Marker position={[storePos.lat, storePos.lng]} icon={storeIcon}>
            <Popup><strong>{KFS_BRAND.modules.marketplace}</strong><br/>Punto de Recolección</Popup>
          </Marker>
        )}
        
        {customerPos && (
          <Marker position={[customerPos.lat, customerPos.lng]} icon={customerIcon}>
            <Popup><strong>Cliente</strong><br/>Punto de Entrega</Popup>
          </Marker>
        )}
        
        {animatedRiderPos && (
          <Marker position={[animatedRiderPos.lat, animatedRiderPos.lng]} icon={riderIcon} zIndexOffset={1000}>
            <Popup><strong>Tu Rider</strong><br/>Moviéndose en vivo...</Popup>
          </Marker>
        )}

        <MapFitter positions={positions} />
      </MapContainer>
    </div>
  );
}
