import React from 'react';
import { GoogleMapLoader, GoogleMap, Polyline } from 'react-google-maps';

export default ({ path }) => {
  path = path ? path.map(el => ({ lat: el[1], lng: el[0] })) : [];
  const strokeColor = path.length < 20 ? '#F00' : '#B0DDD9';
  const lineWidth = path.length < 20 ? 5 : 2;
  return (
    <GoogleMapLoader
      containerElement={<div id="map" style={{ height: '500px' }} />}
      googleMapElement={
        <GoogleMap
          defaultZoom={9}
          defaultCenter={{ lat: 51.5285578, lng: -0.142023 }}
        >
          <Polyline
            path={path}
            options={{
              strokeColor: '#FFF',
              strokeWeight: `${lineWidth+4}`,
            }}
          />
          <Polyline
            path={path}
            options={{
              strokeColor: '#848484',
              strokeWeight: `${lineWidth+2}`,
            }}
          />
          <Polyline
            path={path}
            options={{
              strokeColor,
              strokeWeight: `${lineWidth}`,
            }}
          />
        </GoogleMap>
      }
    />
  );
};
