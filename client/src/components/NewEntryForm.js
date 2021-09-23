import React from 'react';
import ReactStars from 'react-rating-stars-component';

const NewEntryForm = ({
  newEntry,
  handleFormChange,
  saveEntry,
  errorMsg,
  ratingChanged,
}) => {
  return (
    <div>
      <form onSubmit={saveEntry}>
        <label htmlFor="title">Title</label>
        <input
          name="title"
          value={newEntry.title}
          onChange={handleFormChange}
        />
        {errorMsg && errorMsg.errorType === 'newLogError' ? (
          <div>{errorMsg.title}</div>
        ) : null}
        <label htmlFor="description">Description</label>
        <input
          name="description"
          value={newEntry.description}
          onChange={handleFormChange}
        />
        <label htmlFor="rating">Rating</label>
        <ReactStars
          name="rating"
          count={5}
          onChange={ratingChanged}
          size={32}
          activeColor="#ffd700"
        />
        {errorMsg && errorMsg.errorType === 'newLogError' ? (
          <div>{errorMsg.title}</div>
        ) : null}

        <label htmlFor="visitDate">Visit Date</label>
        <input
          type="date"
          name="visitDate"
          value={newEntry.visitDate}
          onChange={handleFormChange}
        />
        {errorMsg && errorMsg.errorType === 'newLogError' ? (
          <div>{errorMsg.visitDate}</div>
        ) : null}
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default NewEntryForm;
