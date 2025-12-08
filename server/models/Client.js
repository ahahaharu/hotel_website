const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema(
  {
    lastName: {
      type: String,
      required: [true, 'Фамилия обязательна'],
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, 'Имя обязательно'],
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    passportData: {
      type: String,
      required: true,
      unique: true,
    },
    comment: {
      type: String,
      default: '',
    },
    contactInfo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Client', ClientSchema);
