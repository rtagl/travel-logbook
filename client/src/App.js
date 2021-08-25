import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  // initialize map settings and focal point
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 39.8283,
    longitude: -98.5795,
    zoom: 3,
  });

  // fetch log entries from the server
  useEffect(() => {
    const getAllLogs = async () => {
      const response = await fetch('http://localhost:3001/api/logs');
      const logsData = await response.json();
      setLogEntries(logsData);
    };
    getAllLogs();
  }, []);

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/technogicksta/cksrkyy9u29ck17o3ueyx3d7n"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      onViewportChange={(viewport) => setViewport(viewport)}>
      {/* map through log entries and place marker at coords */}
      {logEntries.map((entry) => (
        <div
          key={entry._id}
          onClick={() => setShowPopup({ ...showPopup, [entry._id]: true })}>
          <Marker latitude={entry.latitude} longitude={entry.longitude}>
            <svg
              className="marker"
              style={{
                width: '24px',
                height: '24px',
              }}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle fill="#f8c102" cx="12" cy="10" r="3"></circle>
            </svg>
          </Marker>
          {showPopup[entry._id] ? (
            <Popup
              latitude={entry.latitude}
              longitude={entry.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setShowPopup({ ...showPopup, [entry._id]: false })}
              anchor="top">
              <div>{entry.title}</div>
            </Popup>
          ) : null}
        </div>
      ))}
    </ReactMapGL>
  );
};

export default App;
