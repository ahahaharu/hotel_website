const Booking = require('../models/Booking');
const Client = require('../models/Client');
const Room = require('../models/Room');

// 1. Создание бронирования
exports.createBooking = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate, guestData, totalPrice } =
      req.body;

    let client;
    // Логика поиска клиента по User ID
    if (req.user && req.user.id) {
      client = await Client.findOne({ user: req.user.id });
      if (client) {
        client.firstName = guestData.firstName;
        client.lastName = guestData.lastName;
        client.contactInfo = guestData.contactInfo;
        client.passportData = guestData.passportData;
        await client.save();
      } else {
        client = new Client({
          ...guestData,
          user: req.user.id,
        });
        await client.save();
      }
    } else {
      // Логика для анонима / админа
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
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ msg: 'Клиент с таким паспортом уже существует' });
    }
    res.status(500).send('Server Error');
  }
};

// 2. Получение бронирований текущего пользователя
exports.getBookings = async (req, res) => {
  try {
    // Ищем клиента, связанного с текущим юзером
    const client = await Client.findOne({ user: req.user.id });

    let query = {};
    if (client) {
      query.client = client._id;
    } else {
      // Если у юзера нет профиля клиента, то и броней нет
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

// --- НОВЫЕ МЕТОДЫ ДЛЯ АДМИНА (Именно их не хватало!) ---

// 3. Получить ВСЕ бронирования (для админа)
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

// 4. Обновить статус бронирования
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
