import React, { useState, useRef, useEffect, useCallback } from 'react';
import MapGL from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
import useWindowSize from '../hooks/windowResize';

const MapView = ({
  showAddMarkerPopup,
  showAddMarkerPopupGeoCode,
  children,
}) => {
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

  // set viewport to map dimensions
  useEffect(() => {
    setViewport({ ...viewport, height, width });
  }, [height, width]);

  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  // transition to new coordinate when using search bar
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
        <div className="geocoder">
          <Geocoder
            mapRef={mapRef}
            marker={false}
            onResult={showAddMarkerPopupGeoCode}
            onViewportChange={handleGeocoderViewportChange}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            position="top-left"
          />
        </div>
        {children}
      </MapGL>
    </div>
  );
};

export default MapView;
