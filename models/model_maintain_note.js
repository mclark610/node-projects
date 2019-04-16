'use strict';
module.exports = (sequelize, DataTypes) => {
    const maintain_note = sequelize.define('maintain_note', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        maintainId: DataTypes.INTEGER,
        noteId: DataTypes.INTEGER
    }, {
        timestamps: false
    });
    maintain_note.associate = function(models) {
    // associations can be defined here
    };
    return maintain_note;
};
