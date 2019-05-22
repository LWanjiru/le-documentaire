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
<<<<<<< HEAD
=======
      validate: {
        len: {
          args: [6, 20],
          msg: 'Password must be between 6 and 20 characters',
        },
        notEmpty: {
          msg: 'Password cannot be an empty string',
        },
      },
>>>>>>> [feature #148963113] configure Users.js,create end points and tests
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      required: true,
<<<<<<< HEAD
    },
    title: {
      type: DataTypes.STRING,
=======
      validate: {
        isEmail: {
          msg: 'Email must follow the format emailname@example.com',
        },
        len: {
          args: [8, 120],
          msg: 'Email address must be between 8 and 120 characters',
        },
      },
>>>>>>> [feature #148963113] configure Users.js,create end points and tests
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
