const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/User');

loginRouter.post('/', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    res.status(200).send({ token, username: user.username });
  } catch (err) {
    next(err);
  }
});

module.exports = loginRouter;
