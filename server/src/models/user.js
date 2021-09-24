const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Please enter a username.'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password.'],
    minlength: [6, 'Minimum password length is 6 chars.'],
  },
  logEntries: [
    {
      type: Schema.Types.ObjectId,
      ref: 'LogEntry',
    },
  ],
});

// static method to log in user
userSchema.statics.login = async (username, password) => {
  const user = await User.findOne({ username });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    console.log(auth);
    if (auth) {
      return user;
    }
    throw Error('Password is incorrect.');
  }
  throw Error('Username does not exist.');
};

const User = mongoose.model('User', userSchema);

module.exports = User;
