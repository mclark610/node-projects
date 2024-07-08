module.exports = (sequelize, DataTypes) => {
    let Note = sequelize.define('notes', {
        id:  {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:   DataTypes.STRING(128),
        description: DataTypes.TEXT,
        filename: DataTypes.STRING(255),
        mimetype: DataTypes.STRING(128),
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        complete: DataTypes.INTEGER,
    },
    {
        timestamps        : true
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
