'use strict';

const encrypt = require('../modules/encrypt_data');

module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define('users', {
        id:  {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:   DataTypes.STRING(128),
        password: DataTypes.STRING(128),
        description: DataTypes.TEXT,
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {
        hooks: {
            beforeCreate: (user,options) => {
                user.password = encrypt.genHash(user.password);
            },
            beforeUpdate: (user,options) => {
                user.password = encrypt.genHash(user.password);
            },
        }
    });

    return User;
};
