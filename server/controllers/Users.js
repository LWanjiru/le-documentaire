const { Role, User } = require('../models');
const passwordHash = require('password-hash');

module.exports = {
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
            res.send({ message: 'This user already exists!' });
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

  list(req, res) {
    User.findAll()
    .then(role => res.status(200).send(role))
    .catch(error => res.status(400).send(error));
  },
  deleteAll(req, res) {
    if (process.env.NODE_ENV === 'test') {
      User.truncate({ cascade: true, restartIdentity: true }).then(() => res.status(204).send({}));
    } else {
      res.status(403).send({ message: 'That action is not allowed!' });
    }
  },
};
