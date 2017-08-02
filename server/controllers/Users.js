const { Role, User } = require('../models');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const config = require('../config/config');


module.exports = {
  // Login a user
  login(req, res) {
    User.findOne({
      where: {
        username: req.body.username,
      },
    })
    .then((user) => {
      const hashPassword = user.password;
      if (user) {
        const passwordValue = passwordHash.verify(req.body.password, hashPassword);
        if (passwordValue) {
          const token = jwt.sign({ username: user.username, email: user.email }, config.secret, { expiresIn: '1h' });
          res.send({
            message: 'Log in successful!',
            token,
          });
        } else {
          res.send('password does not match the username');
        }
      } else {
        res.send('user not found');
      }
    });
  },

  // Create a user
  create(req, res) {
    Role.findOne({
      where: {
        title: 'regular',
      },
    })
    .then((role) => {
      if (role) {
        User.findOne({
          where: {
            username: req.body.username,
          },
        })
        .then((user) => {
          if (user) {
            res.status(409).send({ message: 'This user already exists!' });
          } else if (
              !req.body.username || !req.body.firstName ||
              !req.body.lastName || !req.body.password || !req.body.email) {
            res.status(400).send({ message: 'All fields are required!' });
          } else if (user === null) {
            User.findOne({
              where: {
                email: req.body.email,
              },
            })
            .then((email) => {
              const expression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

              if (email) {
                res.send({ message: 'Email is registered to a different username.' });
              } else if ((req.body.password).length < 6) {
                res.send({ message: 'Password must be between 6 and 20 characters' });
              } else if (expression.test(req.body.email)) {
                User.create({
                  username: req.body.username,
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  email: req.body.email,
                  password: passwordHash.generate(req.body.password),
                })
            .then((newUser => res.status(201).send({ newUser, message: 'User created successfully!' })));
              } else {
                res.send({ message: 'Enter valid email format' });
              }
            });
          }
        });
      } else {
        res.send('Create regular role first');
      }
    });
  },

  listAll(req, res) {
    User.findAll()
    .then((user) => {
      if (user.length === 0) {
        res.status(200).send({ message: 'Nothing to show.' });
      } else {
        res.status(200).send(user);
      }
    });
  },
  listOne(req, res) {
    User.findOne({ where: { id: req.params.id } })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User not found!' });
      } else {
        res.status(200).send(user);
      }
    });
  },

  update(req, res) {
    User.findOne({ where: { id: req.params.id } })
    .then((user) => {
      if (user) {
        user.updateAttributes({
          username: req.body.username,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: passwordHash.generate(req.body.password),
        }).then(() => {
          if (!req.body.username || !req.body.firstName ||
              !req.body.lastName || !req.body.password || !req.body.email) {
            res.send({ message: 'All fields required!' });
          } else {
            res.status(200).send({ message: 'User updated!' });
          }
        });
      } else {
        res.send('User doesn\'t exist!');
      }
    });
  },

  deleteAll(req, res) {
    if (process.env.NODE_ENV === 'test') {
      User.truncate({ cascade: true, restartIdentity: true }).then(() => res.status(204).send({}));
    } else {
      res.status(403).send({ message: 'That action is not allowed!' });
    }
  },

  // Delete one role
  deleteOne(req, res) {
    if (process.env.NODE_ENV === 'production') {
      res.status(403).send({ message: 'That action is not allowed!' });
    } else {
      User.findById(req.params.id)
        .then((user) => {
          if (!user) {
            res.send({ message: 'User doesn\'t exist' });
          } else {
            User.destroy({
              where: { id: req.params.id },
              cascade: true,
              restartIdentity: true,
            });
            res.send({ message: 'User deleted!' });
          }
        });
    }
  },
};
