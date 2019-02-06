const { Logger } = require('../../utils');

class MongooseConnection {
  /**
   * Initializes the Mongoose Connection Class
   *
   * @param {*} mongoose
   * @param {*} config
   */
  constructor(mongoose, config) {
    this.mongoose = mongoose;
    this.config = config;
    this.logger = Logger.createLogger('info');
  }

  /**
   * Creates a Mongoose Connection
   *
   */
  async connect() {
    try {
      const {
        user,
        password,
        host,
        database,
        config,
      } = this.config;
      const connectionString = `mongodb://${user}:${password}@${host}/${database}${config}`;
      const ret = await this.mongoose.connect(connectionString, { useNewUrlParser: true });
      this.logger.info(`Connected to database ${ret.connection.db.databaseName}`);
    } catch (err) {
      this.logger.warn(err);
      throw err;
    }
  }
}

module.exports = MongooseConnection;
