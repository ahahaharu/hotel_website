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
    },
    photoUrl: {
      type: String,
      default:
        'https://via.assets.so/img.jpg?w=400&h=300&bg=e5e7eb&text=No+photo&f=png',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', RoomSchema);
