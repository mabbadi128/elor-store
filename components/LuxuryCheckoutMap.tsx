"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// حل مشكلة أيقونات Leaflet
if (typeof window !== "undefined") {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
}

function ChangeMapCenter({ center }: { center: any }) {
  const map = useMap();
  useEffect(() => {
    if (center && map) {
      map.setView(center, 16);
    }
  }, [center, map]);
  return null;
}

export default function LuxuryCheckoutMap({ mapCenter }: { mapCenter: any }) {
  const [isMounted, setIsMounted] = useState(false);

  // هذا الـ Effect يضمن أن الكود لن يعمل إلا في المتصفح
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const validCenter: [number, number] = Array.isArray(mapCenter) ? [mapCenter[0], mapCenter[1]] : [25.2048, 55.2708];

  // إذا لم نكن في المتصفح بعد، نرجع واجهة فارغة (أو مؤقت تحميل)
  if (!isMounted) {
    return <div className="w-full h-64 rounded-xl border border-white/10 bg-[#0a0a0a] animate-pulse flex items-center justify-center text-gray-500">جاري تحميل الخريطة...</div>;
  }

  return (
    <div className="w-full h-64 rounded-xl border border-white/10 overflow-hidden relative z-0">
      <MapContainer 
        center={validCenter} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="OpenStreetMap" 
        />
        <Marker position={validCenter} />
        <ChangeMapCenter center={validCenter} />
      </MapContainer>
    </div>
  );
}