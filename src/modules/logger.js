const { createLogger, colorize, timestamp, format, transports } = require('winston');
/*

https://www.npmjs.com/package/winston

const logger = createLogger({
  format: format.combine(
    format.splat(),
    format.colorize(),
    format.simple(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
  ),
  transports: [new transports.Console()]
});

// info: test message my string {}
logger.info('info', 'test message %s', 'my string');

// info: test message my 123 {}
logger.info('info', 'test message %d', 123);

// info: test message first second {number: 123}
logger.info('info', 'test message %s, %s', 'first', 'second', { number: 123 });

//export.modules = logger;
*/
const logger = createLogger({
  format: format.combine(
//      format.simple(),
//    format.label({ label: '[my-label]' }),
    format.timestamp({
      format: 'YYYYMMDD HH:mm:ss.SSS'
    }),
    format.splat(),
    format.colorize(),
    //
    // The simple format outputs
    // `${level}: ${message} ${[Object with everything else]}`
    //
    //format.simple()
    //
    // Alternatively you could use this custom printf format if you
    // want to control where the timestamp comes in your final message.
    // Try replacing `format.simple()` above with this:
    //
   format.printf(info => `[${info.level}] ${info.timestamp}: ${info.message}`)
  ),
  transports: [
    new transports.Console()
  ]
});

//logger.info('Hello there. How are you?');
//logger.info('info', "Whats going on")
module.exports= logger;
