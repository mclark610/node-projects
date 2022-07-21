const db = require('../models/index.js');

const logger = require('../modules/logger');

test("run a sql query", async () => {

  try {
    const results = await db.sequelize.query('CALL retrieve_project_parts(1)');
      logger.info('Connection has been established successfully.' + JSON.stringify(results));
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  }
  
})
