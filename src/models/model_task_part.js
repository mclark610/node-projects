'use strict';
module.exports = (sequelize, DataTypes) => {
    const task_part = sequelize.define('task_part', {
        task_id: DataTypes.INTEGER,
        part_id: DataTypes.INTEGER
    }, {
        timestamps: false
    });
    task_part.associate = function(models) {
    // associations can be defined here
    };
    return task_part;
};
