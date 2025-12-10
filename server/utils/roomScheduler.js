const Booking = require('../models/Booking');

const startRoomStatusUpdater = () => {
  const updateStatuses = async () => {
    try {
      const now = new Date();

      const checkInResult = await Booking.updateMany(
        {
          checkInDate: { $lte: now },
          checkOutDate: { $gt: now },
          status: 'Забронировано',
        },
        {
          $set: { status: 'Заселен' },
        }
      );

      if (checkInResult.modifiedCount > 0) {
        console.log(
          `🛎️ Авто-заселение: Обновлено ${checkInResult.modifiedCount} броней (Статус -> Заселен).`
        );
      }

      const checkOutResult = await Booking.updateMany(
        {
          checkOutDate: { $lt: now },
          status: { $in: ['Забронировано', 'Заселен'] },
        },
        {
          $set: { status: 'Выехал' },
        }
      );

      if (checkOutResult.modifiedCount > 0) {
        console.log(
          `🏁 Авто-выселение: Обновлено ${checkOutResult.modifiedCount} броней (Статус -> Выехал).`
        );
      }
    } catch (error) {
      console.error('❌ Ошибка в планировщике:', error);
    } finally {
      setTimeout(updateStatuses, 30000);
    }
  };

  updateStatuses();
};

module.exports = startRoomStatusUpdater;
