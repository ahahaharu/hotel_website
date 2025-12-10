const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      sparse: true,
    },
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
      required: [true, 'Паспортные данные обязательны'],
      unique: true,
    },
    contactInfo: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Client', ClientSchema);
