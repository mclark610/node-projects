const db = require('../models/index.js');


test("run a sql query", async () => {

  try {
    const results = await db.sequelize.query('CALL retrieve_project_parts(1)');
      console.log('Connection has been established successfully.' + JSON.stringify(results));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  
})
