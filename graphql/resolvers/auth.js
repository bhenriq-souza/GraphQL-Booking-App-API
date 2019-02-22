const { User } = require('../../models');
const { AuthUtil, Logger } = require('../../utils');

const logger = Logger.createLogger('info');

module.exports = {
  createUser: async (args) => {
    logger.info('A mutation was send to createUser');
    try {
      const { email, password } = args.userInput;
      const userResult = await User.findOne({ email });
      if (userResult) {
        throw new Error('User already exists.');
      }
      const hash = AuthUtil.generateHash(password, 12);
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
  login: async (args) => {
    logger.info('A qeury was send to login');
    const { email, password } = args;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials.');
    }
    const isValid = AuthUtil.comparePassoword(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials.');
    }
    const token = AuthUtil.generateToken(user);
    return {
      userId: user.id,
      token,
      tokenExpiration: 1,
    };
  },
};
