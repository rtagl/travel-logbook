import React from 'react';

import EntryMarker from './EntryMarker';
import EntryPopup from './EntryPopup';
import EntryDescription from './EntryDescription';

const LogEntry = ({ entry, user, handleDelete, showPopup, setShowPopup }) => {
  return (
    <EntryMarker
      latitude={entry.latitude}
      longitude={entry.longitude}
      className={'marker yellow'}
      color={'#f8c102'}
      onClick={() => setShowPopup({ [entry.id]: true })}>
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
    </EntryMarker>
  );
};

export default LogEntry;
