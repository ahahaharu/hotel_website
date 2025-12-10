const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.get('/', auth, checkRole('admin'), userController.getAllUsers);

module.exports = router;
