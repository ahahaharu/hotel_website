const Room = require('../models/Room');
const fs = require('fs');
const path = require('path');

exports.getRooms = async (req, res) => {
  try {
    let query = {};
    if (req.query.comfort) {
      query.comfortLevel = req.query.comfort;
    }
    const rooms = await Room.find(query).sort({ roomNumber: 1 });
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ msg: 'Номер не найден' });
    res.json(room);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.createRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      capacity,
      comfortLevel,
      price,
      description,
      amenities,
    } = req.body;

    console.log('Файл пришел:', req.file); // Для отладки в консоли сервера

    const photo = req.file ? req.file.filename : null;

    const newRoom = new Room({
      roomNumber,
      capacity,
      comfortLevel,
      price,
      description,
      amenities,
      photo, // Сохраняем имя файла
    });

    const room = await newRoom.save();
    res.json(room);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ msg: 'Номер с таким названием уже существует' });
    }
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// !!! ВОТ ЗДЕСЬ БЫЛА ОШИБКА, ИСПРАВЛЕННАЯ ВЕРСИЯ:
exports.updateRoom = async (req, res) => {
  try {
    const { roomNumber, capacity, comfortLevel, price, description } = req.body;

    const oldRoom = await Room.findById(req.params.id);
    if (!oldRoom) return res.status(404).json({ msg: 'Номер не найден' });

    let updateData = {
      roomNumber,
      capacity,
      comfortLevel,
      price,
      description,
    };

    if (req.file) {
      // 1. Сохраняем ИМЯ ФАЙЛА, а не URL
      updateData.photo = req.file.filename;

      // 2. Удаляем старое фото с диска, если оно было
      if (oldRoom.photo) {
        const oldPath = path.join(__dirname, '..', 'uploads', oldRoom.photo);
        fs.access(oldPath, fs.constants.F_OK, (err) => {
          if (!err)
            fs.unlink(oldPath, (e) => {
              if (e) console.error(e);
            });
        });
      }
    }

    const room = await Room.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ msg: 'Номер не найден' });

    if (room.photo) {
      const filePath = path.join(__dirname, '..', 'uploads', room.photo);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Ошибка удаления файла:', err);
      });
    }

    await Room.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Номер удален' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
