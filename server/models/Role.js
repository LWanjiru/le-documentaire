module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        message: 'this role already exists!',
        required: true,
      },
      primaryKey: true,
    },
    description: DataTypes.STRING,
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        // associations defined here
        Role.hasMany(models.User, {
          foreignKey: 'title',
          as: 'userRole',
        });
      },
    },
  });
  return Role;
};
