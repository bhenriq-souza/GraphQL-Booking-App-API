const jwt = require('jsonwebtoken');
const { secureKey } = require('../config');
const { Logger } = require('../utils');

const logger = Logger.createLogger('info');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    req.isAuth = false;
    return next();
  }
  try {
    const decodedToken = jwt.verify(token, secureKey);
    if (!decodedToken) {
      req.isAuth = false;
      return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    return next();
  } catch (error) {
    logger.warn(error);
    throw error;
  }
};
