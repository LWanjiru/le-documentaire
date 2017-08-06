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
    userId: {
      type: DataTypes.INTEGER,
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
