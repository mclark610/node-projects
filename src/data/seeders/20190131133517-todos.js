'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert( 'todos', [
      {
          id: 1,
          name: "change oil",
          description: "change oil and dispose of oil.",
          status: 'active',
          complete: false
      }, {
          id: 2,
          name: "change air filter",
          description: "replace air filter.",
          status: 'active',
          complete: false
      }
      ])
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('todos', null, {});
  }
};
