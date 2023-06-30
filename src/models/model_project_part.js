'use strict';
module.exports = (sequelize, DataTypes) => {
    const project_part = sequelize.define('project_part', {
        project_id: DataTypes.INTEGER,
        part_id: DataTypes.INTEGER
    }, {
        timestamps: false
    });
    project_part.associate = function(models) {
    // associations can be defined here
    };
    return project_part;
};
