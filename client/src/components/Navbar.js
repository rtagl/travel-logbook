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
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
        </Link>
        {user ? (
          <div className="nav-buttons flex">
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
