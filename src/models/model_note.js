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
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        complete: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

    Note.associate = function(models) {

        models.notes.belongsToMany(models.tasks, {
            through: 'task_note',
            foreignKey: 'note_id'
        });
        models.notes.belongsToMany(models.projects, {
            through: 'project_note',
            foreignKey: 'note_id'
        });
    };
    return Note;
};
