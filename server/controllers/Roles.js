const { Role } = require('../models');

module.exports = {
  create(req, res) {
    Role.create(req.body)
    .then(role => res.status(201).send(role))
    .catch(error => res.status(400).send(error));
  },

  list(req, res) {
    Role.findAll()
    .then(role => res.status(200).send(role))
    .catch(error => res.status(400).send(error));
  },
};
