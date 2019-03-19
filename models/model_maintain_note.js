'use strict';
module.exports = (sequelize, DataTypes) => {
  const maintain_note = sequelize.define('maintain_note', {
    maintainId: DataTypes.INTEGER,
    noteId: DataTypes.INTEGER
  }, {});
  maintain_note.associate = function(models) {
    // associations can be defined here
  };
  return maintain_note;
};