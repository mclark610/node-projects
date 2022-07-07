'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('maintain_notes', {
            maintainId: {
                type: Sequelize.INTEGER
            },
            noteId: {
                type: Sequelize.INTEGER
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('maintain_notes');
    }
};
