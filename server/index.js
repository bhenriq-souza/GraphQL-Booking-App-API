const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { GraphQLSchemas, GraphQLResolvers } = require('../graphql');
const { Logger } = require('../utils');
const { MongoConnection } = require('../database');
const { AuthMiddleware } = require('../middleware');

class Server {
  /**
   * Initialize the Server Class
   * @constructor
   * @param {*} app
   * @param {*} mongoose
   */
  constructor(app, mongoose) {
    this.app = app;
    this.mongoose = mongoose;
    this.logger = Logger.createLogger('info');
  }

  /**
   * Creates the server
   *
   * @param {Object} config
   */
  async create(config) {
    try {
      const { serverPort, mongo } = config;

      // Setting the server port
      this.port = serverPort;

      // Using body-parser
      this.app.use(bodyParser.json());

      // Using auth middleware
      this.app.use(AuthMiddleware);

      // Setting graphQL
      this.app.use('/graphql', graphqlHttp({
        schema: GraphQLSchemas,
        rootValue: GraphQLResolvers,
        graphiql: true,
      }));

      // Setting mongoose's index creation as true
      this.mongoose.set('useCreateIndex', true);

      // Setting MongoDB connect
      this.mongooseConn = new MongoConnection(this.mongoose, mongo);
    } catch (error) {
      this.logger.warn(error);
      throw error;
    }
  }

  /**
   * Starts the server
   */
  async start() {
    try {
      await this.mongooseConn.connect();
      await this.app.listen(this.port);
      this.logger.info(`Server listen to ${this.port} port`);
    } catch (error) {
      this.logger.warn(error);
      process.exit(1);
      throw error;
    }
  }
}

module.exports = Server;
