'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('todos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      maintain_id: {
          type: Sequelize.INTEGER,
          onDelete: "CASCADE",
          allowNull: false,
          references: {
            model: 'maintains',
            key: 'id'
          }
      },
      name:   Sequelize.STRING(128),
      description: Sequelize.TEXT,
      dueOnHour: {
          type: Sequelize.INTEGER,
          defaultValue: -1
      },
      status: {
          type: Sequelize.ENUM,
          values: ['active','inactive'],
          defaultValue: 'active'
      },
      complete: Sequelize.BOOLEAN,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('todos');
  }
};
