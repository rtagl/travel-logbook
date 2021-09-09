const notFound = (req, res, next) => {
  res.status(404).send({ error: `unknown endpoint - ${req.originalUrl}` });
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Please login!' });
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    });
  }

  next(error);
};

module.exports = { notFound, errorHandler };
