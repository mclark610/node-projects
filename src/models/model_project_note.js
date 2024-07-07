'use strict';
module.exports = (sequelize, DataTypes) => {
    const project_note = sequelize.define('project_note', {
        project_id: DataTypes.INTEGER,
        note_id: DataTypes.INTEGER
    }, {
        timestamps: false
    });
    project_note.associate = function(models) {
    // associations can be defined here
    };
    return project_note;
};
