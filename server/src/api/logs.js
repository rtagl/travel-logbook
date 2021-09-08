const jwt = require('jsonwebtoken');
const logsRouter = require('express').Router();

const LogEntry = require('../models/logEntry');
const User = require('../models/user');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

logsRouter.get('/', async (req, res, next) => {
  try {
    const entries = await LogEntry.find().populate('user', { username: 1 });
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

logsRouter.post('/', async (req, res, next) => {
  console.log(req.body);
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  console.log(decodedToken, '439943948394893');
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  try {
    const body = req.body;
    const user = await User.findById(decodedToken.id);
    const logEntry = new LogEntry(body);
    logEntry.user = user._id;
    const createdEntry = await logEntry.save();
    user.logEntries = user.logEntries.concat(createdEntry._id);
    await user.save();
    res.json(createdEntry);
  } catch (error) {
    next(error);
  }

  // try {
  //   const body = req.body;
  //   const user = await User.findById(decodedToken.id);
  //   const logEntry = new LogEntry(body);
  //   logEntry.user = user._id;
  //   const createdEntry = await logEntry.save();
  //   user.logEntries = user.logEntries.concat(createdEntry._id);
  //   await user.save();
  //   res.json(createdEntry);
  // } catch (error) {
  //   console.log(error.name, '890890890809');
  //   if (error.name === 'ValidationError') {
  //     return res.status(422).json({ error: error.message });
  //   }

  //   next(error);
  // }
});

module.exports = logsRouter;
