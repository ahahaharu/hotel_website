const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'Нет токена, авторизация запрещена' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'mySuperSecretHotelKey123'
    );
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Токен невалиден' });
  }
};
