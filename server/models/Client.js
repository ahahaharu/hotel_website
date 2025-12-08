const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema(
  {
    // Связь с аккаунтом (может быть null, если бронирует менеджер для человека с улицы)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true, // У одного юзера только одна анкета клиента
      sparse: true, // Позволяет иметь много клиентов БЕЗ юзера (null)
    },
    lastName: {
      type: String,
      required: [true, 'Фамилия обязательна'],
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, 'Имя обязательно'],
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    // Паспорт обязателен и уникален
    passportData: {
      type: String,
      required: [true, 'Паспортные данные обязательны'],
      unique: true,
    },
    contactInfo: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Client', ClientSchema);
