/*
 * maintain_note table is the main maintenance table.
 */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('maintain_part', {
        maintain_id: DataTypes.INTEGER,
        part_id: DataTypes.INTEGER
    },
    {
        timestamps        : false,
        tableName         : 'maintain_part',
    }
);
}
