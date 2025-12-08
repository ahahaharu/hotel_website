const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  try {
    const { rating, text } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    const review = new Review({
      username: user.username,
      rating,
      text,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
