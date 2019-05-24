module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    description: DataTypes.STRING,
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        Role.hasMany(models.User, {
          foreignKey: 'title',
          as: 'user',
        });
      },
    },
  });
  return Role;
};
