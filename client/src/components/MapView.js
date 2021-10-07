import React, { useState, useRef, useEffect, useCallback } from 'react';
import MapGL from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
import useWindowSize from '../hooks/windowResize';

const MapView = ({ showAddMarkerPopup, children }) => {
  // initialize map settings and focal point
  const { width, height } = useWindowSize();
  const [viewport, setViewport] = useState({
    width: width,
    height: height,
    latitude: 39.8283,
    longitude: -98.5795,
    zoom: 3,
  });
  const mapRef = useRef();

  useEffect(() => {
    setViewport({ ...viewport, height, width });
  }, [height, width]);

  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };
      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [handleViewportChange]
  );

  return (
    <div>
      <MapGL
        ref={mapRef}
        {...viewport}
        mapStyle="mapbox://styles/technogicksta/cksrkyy9u29ck17o3ueyx3d7n"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        onDblClick={showAddMarkerPopup}
        onViewportChange={(viewport) => setViewport(viewport)}>
        <Geocoder
          mapRef={mapRef}
          marker={false}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          position="top-left"
        />
        {children}
      </MapGL>
    </div>
  );
};

export default MapView;
