const Room = require('../models/Room');

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
    const newRoom = new Room(req.body);
    const room = await newRoom.save();
    res.json(room);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.updateRoom = async (req, res) => {
  try {
    let room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(room);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Номер удален' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
