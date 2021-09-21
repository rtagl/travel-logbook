const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Please enter a username.'],
    unique: true,
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

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function (username, password) {
  const user = await User.findOne({ username });
  if (user) {
    const auth = bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('Password is incorrect.');
  }
  throw Error('Username does not exist.');
};

// userSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//     // the passwordHash should not be revealed
//     delete returnedObject.passwordHash;
//   },
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
