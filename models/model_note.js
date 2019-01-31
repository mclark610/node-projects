/*
 * maintain table is the main maintenance table.
 */

module.exports = (sequelize, DataTypes) => {
    let Note = sequelize.define('note', {
      id:  {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      maintain_id: {
          type: DataTypes.INTEGER,
          onDelete: "CASCADE",
          allowNull: false,
          references: {
            model: 'maintains',
            key: 'id'
          }
      },
      name:   DataTypes.STRING(128),
      description: DataTypes.TEXT,
      image_filename: DataTypes.STRING(255),
      doc_filename: DataTypes.STRING(255),
      status: {
          type: DataTypes.ENUM,
          values: ['active','inactive'],
          defaultValue: 'active'
      },
      complete: DataTypes.BOOLEAN
    });

    Note.associate = function(models) {
        models.Note.belongsTo(models.maintain, {
              onDelete: "CASCADE",
              foreignKey: {
                allowNull: false
              }
        });
    };
    return Note;
}
