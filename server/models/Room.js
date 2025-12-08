const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Номер комнаты обязателен'],
      unique: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Укажите вместимость'],
      min: [1, 'Вместимость не может быть меньше 1'],
    },
    comfortLevel: {
      type: String,
      required: true,
      enum: ['Люкс', 'Полулюкс', 'Обычный'],
    },
    price: {
      type: Number,
      required: [true, 'Укажите цену за ночь'],
      min: 0,
    },
    description: {
      type: String,
      default: '',
    },
    photo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

RoomSchema.virtual('photoUrl').get(function () {
  if (this.photo) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    return `${baseUrl}/uploads/${this.photo}`;
  }
  return 'https://via.assets.so/img.jpg?w=400&h=300&bg=e5e7eb&text=No+photo&f=png';
});

module.exports = mongoose.model('Room', RoomSchema);
