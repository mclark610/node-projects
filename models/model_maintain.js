/*
 * maintain table is the main maintenance table.
 */
'use strict';
module.exports = (sequelize, DataTypes) => {
    let Maintain = sequelize.define('maintains', {
      id:  {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      name:   DataTypes.STRING(128),
      description: DataTypes.TEXT,
      part_nbr: DataTypes.STRING(48),
      status: {
          type: DataTypes.ENUM,
          values: ['active','inactive'],
          defaultValue: 'active'
      },
      complete: DataTypes.BOOLEAN
    });

    Maintain.associate = function(models) {
          // associations can be defined here
          models.maintain.hasMany(models.part);
          models.maintain.hasMany(models.todo);
          models.maintain.hasMany(models.note);
    };
    return maintain;
};
