const _ = require('lodash');

const env = process.env.SERVER_ENV || 'local';
const defaultConfig = { env };
const envConfig = env === 'local' ? require('./local') : null;

module.exports = _.merge(defaultConfig, envConfig);
