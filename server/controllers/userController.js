const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    // Возвращаем всех, кроме паролей
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
