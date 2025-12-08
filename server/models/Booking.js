const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    checkInDate: {
      type: Date,
      required: [true, 'Дата заезда обязательна'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Дата выезда обязательна'],
    },
    status: {
      type: String,
      enum: ['Забронировано', 'Заселен', 'Выехал', 'Отменено'],
      default: 'Забронировано',
    },
    totalPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);
