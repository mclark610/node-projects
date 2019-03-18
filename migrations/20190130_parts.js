'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('parts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name:   Sequelize.STRING(128),
      part_nbr: Sequelize.STRING(48),
      price: Sequelize.DECIMAL(8,2),
      description: Sequelize.TEXT,
      vendor: Sequelize.STRING(255),
      image_filename: Sequelize.STRING(255),
      doc_filename: Sequelize.STRING(255),
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
    return queryInterface.dropTable('parts');
  }
};
