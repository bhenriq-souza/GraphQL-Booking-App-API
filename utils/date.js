/**
 * Convert a ISO Date from MongoDB into a more readable format
 * 
 * @param {String} date
 * 
 * @returns {String} Formated date
 */
function dateToString(date) {
  return new Date(date).toISOString();
}

module.exports = {
  dateToString
}
