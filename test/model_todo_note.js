'use strict';
module.exports = (sequelize, DataTypes) => {
    const todo_note = sequelize.define('todo_note', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        todoId: DataTypes.INTEGER,
        noteId: DataTypes.INTEGER
    }, {
        timestamps: false

    });
    todo_note.associate = function(models) {
    // associations can be defined here
    };
    return todo_note;
};
