const bcrypt = require('bcrypt');

const { Booking, Event, User } = require('../../models');

/**
 * Formate user to fetch all enabled data
 * 
 * @param {Stirng} userId
 * 
 * @returns {Object} Formated user
 */
async function formatUser(userId) {
  try {
    const user = await User.findById(userId);
    return { 
      ...user._doc, 
      createdEvents: formatEvent.bind(this, user._doc.createdEvents) 
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Formate event list to fetch all enabled data
 * 
 * @param {Array} eventIds
 * 
 * @returns {Object} Formated events list
 */
async function formatEvent(eventIds) {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return { 
        ...event._doc,
        date: convertDate(event._doc.date),
        creator: formatUser.bind(this, event._doc.creator)
      };
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Formate single event to fetch all enabled data
 * 
 * @param {String} eventId
 * 
 * @returns {Object} Formated events list
 */
async function formatSingleEvent(eventId) {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      creator: formatUser.bind(this, event._doc.creator),
      date: convertDate(event._doc.date)
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Convert a ISO Date from MongoDB into a more readable format
 * 
 * @param {String} dateString
 * 
 * @returns {String} Formated date
 */
function convertDate(dateString) {
  return new Date(dateString).toISOString();
}

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return { 
          ...event._doc,
          date: convertDate(event._doc.date),
          creator: formatUser.bind(this, event._doc.creator)
        };
      });
    } catch (error) {
      throw error;
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        const teste = {
          ...booking._doc,
          createdAt: convertDate(booking._doc.createdAt),
          updatedAt: convertDate(booking._doc.updatedAt),
          user: formatUser.bind(this, booking._doc.user),
          event: formatSingleEvent.bind(this, booking._doc.event)
        }
        return teste;
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
        date: convertDate(event._doc.date),
        creator: formatUser.bind(this, result._doc.creator)
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
  },
  bookEvent: async args => {
    const eventId = args = args.eventId;
    const userId = "5c5884b427bb9d55d2b6fad8";
    try {
      const event = await Event.findOne({ _id: eventId });
      if(!event) {
        throw new Error('Event not found.');
      }    
      const booking = new Booking({
        user: userId,
        event: event
      });
      const result = await booking.save();
      return  {
        ...result._doc,
        createdAt: convertDate(result._doc.createdAt),
        updatedAt: convertDate(result._doc.updatedAt),
        user: formatUser.bind(this, result._doc.user),
        event: formatSingleEvent.bind(this, result._doc.event)
      };
    } catch (error) {
      throw error;
    }
  },
  cancelBooking: async args => {
    const bookingId = args = args.bookingId;
    try {
      const booking = await Booking.findById(bookingId).populate('event');
      const eventFormated = formatSingleEvent(booking.event._id);
      await Booking.deleteOne({ _id: bookingId });
      return eventFormated;
    } catch (error) {
      throw error;
    }
  }
}