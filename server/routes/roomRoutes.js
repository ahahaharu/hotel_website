const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.get('/', roomController.getRooms);
router.get('/:id', roomController.getRoomById);

router.post('/', auth, checkRole('admin'), roomController.createRoom);
router.put('/:id', auth, checkRole('admin'), roomController.updateRoom);
router.delete('/:id', auth, checkRole('admin'), roomController.deleteRoom);

module.exports = router;
