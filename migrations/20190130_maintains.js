'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('maintains', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name:   Sequelize.STRING(128),
      description: Sequelize.TEXT,
      part_nbr: Sequelize.STRING(48),
      status: {
          type: Sequelize.ENUM,
          values: ['active','inactive'],
          defaultValue: 'active'
      },
      complete: Sequelize.BOOLEAN
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('maintains');
  }
};
