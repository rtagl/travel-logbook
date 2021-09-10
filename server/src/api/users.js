const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();

const User = require('../models/user');

usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find().populate('logEntries');
    res.json(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.post('/', async (req, res, next) => {
  const body = req.body;

  try {
    if (body.password1 !== body.password2) {
      throw new TypeError('Password doesnt match.');
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);
    const user = new User({
      username: body.username,
      passwordHash,
    });

    const savedUser = await user.save();

    res.json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
