/*
 * project_note table is the main maintenance table.
 */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('project_todo', {
        project_id: DataTypes.INTEGER,
        todo_id: DataTypes.INTEGER
    },
    {
        timestamps        : false,
        tableName         : 'project_todo',
    });
};
