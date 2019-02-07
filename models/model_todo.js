/*
 * part table tracks all the parts information. Part can be used by the maintenance table.
 */

module.exports = (sequelize, DataTypes) => {
    let ToDo = sequelize.define('todos', {
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
        tableName         : 'parts',
    });

    ToDo.associate = function(models) {
        models.todos.belongsTo(models.maintains, {
              onDelete: "CASCADE",
              foreignKey: {
                allowNull: false
              }
        });
    };
    return ToDo;
}
