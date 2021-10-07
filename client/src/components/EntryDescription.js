import ReactStars from 'react-rating-stars-component';

const EntryDescription = ({ entry, user, handleDelete }) => {
  return (
    <div>
      {entry.image ? (
        <div className="entry-image">
          <img src={entry.image} alt="" />
        </div>
      ) : null}
      <div className="entry-description">
        <h3>{entry.title}</h3>
        <div className="rating">
          <ReactStars
            count={5}
            size={12}
            edit={false}
            value={entry.rating}
            activeColor="#f8c102"
          />
        </div>
        <span>{new Date(entry.visitDate).toLocaleDateString()}</span>
        <hr />
        <div className="comments">
          <p>{entry.description}</p>
        </div>
        <div>
          <span>By: {entry.username}</span>
        </div>
        {user && entry.username === user.username ? (
          <button
            className="delete-button"
            onClick={() => handleDelete(entry.id)}>
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default EntryDescription;
