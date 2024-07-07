/*
 * project table is the main project table.
 */
const Part = require( './model_part');


module.exports = (sequelize, DataTypes) => {
    let Project = sequelize.define('projects', {
        id:  {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        part_id: {
            type: DataTypes.INTEGER,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        complete: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE

    });

    Project.associate = function(models) {

        models.projects.hasOne(models.parts,{
            allowNull: true,
            foreignKey: 'id',
            as: 'parts'
        })

        models.projects.belongsToMany(models.tasks, {
            through: 'project_task',
            foreignKey: 'project_id'
        });

        models.projects.belongsToMany(models.notes, {
            through: 'project_note',
            foreignKey: 'project_id'
        });

    };

    return Project;
};
