const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Room = require('./models/Room');
const Client = require('./models/Client');
const Booking = require('./models/Booking');
const User = require('./models/User');

const roomsData = [
  {
    roomNumber: '101',
    capacity: 1,
    comfortLevel: 'Обычный',
    price: 3000,
    description: 'Уютный одноместный номер эконом класса.',
  },
  {
    roomNumber: '102',
    capacity: 1,
    comfortLevel: 'Обычный',
    price: 3000,
    description: 'Тихий номер с видом на двор.',
  },
  {
    roomNumber: '103',
    capacity: 2,
    comfortLevel: 'Обычный',
    price: 4500,
    description: 'Стандартный двухместный номер.',
  },
  {
    roomNumber: '104',
    capacity: 2,
    comfortLevel: 'Обычный',
    price: 4500,
    description: 'Просторный стандарт.',
  },
  {
    roomNumber: '201',
    capacity: 2,
    comfortLevel: 'Полулюкс',
    price: 6000,
    description: 'Улучшенный номер с балконом.',
  },
  {
    roomNumber: '202',
    capacity: 2,
    comfortLevel: 'Полулюкс',
    price: 6500,
    description: 'Полулюкс с рабочей зоной.',
  },
  {
    roomNumber: '203',
    capacity: 3,
    comfortLevel: 'Полулюкс',
    price: 7500,
    description: 'Семейный полулюкс.',
  },
  {
    roomNumber: '204',
    capacity: 3,
    comfortLevel: 'Полулюкс',
    price: 7500,
    description: 'Большой номер для троих.',
  },
  {
    roomNumber: '301',
    capacity: 2,
    comfortLevel: 'Люкс',
    price: 12000,
    description: 'Роскошный люкс с джакузи.',
  },
  {
    roomNumber: '302',
    capacity: 2,
    comfortLevel: 'Люкс',
    price: 12000,
    description: 'Панорамный вид на город.',
  },
  {
    roomNumber: '303',
    capacity: 4,
    comfortLevel: 'Люкс',
    price: 15000,
    description: 'Президентский люкс с двумя спальнями.',
  },
  {
    roomNumber: '304',
    capacity: 4,
    comfortLevel: 'Люкс',
    price: 15000,
    description: 'Апартаменты высшего класса.',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🌱 Подключение к Mongo для seeding успешно');

    await Room.deleteMany({});
    await Client.deleteMany({});
    await Booking.deleteMany({});
    await User.deleteMany({});
    console.log('🧹 Старые данные очищены');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('👤 Администратор создан (login: admin, pass: admin123)');

    const createdRooms = await Room.insertMany(roomsData);
    console.log(`🏨 Добавлено ${createdRooms.length} номеров`);

    const clientsData = [
      {
        firstName: 'Иван',
        lastName: 'Иванов',
        middleName: 'Иванович',
        passportData: 'AB123456',
        contactInfo: '+79001234567',
        comment: 'Любит тишину',
      },
      {
        firstName: 'Петр',
        lastName: 'Петров',
        middleName: 'Петрович',
        passportData: 'CD789012',
        contactInfo: '+79009876543',
        comment: 'Постоянный клиент',
      },
      {
        firstName: 'Анна',
        lastName: 'Сидорова',
        middleName: 'Алексеевна',
        passportData: 'EF345678',
        contactInfo: '+79001112233',
        comment: 'Нужна доп. кровать',
      },
    ];
    const createdClients = await Client.insertMany(clientsData);
    console.log(`👥 Добавлено ${createdClients.length} клиентов`);

    const booking = new Booking({
      client: createdClients[0]._id,
      room: createdRooms[0]._id,
      checkInDate: new Date(),
      checkOutDate: new Date(new Date().setDate(new Date().getDate() + 5)),
      status: 'Забронировано',
      totalPrice: createdRooms[0].price * 5,
    });
    await booking.save();

    // createdRooms[0].isOccupied = true; await createdRooms[0].save();

    console.log('📅 Тестовое бронирование создано');

    console.log('✅ База данных успешно заполнена!');
    process.exit();
  } catch (err) {
    console.error('❌ Ошибка при наполнении базы:', err);
    process.exit(1);
  }
};

seedDB();
