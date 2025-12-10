const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign(
    { user: { id: user.id, role: user.role } },
    process.env.JWT_SECRET || 'mySuperSecretHotelKey123',
    { expiresIn: '24h' }
  );
};

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!password) {
      return res
        .status(400)
        .json({ msg: 'Пароль обязателен для обычной регистрации' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ msg: 'Пользователь с таким email уже существует' });
    }

    user = new User({
      username,
      email,
      password,
      authProvider: 'local',
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = generateToken(user);
    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Неверный email или пароль' });
    }

    if (!user.password) {
      return res.status(400).json({ msg: 'Пожалуйста, войдите через Google' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Неверный email или пароль' });
    }

    const token = generateToken(user);
    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.googleAuth = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, sub } = ticket.getPayload();
    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = sub;
        user.authProvider = 'google';
        await user.save();
      }
    } else {
      user = new User({
        username: name,
        email: email,
        googleId: sub,
        role: 'guest',
        authProvider: 'google',
      });
      await user.save();
    }

    const jwtToken = generateToken(user);
    res.json({ token: jwtToken, role: user.role, username: user.username });
  } catch (err) {
    console.error('Google Auth Error:', err.message);
    res
      .status(401)
      .json({ msg: 'Ошибка авторизации Google', error: err.message });
  }
};
