const notFound = (req, res, next) => {
  res.status(404).send({ error: `unknown endpoint - ${req.originalUrl}` });
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    console.log('validation error', error.message);
    return res.status(400).json({ message: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Please login!' });
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    });
  } else if (error.name === 'TypeError') {
    console.log('typeError', error.message);
    return res.status(400).send({
      message: 'Password does not match',
    });
  } else if (error.name === 'CastError') {
    return res.status(400).send({ message: error.message });
  }

  next(error);
};

module.exports = { notFound, errorHandler };
