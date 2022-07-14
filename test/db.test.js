const db = require('../models/index.js');
const models = require( '../models');

const logger = require('../modules/logger');

const { projects } = models;


afterAll(async () => {
  db.sequelize.close();
});

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
      console.log("Results are : " + JSON.stringify(results));
  })
  .catch( (err) => {
      console.log("fetchProject:findAll error: " + err);
  });
})

test("Sequelize Project 1 model send all data?", async () => {
  await projects.findByPk(1)
  .then( (results) => {
      console.log("Project ID 1 is Results are : " + JSON.stringify(results));
  })
  .catch( (err) => {
      console.log("fetchProject:findAll error: " + err);
  });
})

