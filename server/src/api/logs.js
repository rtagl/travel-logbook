const logsRouter = require('express').Router();

const LogEntry = require('../models/logEntry');

logsRouter.get('/', async (req, res, next) => {
  try {
    const entries = await LogEntry.find({});
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

logsRouter.post('/', async (req, res, next) => {
  console.log(req.body);

  try {
    const logEntry = new LogEntry(req.body);
    const createdEntry = await logEntry.save();
    res.json(createdEntry);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422);
    }
    next(error);
  }
});

module.exports = logsRouter;
