module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        message: 'Username must be unique!',
        required: true,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        required: true,
        validate: {
          notNull: {
            msg: 'Password field cannot be null',
          },
          len: {
            args: [6, 20],
            msg: 'Password must be between 6 and 20 characters',
          },
          notEmpty: {
            msg: 'Password cannot be an empty string',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: {
            msg: 'Email must follow the format emailname@example.com',
          },
          len: {
            args: [8, 120],
            msg: 'Email address must be between 8 and 120 characters',
          },
          unique: true,
          required: true,
        },
      },
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        // associations defined here
        User.belongsTo(models.Role, {
          foreignKey: 'title',
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
