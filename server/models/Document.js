module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: {
      type: DataTypes.STRING,
      required: true,
    },
    content: {
      type: DataTypes.TEXT,
      required: true,
    },
    access: {
      type: DataTypes.ENUM,
      values: ['public', 'private', 'role'],
    },
    owner: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    userRole: {
      type: DataTypes.STRING,
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        Document.belongsTo(models.User, {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
        });
      },
    },
  });
  return Document;
};
