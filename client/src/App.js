import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';

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
  const [showPopup, setShowPopup] = useState({});
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    description: '',
    image: '',
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
      api.setToken(user.token);
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

    if (selectedFile !== null) {
      const CL_URL = process.env.REACT_APP_CL_URL;
      const CL_UPLOAD_PRESET = process.env.REACT_APP_CL_PRESET;
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', CL_UPLOAD_PRESET);
      axios
        .post(CL_URL, formData)
        .then((response) => {
          return api.createEntry({ ...newEntry, image: response.data.url });
        })
        .then((savedEntry) => {
          setNewEntry({
            title: '',
            description: '',
            image: '',
            rating: '',
            latitude: '',
            longitude: '',
            visitDate: '',
          });
          setLogEntries((logEntries) => logEntries.concat(savedEntry));
          setAddEntryLocation(null);
        })
        .catch((error) => {
          setErrorMsg(error.response.data);
        });
    } else {
      api
        .createEntry(newEntry)
        .then((savedEntry) => {
          setNewEntry({
            title: '',
            description: '',
            image: '',
            rating: '',
            latitude: '',
            longitude: '',
            visitDate: '',
          });
          setLogEntries((logEntries) => logEntries.concat(savedEntry));
          setAddEntryLocation(null);
        })
        .catch((error) => {
          setErrorMsg(error.response.data);
        });
    }
  };

  const handleUploadChange = (e) => {
    setSelectedFile(e.target.files[0]);
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
      api.deleteEntry(id).then((response) => {
        setLogEntries(logEntries.filter((entry) => entry.id !== id));
      });
    }
  };

  const ratingChanged = (newRating) => {
    setNewEntry({ ...newEntry, rating: newRating });
  };

  return (
    <Router>
      <Navbar user={user} handleLogout={handleLogout} />

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
              // children: EntryMarker, EntryPopup, EntryDescription
              <LogEntry
                key={entry.id}
                user={user}
                entry={entry}
                color={'#f8c102'}
                showPopup={showPopup}
                setShowPopup={setShowPopup}
                handleDelete={handleDelete}
              />
            ))}
            {addEntryLocation ? (
              // children: EntryMarker, EntryPopup, NewEntryForm
              <NewLogEntry
                onClose={() => setAddEntryLocation(null)}
                saveEntry={saveEntry}
                errorMsg={errorMsg}
                ratingChanged={ratingChanged}
                handleUploadChange={handleUploadChange}
                handleFormChange={handleFormChange}
                newEntry={newEntry}
                addEntryLocation={addEntryLocation}
                user={user}
              />
            ) : null}
          </MapView>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
