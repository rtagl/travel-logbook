import React from 'react';

const Navbar = ({ handleLoginView, handleHomeView, handleSignupView }) => {
  return (
    <div className="navbar">
      <div className="container flex">
        <div className="logo" onClick={handleHomeView}>
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
        <div className="nav-buttons">
          <div>
            <button onClick={handleLoginView}>Log In</button>
          </div>
          <div>
            <button onClick={handleSignupView}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
