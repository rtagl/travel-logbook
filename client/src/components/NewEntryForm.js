import React from 'react';
import ReactStars from 'react-rating-stars-component';

const NewEntryForm = ({
  newEntry,
  selectedFile,
  handleFormChange,
  handleUploadChange,
  saveEntry,
  errorMsg,
  ratingChanged,
}) => {
  const hiddenFileInput = React.useRef(null);
  const handleClick = (e) => {
    e.preventDefault();
    hiddenFileInput.current.click();
  };

  return (
    <div>
      <form onSubmit={saveEntry}>
        {errorMsg && errorMsg.errorType === 'authError' ? (
          <div className="error">{errorMsg.message}</div>
        ) : null}
        <label htmlFor="title">Title</label>
        <input
          name="title"
          value={newEntry.title}
          onChange={handleFormChange}
        />
        {errorMsg && errorMsg.errorType === 'newLogError' ? (
          <div className="error">{errorMsg.title}</div>
        ) : null}

        <label htmlFor="description">Description</label>
        <input
          name="description"
          value={newEntry.description}
          onChange={handleFormChange}
        />

        <button className="upload-btn" onClick={handleClick}>
          Upload Image
        </button>
        {selectedFile ? (
          <span className="filename">{selectedFile.name}</span>
        ) : (
          <span className="filename">Choose a file</span>
        )}
        <input
          type="file"
          name="image"
          ref={hiddenFileInput}
          onChange={handleUploadChange}
          accept="image/*"
          style={{ display: 'none' }}
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
          <div className="error">{errorMsg.rating}</div>
        ) : null}

        <label htmlFor="visitDate">Visit Date</label>
        <input
          type="date"
          name="visitDate"
          value={newEntry.visitDate}
          onChange={handleFormChange}
        />
        {errorMsg && errorMsg.errorType === 'newLogError' ? (
          <div className="error">{errorMsg.visitDate}</div>
        ) : null}

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default NewEntryForm;
