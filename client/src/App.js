import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    description: '',
    comment: '',
    rating: '',
    latitude: '',
    longitude: '',
    visitDate: '',
  });
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

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      longitude,
      latitude,
    });
    setNewEntry({
      ...newEntry,
      latitude,
      longitude,
    });
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setNewEntry({
      ...newEntry,
      [event.target.name]: value,
    });
  };

  const saveEntry = (e) => {
    e.preventDefault();
    console.log(newEntry);
  };

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/technogicksta/cksrkyy9u29ck17o3ueyx3d7n"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      onDblClick={showAddMarkerPopup}
      onViewportChange={(viewport) => setViewport(viewport)}>
      {/* map through log entries and place marker at coords */}
      {logEntries.map((entry) => (
        <div
          key={entry._id}
          onClick={() => setShowPopup({ [entry._id]: true })}>
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
            <div className="popup">
              <Popup
                latitude={entry.latitude}
                longitude={entry.longitude}
                closeButton={true}
                closeOnClick={true}
                dynamicPosition={true}
                onClose={() => setShowPopup({})}
                anchor="top">
                <div>
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                  <small>
                    Visited on: {new Date(entry.visitDate).toLocaleDateString()}
                  </small>
                </div>
              </Popup>
            </div>
          ) : null}
        </div>
      ))}
      <>
        {addEntryLocation ? (
          <Popup
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            closeButton={true}
            closeOnClick={true}
            dynamicPosition={true}
            onClose={() => setAddEntryLocation(null)}
            anchor="top">
            <div>
              <form onSubmit={saveEntry}>
                <table>
                  <tbody>
                    <tr>
                      <td align="left">Title</td>
                      <td align="right">
                        <input
                          name="title"
                          value={newEntry.title}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td align="left">Description</td>
                      <td align="right">
                        <input
                          name="description"
                          value={newEntry.description}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td align="left">Comment</td>
                      <td align="right">
                        <input
                          name="comment"
                          value={newEntry.comment}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td align="left">Rating</td>
                      <td align="right">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          name="rating"
                          value={newEntry.rating}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td align="left">Visit Date</td>
                      <td align="right">
                        <input
                          type="date"
                          name="visitDate"
                          value={newEntry.visitDate}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button type="submit">Save</button>
              </form>
            </div>
          </Popup>
        ) : null}
      </>
    </ReactMapGL>
  );
};

export default App;
