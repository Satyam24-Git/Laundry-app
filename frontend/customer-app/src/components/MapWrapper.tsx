import React from 'react';
import MapView, { Marker } from 'react-native-maps';

export const MapWrapper = ({ region, onRegionChangeComplete, onPress, selectedCoordinate, style }: any) => {
  return (
    <MapView
      style={style}
      region={region}
      onRegionChangeComplete={onRegionChangeComplete}
      onPress={onPress}
    >
      {selectedCoordinate && <Marker coordinate={selectedCoordinate} />}
    </MapView>
  );
};
