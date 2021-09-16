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
  // if (!token || !decodedToken.id) {
  //   return res.status(401).json({ error: 'token missing or invalid' });
  // }

  try {
    const body = req.body;
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    console.log(decodedToken, 'decoded token');
    const user = await User.findById(decodedToken.id);
    const logEntry = new LogEntry(body);
    logEntry.user = user._id;
    logEntry.username = user.username;
    const createdEntry = await logEntry.save();
    user.logEntries = user.logEntries.concat(createdEntry._id);
    await user.save();
    res.json(createdEntry);
  } catch (error) {
    next(error);
  }
});

logsRouter.delete('/:id', (req, res, next) => {
  LogEntry.findByIdAndRemove({ _id: req.params.id }).then((entry) => {
    console.log(entry);
    res.send(entry);
  });
});

module.exports = logsRouter;
