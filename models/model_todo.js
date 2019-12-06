/*
 * todo table tracks all the todo information. Todo can be used by the maintenance table.
 */

module.exports = (sequelize, DataTypes) => {
    let ToDo = sequelize.define('todos', {
        id:  {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        maintainId: {
            type: DataTypes.INTEGER,
        },
        name:   DataTypes.STRING(128),
        description: DataTypes.TEXT,
        dueOnHour: {
            type: DataTypes.INTEGER,
            defaultValue: -1
        },
        dueOnDate: DataTypes.DATE,
        status: {
            type: DataTypes.ENUM,
            values: ['active','inactive'],
            defaultValue: 'active'
        },
        complete: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    {
        timestamps        : true,
        tableName         : 'todos',
    });

    ToDo.associate = function(models) {
        models.todos.hasOne(models.maintains, {
            through: 'maintains',
            foreignKey: 'id'
        });
        // associations can be defined here

        models.todos.belongsToMany(models.parts, {
            through: 'todo_part',
            foreignKey: 'todoId',
            as: 'parts'
        });
        models.todos.belongsToMany(models.notes, {
            through: 'todo_note',
            foreignKey: 'todoId',
            as: 'notes'
        });

    };

    return ToDo;
};
