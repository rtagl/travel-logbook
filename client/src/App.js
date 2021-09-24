import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import ReactMapGL from 'react-map-gl';

import * as api from './api/API';
import loginService from './api/login';
import signUpService from './api/signup';
import LoginTab from './components/LoginTab';
import SignupTab from './components/SignupTab';
import Navbar from './components/Navbar';
import MapView from './components/MapView';
import LogEntry from './components/LogEntry';
import NewLogEntry from './components/NewLogEntry';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState({});
  const [logEntries, setLogEntries] = useState([]);
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    description: '',
    rating: '',
    latitude: '',
    longitude: '',
    visitDate: '',
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

  const handleSignUpFields = (event) => {
    const value = event.target.value;
    setNewUser({
      ...newUser,
      [event.target.name]: value,
    });
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

  return (
    <Router>
      <Navbar />

      <Switch>
        <Route path="/login">
          <LoginTab
            handleLogin={handleLogin}
            username={username}
            password={password}
            errorMsg={errorMsg}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
          />
        </Route>

        <Route path="/signup">
          <SignupTab
            newUser={newUser}
            errorMsg={errorMsg}
            handleSignUpFields={handleSignUpFields}
            handleSignUp={handleSignUp}
          />
        </Route>

        <Route path="/">
          <MapView showAddMarkerPopup={showAddMarkerPopup}>
            {logEntries.map((entry) => (
              <LogEntry key={entry.id} entry={entry} color={'#f8c102'} />
            ))}
            {addEntryLocation ? (
              <NewLogEntry
                onClose={() => setAddEntryLocation(null)}
                saveEntry={saveEntry}
                errorMsg={errorMsg}
                ratingChanged={ratingChanged}
                handleFormChange={handleFormChange}
                newEntry={newEntry}
                addEntryLocation={addEntryLocation}
              />
            ) : null}
          </MapView>
        </Route>
      </Switch>
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
