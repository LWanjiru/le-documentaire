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
      type: DataTypes.STRING,
      required: true,
      default: 'public',
      enum: ['private', 'public', 'role'],
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        // associations defined here
        Document.belongsTo(models.User, {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
        });
      },
    },
  });
  return Document;
};
