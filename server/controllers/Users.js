const { Role, User } = require('../models');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const jwtBlacklist = require('jwt-blacklist')(jwt);
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
      if (user) {
        const hashPassword = user.password;
        const passwordValue = passwordHash.verify(req.body.password, hashPassword);
        if (passwordValue) {
          const token = jwtBlacklist.sign({ id: user.id, username: user.username, email: user.email }, config.secret, { expiresIn: '1h' });
          res.send({
            user,
            message: 'Log in successful!',
            token,
          });
        } else {
          res.send({ message: 'password does not match the username' });
        }
      } else if (!req.body.username || !req.body.password) {
        res.send({ message: 'username/password fields cannot be empty' });
      } else {
        res.send({ message: 'This user account does not exist. Create one' });
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
                res.send({ message: 'Enter email using a valid format ie.[myemail@example.com]' });
              }
            });
          }
        });
      } else {
        res.send({ message: 'Cannot create user. Please contact Admin' });
      }
    });
  },

  // List all users
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

  // Get one user
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

  //  Update a user's password
  update(req, res) {
    User.findOne({ where: { id: req.params.id } })
    .then((user) => {
      if (user) {
        user.updateAttributes({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          title: user.title,
          password: passwordHash.generate(req.body.password),
        }).then(() => {
          if (!req.body.password) {
            res.send({ message: 'Please enter your new password!' });
          } else {
            res.status(200).send({ message: 'User password has been changed!' });
          }
        });
      } else {
        res.status(404).send('User doesn\'t exist!');
      }
    });
  },

  // Delete all users
  deleteAll(req, res) {
    if (process.env.NODE_ENV === 'test') {
      User.truncate({ cascade: true, restartIdentity: true }).then(() => res.status(204).send({}));
    } else {
      res.status(403).send({ message: 'That action is not allowed!' });
    }
  },

  // Delete one user
  deleteOne(req, res) {
    if (process.env.NODE_ENV === 'production') {
      res.status(403).send({ message: 'That action is not allowed!' });
    } else {
      User.findById(req.params.id)
        .then((user) => {
          if (!user || user.length < 1) {
            res.status(404).send({ message: 'User doesn\'t exist' });
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

  // Verify user login using jwt token
  authenticate(req, res, next) {
    // Get the token from either the body, query or token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          res.send({ message: 'Failed to authenticate token. Please login in to verify account' });
        } else {
          // Store token information in a request object for use in other requests
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.status(403).send({ message: 'You must be logged in to view the page you requested' });
    }
  },

  // Authorize admin
  admin(req, res, next) {
    const user = req.decoded;
    User.find({
      where: {
        username: user.username,
      },
    })
    .then((foundUser) => {
      if (foundUser.title === 'admin') {
        next();
      } else {
        res.send({ Message: 'You must be signed in as an admin to access this page!' });
      }
    });
  },

  logout(req, res) {
    // Get the token from either the body, query or token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    jwtBlacklist.blacklist(token);
    res.status(302).redirect('/');
  },
};
