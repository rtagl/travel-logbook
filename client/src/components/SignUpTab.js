const SignUpTab = ({
  handleSignUp,
  handleSignUpView,
  handleSignUpFields,
  errorMsg,
  newUser,
}) => {
  return (
    <div>
      {errorMsg && errorMsg.type === 'Signup Error' ? (
        <div style={{ color: errorMsg.color }}>{errorMsg.message}</div>
      ) : null}
      <button type="button" onClick={handleSignUpView}>
        Go Back
      </button>
      <form onSubmit={handleSignUp}>
        <div>
          Username:
          <input
            type="text"
            value={newUser.username}
            name="username"
            onChange={handleSignUpFields}
          />
        </div>
        <div>
          Password:
          <input
            type="password"
            value={newUser.password1}
            name="password1"
            onChange={handleSignUpFields}
          />
        </div>
        <div>
          Re-type Password:
          <input
            type="password"
            value={newUser.password2}
            name="password2"
            onChange={handleSignUpFields}
          />
        </div>
        <button type="submit">Sign Up!</button>
      </form>
    </div>
  );
};

export default SignUpTab;
