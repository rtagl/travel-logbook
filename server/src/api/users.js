const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersRouter = require('express').Router();

const User = require('../models/User');

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: maxAge });
};

usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find().populate('logEntries');
    res.json(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.post('/', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ username, password: passwordHash });
    const token = createToken(user._id);
    res.status(201).json({ id: user._id, username: user.username, token });
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
