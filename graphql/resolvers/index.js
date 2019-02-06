const bcrypt = require('bcrypt');

const { Booking, Event, User } = require('../../models');
const { ResolverUtils } = require('../../utils');
const { Logger } = require('../../utils');

const logger = Logger.createLogger('info');

module.exports = {
  events: async () => {
    logger.info('A query was send to events');
    try {
      const events = await Event.find();
      return events.map(event => ResolverUtils.transformEvent(event));
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  },
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
  createEvent: async (args) => {
    logger.info('A mutation was send to createEvent');
    const userId = args.eventInput.creator;
    try {
      const creator = await User.findOne({ _id: userId });
      if (!creator) {
        throw new Error('User creator does not exists.');
      }
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: userId,
      });
      let result = null;
      result = await event.save();
      if (result) {
        creator.createdEvents.push(result);
        await creator.save();
      }
      return ResolverUtils.transformEvent(result);
    } catch (error) {
      logger.warn(error);
      throw error;
    }
  },
  createUser: async (args) => {
    logger.info('A mutation was send to createUser');
    try {
      const { email } = args.userInput;
      const userResult = await User.findOne({ email });
      if (userResult) {
        throw new Error('User already exists.');
      }
      const hash = bcrypt.hashSync(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hash,
      });
      return await user.save();
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
