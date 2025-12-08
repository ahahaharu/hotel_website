const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Client = require('../models/Client');

exports.createBooking = async (req, res) => {
  const { roomId, checkInDate, checkOutDate, guestData } = req.body;

  try {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    if (start >= end) {
      return res
        .status(400)
        .json({ msg: 'Дата выезда должна быть позже даты заезда' });
    }

    const existingBooking = await Booking.findOne({
      room: roomId,
      status: { $ne: 'Отменено' },
      $or: [
        {
          checkInDate: { $lt: end },
          checkOutDate: { $gt: start },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({ msg: 'На выбранные даты номер уже занят' });
    }

    let client = await Client.findOne({ contactInfo: guestData.contactInfo });

    if (!client) {
      client = new Client({
        firstName: guestData.firstName,
        lastName: guestData.lastName,
        contactInfo: guestData.contactInfo,
        passportData: guestData.passportData || 'TBD',
        comment: guestData.comment,
      });
      await client.save();
    }

    const room = await Room.findById(roomId);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * days;

    const newBooking = new Booking({
      room: roomId,
      client: client._id,
      checkInDate: start,
      checkOutDate: end,
      totalPrice: totalPrice,
      status: 'Забронировано',
    });

    await newBooking.save();
    res.json({ msg: 'Номер успешно забронирован!', booking: newBooking });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера при бронировании');
  }
};

exports.getBookings = async (req, res) => {
  try {
    // Если админ - отдаем всё
    if (req.user.role === 'admin') {
      const bookings = await Booking.find()
        .populate('room')
        .populate('client')
        .sort({ createdAt: -1 });
      return res.json(bookings);
    }
    res.json([]);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
