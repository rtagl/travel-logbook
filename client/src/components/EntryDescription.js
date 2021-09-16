const EntryDescription = ({ entry, user, handleDelete }) => {
  return (
    <div>
      <h3>{entry.title}</h3>
      <p>{entry.description}</p>
      <small>
        <span>
          Visit date: {new Date(entry.visitDate).toLocaleDateString()}
        </span>
        <div>
          <span>Submitted by: {entry.username}</span>
        </div>
      </small>
      {entry.username === user.username ? (
        <button onClick={() => handleDelete(entry.id)}>Delete</button>
      ) : null}
    </div>
  );
};

export default EntryDescription;
