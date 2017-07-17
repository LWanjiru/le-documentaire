const { User } = require('../models');

module.exports = {
  create(req, res) {
    User.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      title: req.body.title || 'regular',
    })
    .then(user => res.status(201).send(user))
    .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    User.findAll()
    .then(role => res.status(200).send(role))
    .catch(error => res.status(400).send(error));
  },
};
