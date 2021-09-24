// import React from 'react';

// import EntryMarker from './EntryMarker';

// const ShowEntries = ({ logEntries }) => {
//   return (
//     <div>
//       {logEntries.map((entry) => (
//         <div key={entry.id} onClick={() => setShowPopup({ [entry.id]: true })}>
//           <EntryMarker
//             latitude={entry.latitude}
//             longitude={entry.longitude}
//             className={'marker yellow'}
//             color={'#f8c102'}
//           />
//           {showPopup[entry.id] ? (
//             <EntryPopup
//               latitude={entry.latitude}
//               longitude={entry.longitude}
//               closeOnClick={false}
//               onClose={() => setShowPopup({})}>
//               <EntryDescription
//                 entry={entry}
//                 user={user}
//                 handleDelete={handleDelete}
//               />
//             </EntryPopup>
//           ) : null}
//         </div>
//       ))}
//       <>
//         {addEntryLocation ? (
//           <div>
//             <EntryMarker
//               latitude={addEntryLocation.latitude}
//               longitude={addEntryLocation.longitude}
//               className="marker red"
//               color="#f05305"
//             />
//             <EntryPopup
//               latitude={addEntryLocation.latitude}
//               longitude={addEntryLocation.longitude}
//               closeOnClick={false}
//               onClose={() => setAddEntryLocation(null)}>
//               <NewEntryForm
//                 newEntry={newEntry}
//                 handleFormChange={handleFormChange}
//                 saveEntry={saveEntry}
//                 errorMsg={errorMsg}
//                 ratingChanged={ratingChanged}
//               />
//             </EntryPopup>
//           </div>
//         ) : null}
//       </>
//     </div>
//   );
// };

/* <>
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
            </>; */
