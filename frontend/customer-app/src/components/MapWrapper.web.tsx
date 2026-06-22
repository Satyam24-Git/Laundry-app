import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

// Leaflet is only for web, so we can import it safely here
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapEvents = ({ onPress }: { onPress: (e: any) => void }) => {
  useMapEvents({
    click(e) {
      if (onPress) {
        // map leaflet event to react-native-maps event signature
        onPress({
          nativeEvent: {
            coordinate: {
              latitude: e.latlng.lat,
              longitude: e.latlng.lng,
            }
          }
        });
      }
    },
  });
  return null;
};

const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

export const MapWrapper = ({ region, onRegionChangeComplete, onPress, selectedCoordinate, style }: any) => {
  const center: [number, number] = region ? [region.latitude, region.longitude] : [28.6139, 77.2090];
  
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', width: '100%', ...(style as any) }}>
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%', flex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onPress={onPress} />
        <MapUpdater center={center} />
        {selectedCoordinate && (
          <Marker position={[selectedCoordinate.latitude, selectedCoordinate.longitude]} />
        )}
      </MapContainer>
    </div>
  );
};
