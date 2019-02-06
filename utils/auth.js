const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secureKey } = require('../config');

/* eslint-disable no-underscore-dangle */

function generateToken(user) {
  const { id, email } = user;
  return jwt.sign({ userId: id, email }, secureKey, { expiresIn: '1h' });
}

function comparePassoword(password, encryptedString) {
  return bcrypt.compareSync(password, encryptedString);
}

function generateHash(string, salt) {
  return bcrypt.hashSync(string, salt);
}

function isAuthorized(requisition) {
  if (!requisition.isAuth) {
    throw new Error('User unauthorized');
  }
}

module.exports = {
  generateToken,
  comparePassoword,
  generateHash,
  isAuthorized,
};
