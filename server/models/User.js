module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        message: 'Username must be unique!',
        required: true,
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      required: true,
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        // associations defined here
        User.belongsTo(models.Role, {
          as: 'title',
          onDelete: 'CASCADE',
        });
        User.hasMany(models.Document, {
          foreignKey: 'userId',
          as: 'documentOwner',
        });
      },
    },
  });
  return User;
};
