'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      part_id: {
          type: Sequelize.INTEGER,
          references: {
              model: 'parts',
              key: 'id'
          },
          allowNull: true
      },
      status: {
          type: Sequelize.ENUM,
          values: ['active','inactive'],
          defaultValue: 'active'
      },
      complete: Sequelize.BOOLEAN,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
  })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('projects');
  }
};
