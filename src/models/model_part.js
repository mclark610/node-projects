/*
 * part table tracks all the parts information. Part can be used by the maintenance table.
 */

const Project = require('./model_project');

module.exports = (sequelize, DataTypes) => {
    let Part = sequelize.define('parts', {
        id:  {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:   DataTypes.STRING(128),
        part_nbr: DataTypes.STRING(48),
        price: DataTypes.DECIMAL(8,2),
        description: DataTypes.TEXT,
        vendor: DataTypes.STRING(255),
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
        tableName         : 'parts'
    });

    Part.associate = function(models) {
        models.parts.belongsToMany(models.tasks, {
            through: 'task_part',
            as: 'tasks', // Alias when accessing through the part
            foreignKey: 'part_id',
            otherKey: 'task_id'
        });
        models.parts.hasOne(models.projects, {
            foreignKey: 'part_id',
            as: 'project'
        })
    };

    return Part;
};
