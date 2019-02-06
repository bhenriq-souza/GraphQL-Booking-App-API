const { createLogger, format, transports } = require('winston');

class Logger {

  /**
   * Create a new logger
   */
  static createLogger(level) {
    return createLogger({
      level,
      format: format.combine(
        format.colorize(),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
      ),
      transports: [new transports.Console()],
    });
  }
}

module.exports = Logger;
