import React, { useState, useEffect } from 'react';
import ReactMapGL from 'react-map-gl';

import * as api from './api/API';
import loginService from './api/login';
import signUpService from './api/signup';
import EntryMarker from './components/EntryMarker';
import EntryPopup from './components/EntryPopup';
import NewEntryForm from './components/NewEntryForm';
import LoginTab from './components/LoginTab';
import SignUpTab from './components/SignUpTab';
import EntryDescription from './components/EntryDescription';

const App = () => {
  const [loginView, toggleLoginView] = useState(false);
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
    zoom: 4,
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
    if (user === null) {
      setErrorMsg({
        type: 'Entry Error',
        message: 'please login!',
        color: 'red',
      });
      setTimeout(() => {
        setErrorMsg(null);
      }, 5000);
    } else {
      api.createEntry(newEntry).then((savedEntry) => {
        console.log(savedEntry);
        setNewEntry({
          title: '',
          description: '',
          comment: '',
          rating: '',
          latitude: '',
          longitude: '',
          visitDate: '',
        });
        setLogEntries((logEntries) => logEntries.concat(savedEntry));
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
      toggleLoginView(false);
    } catch (error) {
      setErrorMsg({
        type: 'Login Error',
        message: error.response.data.message,
        color: 'red',
      });
      setTimeout(() => {
        setErrorMsg(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser');
    setUser(null);
  };

  const handleSignUpView = () => {
    setSignUpView(!signUpView);
  };

  const handleSignUpFields = (event) => {
    const value = event.target.value;
    setNewUser({
      ...newUser,
      [event.target.name]: value,
    });
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    newUser.password = newUser.password1;
    signUpService
      .createAccount(newUser)
      .then((createdUser) => {
        console.log(createdUser, 'createdUser');
        window.localStorage.setItem('loggedUser', JSON.stringify(createdUser));
        api.setToken(createdUser.token);
        setUser(createdUser);
        setNewUser({
          username: '',
          password1: '',
          password2: '',
        });
        setSignUpView(false);
      })
      .catch((error) => {
        setErrorMsg({
          type: 'Signup Error',
          message: error.response.data.message,
          color: 'red',
        });
        setTimeout(() => {
          setErrorMsg(null);
        }, 5000);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete Entry?')) {
      api.deleteEntry(id).then((deletedEntry) => {
        setLogEntries(logEntries.filter((entry) => entry.id !== id));
      });
    }
  };

  return (
    <ReactMapGL
      style={{ position: 'static', zIndex: -100 }}
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
              closeOnClick={false}
              onClose={() => setShowPopup({})}>
              <EntryDescription
                entry={entry}
                user={user}
                handleDelete={handleDelete}
              />
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
              className="marker red"
              color="#f05305"
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
      {!loginView ? (
        <div className="user-svg" onClick={() => toggleLoginView(!loginView)}>
          <svg
            viewBox="0 0 24 24"
            width="42"
            height="42"
            stroke="white"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          {user ? (
            <div
              style={{
                color: 'white',
                fontsize: '16px',
              }}>
              {user.username}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="control-panel">
          <button
            onClick={() => toggleLoginView(!loginView)}
            style={{
              float: 'right',
              borderRadius: '100%',
            }}>
            x
          </button>
          {signUpView ? (
            <SignUpTab
              newUser={newUser}
              errorMsg={errorMsg}
              handleSignUpFields={handleSignUpFields}
              handleSignUpView={handleSignUpView}
              handleSignUp={handleSignUp}
            />
          ) : (
            <LoginTab
              user={user}
              handleLogout={handleLogout}
              handleLogin={handleLogin}
              username={username}
              password={password}
              errorMsg={errorMsg}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSignUpView={handleSignUpView}
            />
          )}
        </div>
      )}
    </ReactMapGL>
  );
};

export default App;
