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
        models.maintains.belongsToMany(models.parts, {
            through: 'maintain_parts',
            foreignKey: 'maintainId',
            as: 'parts'
        });
        models.maintains.belongsToMany(models.notes, {
            through: 'maintain_notes',
            foreignKey: 'maintainId',
            as: 'notes'
        });
        
        models.maintains.hasMany(models.todos);

    };

    return Maintain;
};
