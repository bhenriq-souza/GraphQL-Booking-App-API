const bookingResolvers = require('./booking.js');
const eventResolvers = require('./events');
const authResolvers = require('./auth');

const rootResolver = {
  ...bookingResolvers,
  ...eventResolvers,
  ...authResolvers,
};

module.exports = rootResolver;
