/*
 * maintain_note table is the main maintenance table.
 */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('maintain_note', {
        maintain_id: DataTypes.INTEGER,
        note_id: DataTypes.INTEGER
    },
    {
        timestamps        : false,
        tableName         : 'maintain_note',
    }
);
}
