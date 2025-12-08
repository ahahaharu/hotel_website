const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware'); // <--- Импортируем middleware

// Добавляем auth в POST запрос
router.post('/', auth, reviewController.createReview);

// GET запрос оставляем открытым (все могут читать)
router.get('/', reviewController.getReviews);

module.exports = router;
