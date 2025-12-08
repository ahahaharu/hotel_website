const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// 1. Создать бронь (Доступно всем авторизованным)
router.post('/', auth, bookingController.createBooking);

// 2. Получить свои брони (Доступно всем авторизованным)
// ВАЖНО: Этот роут должен быть ВЫШЕ, чем /:id, но ниже специфичных путей типа /all, если бы они конфликтовали
router.get('/', auth, bookingController.getBookings);

// 3. Получить ВСЕ брони (Только Админ)
// Обратите внимание: путь /all. Если контроллер не экспортировал getAllBookings, здесь падала ошибка.
router.get('/all', auth, checkRole('admin'), bookingController.getAllBookings);

// 4. Обновить статус (Только Админ)
router.put(
  '/:id/status',
  auth,
  checkRole('admin'),
  bookingController.updateBookingStatus
);

module.exports = router;
