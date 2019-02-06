
const { Event, User } = require('../../models');
const { Logger } = require('../../utils');
const { ResolverUtils } = require('../../utils');

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
};
