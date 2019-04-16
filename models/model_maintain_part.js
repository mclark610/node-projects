'use strict';
module.exports = (sequelize, DataTypes) => {
    const maintain_part = sequelize.define('maintain_part', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        maintainId: DataTypes.INTEGER,
        partId: DataTypes.INTEGER
    }, {
        timestamps: false
    });
    maintain_part.associate = function(models) {
    // associations can be defined here
    };
    return maintain_part;
};
