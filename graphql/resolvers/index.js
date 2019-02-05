const bcrypt = require('bcrypt');

const { Event, User } = require('../../models');

/**
 * Return a user by id
 */
const mergeUser = async userId => {
  const user = await User.findById(userId);
  return { ...user._doc, createdEvents: mergeEvent.bind(this, user._doc.createdEvents) };
};

/**
 * Return all events
 */
const mergeEvent = async eventIds => {
  const events = await Event.find({ _id: { $in: eventIds } });
  return events.map(event => {
    return { 
      ...event._doc,
      date: new Date(event._doc.date).toISOString(),
      creator: mergeUser.bind(this, event._doc.creator)
    };
  });
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return { 
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: mergeUser.bind(this, event._doc.creator)
        };
      });
    } catch (error) {
      throw error;
    }
  },
  createEvent: async args => {
    const userId = args.eventInput.creator;
    const creator = await User.findOne({ _id: userId });
    if(!creator) {
      throw new Error('User creator does not exists.');
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: userId
    });
    try {
      let result = null;
      result = await event.save();
      if(result) {
        creator.createdEvents.push(result);
        await creator.save();
      }
      return { 
        ...result._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: mergeUser.bind(this, result._doc.creator)
      };
    } catch (error) {
      throw error;
    }
  },
  createUser: async args => {
    try {
      const email = args.userInput.email;
      const userResult = await User.findOne({ email: email });
      if(userResult) {
        throw new Error('User already exists.');
      }
      const hash = bcrypt.hashSync(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hash
      });
      return await user.save();
    } catch (error) {
      throw error;
    }
  }
}