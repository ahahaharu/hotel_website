const Booking = require('../models/Booking');
const Client = require('../models/Client');
const Room = require('../models/Room');

const checkOverlap = async (roomId, checkIn, checkOut) => {
  const existingBooking = await Booking.findOne({
    room: roomId,
    status: { $ne: 'Отменено' },
    $and: [
      { checkInDate: { $lt: new Date(checkOut) } },
      { checkOutDate: { $gt: new Date(checkIn) } },
    ],
  });
  return existingBooking;
};

exports.checkRoomAvailability = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;

    const hasConflict = await checkOverlap(roomId, checkInDate, checkOutDate);

    if (hasConflict) {
      return res
        .status(400)
        .json({ msg: 'На выбранные даты номер уже занят!' });
    }

    res.status(200).json({ msg: 'Номер свободен' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const client = await Client.findOne({ user: req.user.id });
    if (!client) {
      return res.status(404).json({ msg: 'Профиль клиента не найден' });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      client: client._id,
    });

    if (!booking) {
      return res
        .status(404)
        .json({ msg: 'Бронирование не найдено или доступ запрещен' });
    }

    if (booking.status !== 'Забронировано') {
      return res
        .status(400)
        .json({ msg: 'Нельзя отменить бронирование с текущим статусом' });
    }
    booking.status = 'Отменено';
    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate, guestData, totalPrice } =
      req.body;

    const hasConflict = await checkOverlap(roomId, checkInDate, checkOutDate);
    if (hasConflict) {
      return res
        .status(400)
        .json({ msg: 'К сожалению, номер только что был занят.' });
    }

    let client;
    if (req.user && req.user.id) {
      client = await Client.findOne({ user: req.user.id });
      if (client) {
      } else {
        client = new Client({ ...guestData, user: req.user.id });
        await client.save();
      }
    } else {
      client = await Client.findOne({ passportData: guestData.passportData });
      if (!client) {
        client = new Client(guestData);
        await client.save();
      }
    }

    const newBooking = new Booking({
      room: roomId,
      client: client._id,
      checkInDate,
      checkOutDate,
      totalPrice,
      status: 'Забронировано',
    });

    const booking = await newBooking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    if (err.code === 11000)
      return res.status(400).json({ msg: 'Клиент уже существует' });
    res.status(500).send('Server Error');
  }
};

exports.getBookings = async (req, res) => {
  try {
    const client = await Client.findOne({ user: req.user.id });

    let query = {};
    if (client) {
      query.client = client._id;
    } else {
      return res.json([]);
    }

    const bookings = await Booking.find(query)
      .populate('room', 'roomNumber price')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('room', 'roomNumber price')
      .populate('client')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
