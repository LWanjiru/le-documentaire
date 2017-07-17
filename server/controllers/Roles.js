const { Role } = require('../models');

module.exports = {
  create(req, res) {
    Role.create(req.body)
    .then(role => res.status(201).send(role))
    .catch(error => res.status(400).send(error));
  },

  list(req, res) {
    Role.findAll({ attributes: ['title', 'description'], order: ['title'] })
    .then(role => res.status(200).send(role))
    .catch(error => res.status(400).send(error));
  },
  deleteAll(req, res) {
    if (process.env.NODE_ENV === 'test') {
      Role.truncate({ cascade: true, restartIdentity: true }).then(() => res.status(204).send({}));
    } else {
      res.status(403).send({ message: 'That action is not allowed!' });
    }
  },
};
