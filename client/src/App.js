import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import axios from 'axios';

import * as api from './api/API';
import loginService from './api/login';
import signUpService from './api/signup';
import LoginTab from './components/LoginTab';
import SignupTab from './components/SignUpTab';
import Navbar from './components/Navbar';
import MapView from './components/MapView';
import LogEntry from './components/LogEntry';
import NewLogEntry from './components/NewLogEntry';

const App = () => {
  const history = useHistory();
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
  const [userLogEntries, setUserLogEntries] = useState(false);
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

  // check if user is already logged in
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('user');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      api.setToken(user.token);
      setUser(user);
    }
  }, []);

  // set coordinates to new entry to location of double click
  const showAddMarkerPopup = (event) => {
    console.log(event);
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

  // if using search bar set result coordinates to new popup
  const showAddMarkerPopupGeoCode = (event) => {
    console.log(event);
    const [longitude, latitude] = event.result.center;
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
      // create form with image data to upload to cloudinary
      const CL_URL = process.env.REACT_APP_CL_URL;
      const CL_UPLOAD_PRESET = process.env.REACT_APP_CL_PRESET;
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', CL_UPLOAD_PRESET);
      // post image to cloudinary and send response to server
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
      // if no image is present send entry data directly to server
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

  // select first image
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
      history.push({ pathname: '/' });
    } catch (error) {
      setErrorMsg(error.response.data);
    }
  };

  const handleLogout = () => {
    setUserLogEntries(false);
    setErrorMsg({});
    window.localStorage.removeItem('user');
    api.setToken(null);
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
    if (newUser.password.length < 6) {
      setErrorMsg({
        password: 'Minimum length is 6 characters.',
        errorType: 'signupError',
      });
      return;
    }
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
        history.push({ pathname: '/' });
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

  const entriesToShow = userLogEntries
    ? logEntries.filter((entry) => entry.username === user.username)
    : logEntries;

  return (
    <>
      <Navbar
        user={user}
        handleLogout={handleLogout}
        userLogEntries={userLogEntries}
        setUserLogEntries={setUserLogEntries}
      />

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
          <MapView
            showAddMarkerPopup={showAddMarkerPopup}
            showAddMarkerPopupGeoCode={showAddMarkerPopupGeoCode}>
            {entriesToShow.map((entry) => (
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
                selectedFile={selectedFile}
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
    </>
  );
};

export default App;
