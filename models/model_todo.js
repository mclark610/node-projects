/*
 * task table tracks all the task information. Task can be used by the maintenance table.
 */

module.exports = (sequelize, DataTypes) => {
    let Task = sequelize.define('tasks', {
        id:  {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:   DataTypes.STRING(128),
        description: DataTypes.TEXT,
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        complete: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    {
        timestamps        : true,
        tableName         : 'tasks',
    });

    Task.associate = function(models) {

        models.tasks.belongsToMany(models.parts, {
            through: 'task_part',
            foreignKey: 'task_id',
            as: 'parts'
        });
        models.tasks.belongsToMany(models.notes, {
            through: 'task_note',
            foreignKey: 'task_id',
            as: 'notes'
        });

    };

    return Task;
};
