const { Role, User } = require('../models');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const jwtBlacklist = require('jwt-blacklist')(jwt);
const config = require('../config/config');

module.exports = {
  // Login a user with 'username' and 'password'
  // Verify password matches stored hashPassword registered to that username
  // Sign token to user information
  // return user details, success message and token
  login(req, res) {
    User.findOne({
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
            const hashPassword = user.password;
            const passwordValue = passwordHash.verify(req.body.password, hashPassword);
            if (req.body.password !=='' && passwordValue) {
              const token = jwtBlacklist.sign({ id: user.id, username: user.username, email: user.email, title: user.title }, config.secret, { expiresIn: '1h' });
              const loginDetails = {
                id: user.id,
                username: user.username,
                email: user.email,
                title: user.title,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
              };
  
              res.send({
                loginDetails,
                message: 'Log in successful!',
                token,
              });
            } else if(req.body.password === '') {
              res.status(400).send({ message: 'password field cannot be empty.' });
            } else {
              res.status(400).send({ message: 'Wrong username/password.' });
            }
          } else if (!req.body.username || !req.body.password || req.body.username === '' || req.body.password === '') {
            res.status(400).send({ message: 'username/password fields cannot be empty.' });
          } else {
            res.status(404).send({ message: 'This user does not exist.' });
          } 
        })
      }
    });
  },

  // Check whether the default role exists, if not, send message to alert admin
  // else create a user with a username,first name, last name, email and password
  // Validate email and generate password hash
  // Return created user and message on success
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
                res.status(409).send({ message: 'This username is already in use! Please create a unique one.' });
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
                      res.status(409).send({ message: 'Email is registered to a different username.' });
                    } else if ((req.body.password).length < 6) {
                      res.status(422).send({ message: 'Password must be between 6 and 20 characters' });
                    } else if (expression.test(req.body.email)) {
                      User.create({
                        username: req.body.username,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: passwordHash.generate(req.body.password),
                      })
                        .then(res.status(201).send({ message: 'User created successfully!' }));
                    } else {
                      res.status(422).send({ message: 'Enter email using a valid format ie.[myemail@example.com]' });
                    }
                  });
              }
            });
        } else {
          res.status(500).send({ message: 'Cannot create user. Please contact Admin' });
        }
      });
  },

  // List all users
  // Return message if empty or list of users details if available
  listAll(req, res) {
    User.findAll({
      attributes: ['username', 'email', 'title', 'createdAt', 'updatedAt'],
    })
      .then((user) => {
        if (user.length === 0) {
          res.status(200).send({ message: 'Nothing to show.' });
        } else {
          res.status(200).send(user);
        }
      });
  },

  // Get one user by ID
  // Return message if not found or user details
  // if a user with the specified ID is found
  listOne(req, res) {
    User.findOne({ where: { id: req.params.id } })
      .then((user) => {
        if (!user) {
          res.status(404).send({ message: 'User not found!' });
        } else {
          const viewUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            title: user.title,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
          res.status(200).send(viewUser);
        }
      });
  },

  //  Fetch a user by ID and update username, email, or password field
  // Return message on successful update
  update(req, res) {
    User.findOne({ where: { id: req.params.id } })
      .then((user) => {
        if (user) {
          if (req.params.id !== req.decoded.id.toString()) {
            res.status(403).send({ message: 'That action is not allowed. You can only edit your own password.' });
          } else if (!req.body.password || req.body.password === '') {
            res.send({ message: 'Please enter your new password!' });
          } else {
            user.updateAttributes({
              username: req.body.username || user.username,
              email: req.body.email || user.email,
              password: passwordHash.generate(req.body.password) || user.passsword,
            }).then(() => {
              res.status(200).send({ message: 'Your profile has been updated!' });
            });
          }
        } else {
          res.status(404).send({ message: 'User doesn\'t exist!' });
        }
      });
  },

  // Delete all users
  deleteAll(req, res) {
    if (process.env.NODE_ENV === 'test') {
      User.truncate({ cascade: true, restartIdentity: true }).then(() => res.status(204).send({}));
    } else {
      res.status(401).send({ message: 'You do not have the required permissions.' });
    }
  },

  // Delete one user using ID
  // Admin cannot be deleted
  // return message on success
  deleteOne(req, res) {
    if (process.env.NODE_ENV === 'production') {
      res.status(403).send({ message: 'That action is not allowed!' });
    } else {
      User.findById(req.params.id)
        .then((user) => {
          if (!user || user.length < 1) {
            res.status(404).send({ message: 'User doesn\'t exist' });
          } else if (user.title === 'admin') {
            res.status(403).send({ message: 'Permission denied!' });
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
          res.status(401).send({ message: 'Failed to authenticate token. Please login in to verify account' });
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

  // Authorize admin privileges by ID
  admin(req, res, next) {
    const user = req.decoded;
    User.find({
      where: {
        id: user.id,
      },
    })
      .then((foundUser) => {
        if (foundUser) {
          if (foundUser.title === 'admin') {
            next();
          } else {
            res.status(403).send({ message: 'You do not have the required permissions.' });
          }
        } else {
          res.status(404).send({ message: 'User not found!' });
        }
      });
  },

  // Logout the user by blacklisting the current token
  // user has to login again to access protected parts of the application
  logout(req, res) {
    // Get the token from either the body, query or token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwtBlacklist.blacklist(token);
      res.status(205).send({message: "Successfully logged out!"}).end();
    }
  },

  // Search for a with their username or email
  // return user
  userSearch(req, res) {
    if (req.query.q) {
      User.findAndCountAll({
        where: {
          $or: [
            { username: { $like: `%${req.query.q}%` } },
            { email: { $like: `%${req.query.q}%` } },
          ],
        },
        limit: req.query.limit,
        offset: req.query.offset,
        attributes: ['username', 'email'],
        order: [['username', 'ASC']],
      })
        .then((user) => {
          if (!user || user.rows.length === 0) {
            res.status(404).send({ message: 'User not found!' });
          } else {
            res.status(200).send(user);
          }
        });
    }
  },

  paginateUsers(req, res) {
      User.findAndCountAll({
        limit: req.query.limit,
        offset: req.query.offset,
        attributes: ['id', 'username', 'title', 'createdAt'],
        order: [['id', 'ASC']],
      })
      .then((users) => {
        res.status(200).send(users);
      })
      .catch((err) => {
        res.status(400).send({message: 'Please use numerical values Only!'});
      });
  },
};
