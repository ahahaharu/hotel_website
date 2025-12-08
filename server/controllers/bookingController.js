const Booking = require('../models/Booking');
const Client = require('../models/Client');
const Room = require('../models/Room');

// 1. Создание бронирования
exports.createBooking = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate, guestData, totalPrice } =
      req.body;

    // Логика поиска или создания клиента
    let client;
    if (req.user && req.user.id) {
      client = await Client.findOne({ user: req.user.id });
      if (client) {
        // Обновляем данные, если нужно (упрощено)
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
      // Если аноним, создаем клиента (здесь может быть ошибка дубликата паспорта, если не проверить)
      // Для упрощения пока просто создаем или ищем по паспорту
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

// 2. Получение всех бронирований (Например, для админа или юзера)
exports.getBookings = async (req, res) => {
  try {
    let query = {};

    // Если это не админ, показываем только его бронирования
    // (Потребуется сложнее логика: найти клиента по юзеру, потом брони по клиенту)
    // Пока сделаем упрощенно: Админ видит всё

    const bookings = await Booking.find(query)
      .populate('room', 'roomNumber price') // Подтянуть данные комнаты
      .populate('client', 'firstName lastName contactInfo') // Подтянуть данные клиента
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
