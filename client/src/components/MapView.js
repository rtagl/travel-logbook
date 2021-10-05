import React, { useState } from 'react';
import ReactMapGL from 'react-map-gl';

const MapView = ({ showAddMarkerPopup, children }) => {
  // initialize map settings and focal point
  const [viewport, setViewport] = useState({
    width: 'fit',
    height: '100vh',
    latitude: 39.8283,
    longitude: -98.5795,
    zoom: 3,
  });
  return (
    <ReactMapGL
      style={{ position: 'static', zIndex: -100 }}
      {...viewport}
      mapStyle="mapbox://styles/technogicksta/cksrkyy9u29ck17o3ueyx3d7n"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      onDblClick={showAddMarkerPopup}
      onViewportChange={(viewport) =>
        setViewport({ ...viewport, width: 'fit' })
      }>
      {children}
    </ReactMapGL>
  );
};

export default MapView;
