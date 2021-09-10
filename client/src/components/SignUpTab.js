const SignUpTab = ({
  handleSignUp,
  handleShowSignUpView,
  handleSignUpFields,
  newUser,
}) => {
  return (
    <div>
      <button type="button" onClick={handleShowSignUpView}>
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
