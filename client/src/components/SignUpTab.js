const SignUpTab = ({
  handleSignUp,
  handleSignUpFields,
  errorMsg,
  newUser,
  setShowLoginView,
  showLoginView,
}) => {
  return (
    <div>
      <form onSubmit={handleSignUp}>
        <h2>Sign Up</h2>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          value={newUser.username}
          name="username"
          onChange={handleSignUpFields}
        />

        {errorMsg && errorMsg.errorType === 'signupError' ? (
          <div className="error">{errorMsg.username}</div>
        ) : null}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={newUser.password}
          name="password"
          onChange={handleSignUpFields}
        />
        {errorMsg && errorMsg.errorType === 'signupError' ? (
          <div className="error">{errorMsg.password}</div>
        ) : null}
        <div>
          <button type="submit">Sign Up!</button>
          or{' '}
          <a href="/" onClick={() => setShowLoginView(!showLoginView)}>
            Log In
          </a>
        </div>
      </form>
    </div>
  );
};

export default SignUpTab;
