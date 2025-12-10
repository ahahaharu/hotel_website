const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.post('/check', bookingController.checkRoomAvailability);
router.patch('/:id/cancel', auth, bookingController.cancelBooking);
router.post('/', auth, bookingController.createBooking);
router.get('/', auth, bookingController.getBookings);
router.get('/all', auth, checkRole('admin'), bookingController.getAllBookings);

router.put(
  '/:id/status',
  auth,
  checkRole('admin'),
  bookingController.updateBookingStatus
);

module.exports = router;
