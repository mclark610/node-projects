'use strict';
module.exports = (sequelize, DataTypes) => {
    const maintain_part = sequelize.define('maintain_part', {
        maintainId: DataTypes.INTEGER,
        partId: DataTypes.INTEGER
    }, {});
    maintain_part.associate = function(models) {
    // associations can be defined here
    };
    return maintain_part;
};
