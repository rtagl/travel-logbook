const mongoose = require('mongoose');

const { Schema } = mongoose;

const logEntrySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'A title is required.'],
    },
    description: String,
    image: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
      required: [true, 'A rating is required.'],
    },
    visitDate: {
      type: Date,
      required: [true, 'A visit date is required.'],
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90,
      required: true,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  { timestamps: true }
);

logEntrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const LogEntry = mongoose.model('LogEntry', logEntrySchema);

module.exports = LogEntry;
