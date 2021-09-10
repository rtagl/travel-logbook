const LoginTab = ({
  user,
  handleLogout,
  handleLogin,
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleShowSignUpView,
}) => {
  return (
    <div>
      {user ? (
        <div>
          {user.username}
          <button onClick={handleLogout}>logout</button>
        </div>
      ) : null}
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
        <button type="button" onClick={handleShowSignUpView}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default LoginTab;
