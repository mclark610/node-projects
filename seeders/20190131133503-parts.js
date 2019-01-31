'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('parts', [
          {
              maintain_id: 1,
              name: "Oil",
              description: "Pennzoil 30wt for small engines",
              part_nbr: '30wt',
              status: 'active',
              complete: false
          }, {
              maintain_id: 1,
              name: "air filter",
              part_nbr: 'gsx-160-3849',
              description: "honda air filter",
              status: 'active',
              complete: false
          }
      ])
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('parts', null, {});
  }
};
