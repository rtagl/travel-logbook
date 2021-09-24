import React from 'react';

import EntryMarker from './EntryMarker';
import EntryPopup from './EntryPopup';
import NewEntryForm from './NewEntryForm';

const NewLogEntry = ({
  onClose,
  saveEntry,
  errorMsg,
  ratingChanged,
  handleFormChange,
  handleUploadChange,
  newEntry,
  addEntryLocation,
}) => {
  return (
    <>
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
        onClose={onClose}>
        <NewEntryForm
          newEntry={newEntry}
          handleFormChange={handleFormChange}
          handleUploadChange={handleUploadChange}
          saveEntry={saveEntry}
          errorMsg={errorMsg}
          ratingChanged={ratingChanged}
        />
      </EntryPopup>
    </>
  );
};

export default NewLogEntry;
