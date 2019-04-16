/*
 * maintain_note table is the main maintenance table.
 */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('maintain_todo', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        maintain_id: DataTypes.INTEGER,
        todo_id: DataTypes.INTEGER
    },
    {
        timestamps        : false,
        tableName         : 'maintain_todo',
    });
};
