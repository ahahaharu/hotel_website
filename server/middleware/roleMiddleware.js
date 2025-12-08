module.exports = function (requiredRole) {
  return function (req, res, next) {
    if (!req.user || req.user.role !== requiredRole) {
      return res
        .status(403)
        .json({ msg: 'Нет доступа. Требуются права администратора.' });
    }
    next();
  };
};
