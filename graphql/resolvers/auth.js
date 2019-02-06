const bcrypt = require('bcrypt');
const { User } = require('../../models');
const { Logger } = require('../../utils');

const logger = Logger.createLogger('info');

module.exports = {
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
};
