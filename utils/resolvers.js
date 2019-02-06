const { Event, User } = require('../models');
const { DateUtils } = require('../utils');

/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */

/**
 * Transform a event object from mongo
 *
 * @param {Object} event
 *
 * @returns {Object} Transformed event
 */
function transformEvent(event) {
  return {
    ...event._doc,
    creator: formatUser.bind(this, event._doc.creator),
    date: DateUtils.dateToString(event._doc.date),
  };
}

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
    return events.map(event => transformEvent(event));
  } catch (error) {
    throw error;
  }
}

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
      createdEvents: formatEvent.bind(this, user.createdEvents),
    };
  } catch (error) {
    throw error;
  }
}

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
    return transformEvent(event);
  } catch (error) {
    throw error;
  }
}

/**
 * Transform a booking object from mongo
 *
 * @param {Object} booking
 *
 * @returns {Object} Transformed booking
 */
function tranformBooking(booking) {
  return {
    ...booking._doc,
    createdAt: DateUtils.dateToString(booking.createdAt),
    updatedAt: DateUtils.dateToString(booking.updatedAt),
    user: formatUser.bind(this, booking.user),
    event: formatSingleEvent.bind(this, booking.event),
  };
}

module.exports = {
  formatEvent,
  formatUser,
  formatSingleEvent,
  tranformBooking,
  transformEvent,
};
