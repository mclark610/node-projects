/*
 * maintain table is the main maintenance table.
 */

module.exports = (sequelize, DataTypes) => {
    let Note = sequelize.define('notes', {
        id:  {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:   DataTypes.STRING(128),
        description: DataTypes.TEXT,
        image_filename: DataTypes.STRING(255),
        doc_filename: DataTypes.STRING(255),
        status: {
            type: DataTypes.ENUM,
            values: ['active','inactive'],
            defaultValue: 'active'
        },
        complete: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

    Note.associate = function(models) {

        models.notes.belongsToMany(models.todos, {
            through: 'todo_note',
            foreignKey: 'noteId'
        });
        models.notes.belongsToMany(models.maintains, {
            through: 'todo_note',
            foreignKey: 'noteId'
        });

    };
    return Note;
};
