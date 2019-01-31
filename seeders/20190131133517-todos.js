'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert( 'todos', [
      {
          maintain_id: 1,
          name: "change oil",
          description: "change oil and dispose of oil.",
          status: 'active',
          complete: false
      }, {
          maintain_id: 2,
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
