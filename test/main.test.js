const logger = require('../modules/logger');
const Config = require('config');

const config  = Config.get('database');
const options1 = Config.get('sequelize.options');

const options2 = {
  logging: (msg) => {
    logger.info(msg)
  }
};

//const options = Object.assign({}, options1,options2);
const options = {...options1,...options2};

describe("Config", () => {
  test("run config", () => {
    logger.info(JSON.stringify(config));
  })

  test("review options",() => {
    logger.info(JSON.stringify(options));
    logger.info("object type " + typeof(options));
    options["logger"] = (msg) => logger.info(msg);
    logger.info("upgraded options is " + JSON.stringify(options));
    
  })
})

