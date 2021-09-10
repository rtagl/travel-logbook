import React, { useState, useEffect } from 'react';
import ReactMapGL from 'react-map-gl';

import * as api from './api/API';
import loginService from './api/login';
import EntryMarker from './components/EntryMarker';
import EntryPopup from './components/EntryPopup';
import NewEntryForm from './components/NewEntryForm';
import LoginTab from './components/LoginTab';
import SignUpTab from './components/SignUpTab';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [signUpView, setSignUpView] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password1: '',
    password2: '',
  });
  const [errorMsg, setErrorMsg] = useState(null);
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
    (async () => {
      const logEntries = await api.getAll();
      setLogEntries(logEntries);
    })();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      api.setToken(user.token);
    }
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

  const handleFormChange = (event) => {
    const value = event.target.value;
    setNewEntry({
      ...newEntry,
      [event.target.name]: value,
    });
  };

  const saveEntry = (e) => {
    e.preventDefault();
    console.log(newEntry, 'this is a new entry');
    if (user === null) {
      setErrorMsg({ message: 'please login!', color: 'red' });
      setTimeout(() => {
        setErrorMsg(null);
      }, 5000);
    } else {
      api.createEntry(newEntry).then((savedEntry) => {
        console.log(savedEntry);
        setLogEntries((logEntries) => logEntries.concat(savedEntry));
        setNewEntry({
          title: '',
          description: '',
          comment: '',
          rating: '',
          latitude: '',
          longitude: '',
          visitDate: '',
        });
        setAddEntryLocation(null);
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedUser', JSON.stringify(user));
      api.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.log('error logging in');
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser');
    setUser(null);
  };

  const handleShowSignUpView = () => {
    setSignUpView(!signUpView);
  };

  const handleSignUpFields = (event) => {
    const value = event.target.value;
    setNewUser({
      ...newUser,
      [event.target.name]: value,
    });
  };

  const handleSignUp = (event) => {
    event.preventDefault();
    console.log(newUser);
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
        <div key={entry.id} onClick={() => setShowPopup({ [entry.id]: true })}>
          <EntryMarker
            latitude={entry.latitude}
            longitude={entry.longitude}
            className={'marker yellow'}
            color={'#f8c102'}
          />
          {showPopup[entry.id] ? (
            <EntryPopup
              latitude={entry.latitude}
              longitude={entry.longitude}
              closeOnClick={true}
              onClose={() => setShowPopup({})}
              entry={entry}>
              <div>
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
                <small>
                  <span>
                    Visit date: {new Date(entry.visitDate).toLocaleDateString()}
                  </span>
                </small>
              </div>
            </EntryPopup>
          ) : null}
        </div>
      ))}
      <>
        {addEntryLocation ? (
          <div>
            <EntryMarker
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
              className={'marker red'}
              color={'#f05305'}
            />
            <EntryPopup
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
              closeOnClick={false}
              onClose={() => setAddEntryLocation(null)}>
              <NewEntryForm
                newEntry={newEntry}
                handleFormChange={handleFormChange}
                saveEntry={saveEntry}
                errorMsg={errorMsg}
              />
            </EntryPopup>
          </div>
        ) : null}
      </>
      <div className="login-form">
        {signUpView ? (
          <SignUpTab
            newUser={newUser}
            handleSignUpFields={handleSignUpFields}
            handleShowSignUpView={handleShowSignUpView}
            handleSignUp={handleSignUp}
          />
        ) : (
          <LoginTab
            user={user}
            handleLogout={handleLogout}
            handleLogin={handleLogin}
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleShowSignUpView={handleShowSignUpView}
          />
        )}
      </div>
    </ReactMapGL>
  );
};

export default App;
