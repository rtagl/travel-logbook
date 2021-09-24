const LoginTab = ({
  handleLogin,
  username,
  password,
  errorMsg,
  handleUsernameChange,
  handlePasswordChange,
}) => {
  return (
    <div className="auth-form">
      <form onSubmit={handleLogin}>
        <h2>Log In</h2>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          value={username}
          name="username"
          onChange={handleUsernameChange}
          required
        />

        {errorMsg && errorMsg.errorType === 'usernameError' ? (
          <div className="username error">{errorMsg.message}</div>
        ) : null}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          name="password"
          onChange={handlePasswordChange}
          required
        />

        {errorMsg && errorMsg.errorType === 'passwordError' ? (
          <div className="password error">{errorMsg.message}</div>
        ) : null}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginTab;
