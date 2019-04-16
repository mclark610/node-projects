'use strict';
module.exports = (sequelize, DataTypes) => {
    const todo_part = sequelize.define('todo_part', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        todoId: DataTypes.INTEGER,
        partId: DataTypes.INTEGER
    }, {
        timestamps: false
    });
    todo_part.associate = function(models) {
    // associations can be defined here
    };
    return todo_part;
};
