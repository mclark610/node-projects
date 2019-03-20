/*
 * maintain_note table is the main maintenance table.
 */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('maintain_todo', {
        maintain_id: DataTypes.INTEGER,
        todo_id: DataTypes.INTEGER
    },
    {
        timestamps        : false,
        tableName         : 'maintain_todo',
    });
};
