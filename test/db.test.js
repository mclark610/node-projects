const db = require('../models/index.js');
const models = require( '../models');

const logger = require('../modules/logger');
const { projects } = models;


test("authenticate the sequelize connection is valid", async () => {

  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})

test("Sequelize Project model still work?", async () => {
  await projects.findAll({})
  .then( (results) => {
      logger.info("fetchMaintain:findAll: success: " + JSON.stringify(results));
  })
  .catch( (err) => {
      logger.info("fetchMaintain:findAll error: " + err);
  });
})
