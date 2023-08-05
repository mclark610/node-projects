const db = require('../src/models/index.js');
const models = require( '../src/models');

const logger = require('../src/modules/logger');

const { users } = models;


afterAll(async () => {
  db.sequelize.close();
});

test("authenticate the sequelize connection is valid", async () => {

  try {
    await db.sequelize.authenticate();
    logger.info('Connection has been established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  }
})


test("Sequelize User model still work?", async () => {
  await users.findAll({})
  .then( (results) => {
      logger.info("Results are : " + JSON.stringify(results));
  })
  .catch( (err) => {
      logger.info("fetchUser:findAll error: " + err);
  });
})

test("Sequelize User 1 model send all data?", async () => {
  await users.findByPk(1)
  .then( (results) => {
      logger.info("User ID 1 is Results are : " + JSON.stringify(results));
  })
  .catch( (err) => {
      logger.info("fetchUser:findAll error: " + err);
  });
})

test("Sequelize findByName test.", async() => {
    const username = "mclark"

    await users.findOne({
        where: {
            name: username
        }
    })
    .then( (results) => {
        logger.info("User ID 1 is Results are : " + JSON.stringify(results));
    })
    .catch( (err) => {
        logger.info("fetchUser:findAll error: " + err);
    });
  })

  