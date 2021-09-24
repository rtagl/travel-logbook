const notFound = (req, res, next) => {
  res.status(404).send({ error: `unknown endpoint - ${req.originalUrl}` });
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  console.log('helllllllllo');
  console.log(error.message, error.code);
  const validationErrors = {};

  if (error.message === 'Username does not exist.') {
    return res
      .status(400)
      .json({ message: error.message, errorType: 'usernameError' });
  }

  if (error.message === 'Password is incorrect.') {
    return res
      .status(400)
      .json({ message: error.message, errorType: 'passwordError' });
  }

  if (error.code === 11000) {
    return res.status(400).json({
      username: 'Username already exists.',
      errorType: 'signupError',
    });
  }

  if (error.message.includes('LogEntry validation failed')) {
    Object.values(error.errors).forEach(({ properties }) => {
      validationErrors[properties.path] = properties.message;
    });
    return res
      .status(400)
      .json({ ...validationErrors, errorType: 'newLogError' });
  }

  if (error.message.includes('User validation failed')) {
    Object.values(error.errors).forEach(({ properties }) => {
      validationErrors[properties.path] = properties.message;
    });
    return res
      .status(400)
      .json({ ...validationErrors, errorType: 'signupError' });
  }

  // else if (error.name === 'JsonWebTokenError') {
  //   return res.status(401).json({ message: 'Please login!' });
  // } else if (error.name === 'TokenExpiredError') {
  //   return res.status(401).json({
  //     error: 'token expired',
  //   });
  // } else if (error.name === 'CastError') {
  //   return res.status(400).send({ message: error.message });
  // }

  next(error);
};

module.exports = { notFound, errorHandler };
