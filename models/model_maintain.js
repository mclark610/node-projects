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
      complete: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE

    });

    Maintain.associate = function(models) {
          // associations can be defined here
          models.maintains.hasMany(models.parts);
          models.maintains.hasMany(models.todos);
          models.maintains.hasMany(models.notes);
    };
    return Maintain;
};
