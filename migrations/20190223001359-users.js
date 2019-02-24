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
            password: Sequelize.STRING(16),
            description: Sequelize.TEXT,
            status: {
                type: Sequelize.ENUM,
                values: ['active','inactive'],
                defaultValue: 'active'
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('users');
    }
};
