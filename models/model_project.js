/*
 * project table is the main project table.
 */
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
        models.projects.hasMany(models.tasks);
        models.projects.hasMany(models.notes);
        models.projects.hasMany(models.parts);
    };

    return Project;
};
