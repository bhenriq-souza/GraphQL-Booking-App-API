const { Booking, Event } = require('../../models');
const { Logger } = require('../../utils');
const { ResolverUtils } = require('../../utils');

const logger = Logger.createLogger('info');

module.exports = {
  bookings: async () => {
    logger.info('A query was send to bookings');
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => ResolverUtils.tranformBooking(booking));
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  },
  bookEvent: async (args) => {
    logger.info('A mutation was send to bookEvent');
    const { eventId } = args;
    const userId = '5c5884b427bb9d55d2b6fad8';
    try {
      const event = await Event.findOne({ _id: eventId });
      if (!event) {
        throw new Error('Event not found.');
      }
      const booking = new Booking({
        user: userId,
        event,
      });
      const result = await booking.save();
      return ResolverUtils.tranformBooking(result);
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  },
  cancelBooking: async (args) => {
    logger.info('A mutation was send to cancelBooking');
    const { bookingId } = args;
    try {
      const booking = await Booking.findById(bookingId).populate('event');
      if (!booking) {
        throw new Error('Booking not found.');
      }
      const eventFormated = ResolverUtils.transformEvent(booking.event);
      await Booking.deleteOne({ _id: bookingId });
      return eventFormated;
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  },
};
