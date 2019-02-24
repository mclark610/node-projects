/*
 * user table is the main user table to check if user is allowed
 * onto site and to login first.
 */
 
'use strict';
module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define('users', {
        id:  {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:   DataTypes.STRING(128),
        password: DataTypes.STRING(16),
        description: DataTypes.TEXT,
        status: {
            type: DataTypes.ENUM,
            values: ['active','inactive'],
            defaultValue: 'active'
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE

    });
    return User;
};
