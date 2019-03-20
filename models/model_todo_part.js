'use strict';
module.exports = (sequelize, DataTypes) => {
  const todo_part = sequelize.define('todo_part', {
    todoId: DataTypes.INTEGER,
    partId: DataTypes.INTEGER
  }, {});
  todo_part.associate = function(models) {
    // associations can be defined here
  };
  return todo_part;
};