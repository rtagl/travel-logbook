const LoginTab = ({
  user,
  handleLogout,
  handleLogin,
  username,
  password,
  errorMsg,
  handleUsernameChange,
  handlePasswordChange,
  handleSignUpView,
}) => {
  return (
    <div>
      {errorMsg && errorMsg.type === 'Login Error' ? (
        <div style={{ color: errorMsg.color }}>{errorMsg.message}</div>
      ) : null}
      {user ? (
        <div>
          {user.username}
          <button onClick={handleLogout}>logout</button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <div>
            username:
            <input
              type="text"
              value={username}
              name="username"
              onChange={handleUsernameChange}
            />
          </div>
          <div>
            password:
            <input
              type="password"
              value={password}
              name="password"
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit">Login</button>
          <button type="button" onClick={handleSignUpView}>
            Sign Up
          </button>
        </form>
      )}
    </div>
  );
};

export default LoginTab;
