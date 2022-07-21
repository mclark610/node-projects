const logger = require('../modules/logger');


describe("Checking out Winston logger", () => {
  test("run logger", () => {
    const myTest = "My Man";
    logger.info({
      level: 'info',
      message: 'Hello from distributed log files!'
    });

    logger.info('Hello again distributed logs, %s',"Mark");
    logger.info(`Hello yet again! Lets try this! ${myTest}, %s`, "Mark")
  })
})

