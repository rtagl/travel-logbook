import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
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
import Navbar from './components/Navbar';

const App = () => {
  const [showLoginView, setShowLoginView] = useState(false);
  const [showSignupView, setShowSignupView] = useState(false);
  const [logoutButton, setLogoutButton] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState({});
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    description: '',
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
    const loggedUserJSON = window.localStorage.getItem('user');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
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
    api.createEntry(newEntry).then((savedEntry) => {
      console.log(savedEntry);
      setNewEntry({
        title: '',
        description: '',
        rating: '',
        latitude: '',
        longitude: '',
        visitDate: '',
      });
      setLogEntries((logEntries) => logEntries.concat(savedEntry));
      setAddEntryLocation(null);
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('user', JSON.stringify(user));
      api.setToken(user.token);
      setUser(user);
      setErrorMsg({});
      setUsername('');
      setPassword('');
    } catch (error) {
      setErrorMsg(error.response.data);
    }
  };

  const handleLogout = () => {
    setErrorMsg({});
    window.localStorage.removeItem('user');
    setUser(null);
  };

  const handleSignUpView = () => {
    setErrorMsg({});
    setUsername('');
    setPassword('');
  };

  const handleSignUpFields = (event) => {
    const value = event.target.value;
    setNewUser({
      ...newUser,
      [event.target.name]: value,
    });
  };

  const toggleLogoutButton = () => {
    setLogoutButton(!logoutButton);
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    signUpService
      .createAccount(newUser)
      .then((createdUser) => {
        setErrorMsg({});
        window.localStorage.setItem('user', JSON.stringify(createdUser));
        api.setToken(createdUser.token);
        setUser(createdUser);
        setNewUser({
          username: '',
          password: '',
        });
      })
      .catch((error) => {
        setErrorMsg(error.response.data);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      api.deleteEntry(id).then((deletedEntry) => {
        setLogEntries(logEntries.filter((entry) => entry.id !== id));
      });
    }
  };
  const ratingChanged = (newRating) => {
    setNewEntry({ ...newEntry, rating: newRating });
  };

  const handleLoginView = () => {
    setShowLoginView(!showLoginView);
  };

  const handleSignupView = () => {
    setShowSignupView(!showSignupView);
  };

  const handleHomeView = () => {
    setShowSignupView(false);
    setShowLoginView(false);
  };

  return (
    <Router>
      <Navbar
        handleLoginView={handleLoginView}
        handleSignupView={handleSignupView}
        handleHomeView={handleHomeView}
      />
      <ReactMapGL
        style={{ position: 'static', zIndex: -100 }}
        {...viewport}
        mapStyle="mapbox://styles/technogicksta/cksrkyy9u29ck17o3ueyx3d7n"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        onDblClick={showAddMarkerPopup}
        onViewportChange={(viewport) => setViewport(viewport)}>
        {logEntries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => setShowPopup({ [entry.id]: true })}>
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
                  ratingChanged={ratingChanged}
                />
              </EntryPopup>
            </div>
          ) : null}
        </>
        {showLoginView ? (
          <div className="control-panel">
            <LoginTab
              handleLogin={handleLogin}
              username={username}
              password={password}
              errorMsg={errorMsg}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
            />
          </div>
        ) : null}

        {showSignupView ? (
          <div>
            <SignUpTab
              newUser={newUser}
              errorMsg={errorMsg}
              handleSignUpFields={handleSignUpFields}
              handleSignUp={handleSignUp}
              handleSignupView={handleSignupView}
            />
          </div>
        ) : null}
      </ReactMapGL>
    </Router>
  );
};

export default App;

//   !loginView ? (
//     <button
//       className="user-svg"
//       onClick={() => toggleLoginView(!loginView)}>
//       <svg
//         viewBox="0 0 24 24"
//         width="42"
//         height="42"
//         stroke="#fee996"
//         strokeWidth="3"
//         fill="none"
//         strokeLinecap="round"
//         strokeLinejoin="round">
//         <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
//         <circle cx="12" cy="7" r="4"></circle>
//       </svg>
//       {user ? (
//         <>
//           <div
//             style={{
//               color: '#f8c102',
//               fontSize: '1rem',
//             }}
//             onClick={toggleLogoutButton}>
//             {user.username.length > 8
//               ? user.username.substring(0, 8) + '...'
//               : user.username}
//           </div>
//           <div>
//             {logoutButton ? (
//               <button onClick={handleLogout}>Log out</button>
//             ) : null}
//           </div>
//         </>
//       ) : null}
//     </button>
//   ) : (

//   );
// }
