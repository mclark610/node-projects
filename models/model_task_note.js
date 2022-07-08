'use strict';
module.exports = (sequelize, DataTypes) => {
    const task_note = sequelize.define('task_note', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        task_id: DataTypes.INTEGER,
        note_id: DataTypes.INTEGER
    }, {
        timestamps: false

    });
    task_note.associate = function(models) {
    // associations can be defined here
    };
    return task_note;
};
