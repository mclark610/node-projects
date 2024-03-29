'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('users', {
            id:  {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name:   Sequelize.STRING(128),
            password: Sequelize.STRING(128),
            description: Sequelize.TEXT,
            status: {
                type: Sequelize.INTEGER,
                defaultValue: 1,
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('users');
    }
};
