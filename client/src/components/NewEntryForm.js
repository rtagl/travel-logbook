import React from 'react';

const NewEntryForm = ({ newEntry, handleFormChange, saveEntry, errorMsg }) => {
  return (
    <div>
      {errorMsg ? (
        <div style={{ color: errorMsg.color }}>{errorMsg.message}</div>
      ) : null}
      <form onSubmit={saveEntry}>
        <table>
          <tbody>
            <tr>
              <td align="left">Title</td>
              <td align="right">
                <input
                  name="title"
                  value={newEntry.title}
                  onChange={handleFormChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td align="left">Description</td>
              <td align="right">
                <input
                  name="description"
                  value={newEntry.description}
                  onChange={handleFormChange}
                />
              </td>
            </tr>
            <tr>
              <td align="left">Comment</td>
              <td align="right">
                <input
                  name="comment"
                  value={newEntry.comment}
                  onChange={handleFormChange}
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
                  onChange={handleFormChange}
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
                  onChange={handleFormChange}
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default NewEntryForm;
