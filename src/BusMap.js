import React from 'react';
import { GoogleMapLoader, GoogleMap, Polyline } from 'react-google-maps';

export default ({ path }) => {
  const newPath = path ? path.map(el => ({ lat: el[1], lng: el[0] })) : path;
  const lineWidth = 2;
  return (
    <GoogleMapLoader
      containerElement={<div id="map" style={{ height: '520px' }} />}
      googleMapElement={
        <GoogleMap
          defaultZoom={9}
          defaultCenter={{ lat: 51.5285578, lng: -0.142023 }}
        >
          <Polyline
            path={newPath}
            options={{
              strokeColor: '#FFF',
              strokeWeight: `${lineWidth+4}`,
            }}
          />
          <Polyline
            path={newPath}
            options={{
              strokeColor: '#848484',
              strokeWeight: `${lineWidth+2}`,
            }}
          />
          <Polyline
            path={newPath}
            options={{
              strokeColor: '#B0DDD9',
              strokeWeight: `${lineWidth}`,
            }}
          />
        </GoogleMap>
      }
    />
  );
};
