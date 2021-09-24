import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, handleLogout }) => {
  return (
    <div className="navbar">
      <div className="container flex">
        <Link to="/">
          <div className="logo">
            <svg
              viewBox="0 0 24 24"
              width="40"
              height="40"
              stroke="#fee996"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
        </Link>
        {user ? (
          <div className="nav-buttons flex">
            <h4>Welcome, {user.username}</h4>
            <button onClick={handleLogout}>Log out</button>
          </div>
        ) : (
          <div className="nav-buttons">
            <Link to="/login">
              <button>Log In</button>
            </Link>
            <Link to="/signup">
              <button>Sign Up</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
