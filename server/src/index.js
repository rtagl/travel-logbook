require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const middlewares = require('./middlewares');

const app = express();
const logsRouter = require('./api/logs');
const usersRouter = require('./api/users');
const loginRouter = require('./api/loginRouter');

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    const url = process.env.DATABASE_URL;
    console.log('connected to MongoDB: ', url);
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB', error.message);
  });

app.use(morgan('common'));
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/logs', logsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
