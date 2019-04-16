'use strict';
module.exports = (sequelize, DataTypes) => {
    const todo_note = sequelize.define('todo_note', {
        todoId: DataTypes.INTEGER,
        noteId: DataTypes.INTEGER
    }, {});
    todo_note.associate = function(models) {
    // associations can be defined here
    };
    return todo_note;
};
