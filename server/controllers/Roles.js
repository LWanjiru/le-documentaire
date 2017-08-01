const { Role } = require('../models');

module.exports = {
  // Create a new role
  create(req, res) {
    Role.findOne({ where: { title: req.body.title.toLowerCase() } })
    .then((role) => {
      if (role) {
        res.status(409).send({ message: 'Role already exists!' });
      } else if (!req.body.title || !req.body.description) {
        res.status(400).send({ message: 'All fields are required!' });
      } else {
        Role.create({
          title: req.body.title.toLowerCase(),
          description: req.body.description,
        })
        .then((newRole => res.status(201).send({ newRole, message: 'Role created successfully!' })));
      }
    });
  },

  // List all roles
  listAll(req, res) {
    Role.findAll()
    .then((role) => {
      if (role.length === 0) {
        res.status(204).send({ message: 'Nothing to show.' });
      } else {
        res.status(200).send(role);
      }
    });
  },

  // Find a specified role
  listOne(req, res) {
    Role.findById(req.params.title)
    .then((role) => {
      if (!role) {
        res.status(404).send({ message: 'Role not found!' });
      } else {
        res.send(200, role);
      }
    });
  },

  // Update and make changes to an existing role
  update(req, res) {
    if (!req.body.title || !req.body.description) {
      res.status(400).send({ message: 'All fields are required!' });
    } else {
      Role.find({
        where: {
          title: req.body.title.toLowerCase(),
        },
      })
      .then((role) => {
        if (role) {
          role.updateAttributes({
            title: req.body.title.toLowerCase(),
            description: req.body.description,
          }).then(() => {
            res.send(role);
          });
        } else {
          res.status(404)
          .send({ message: 'Role does not exist!' });
        }
      });
    }
  },

  // Delete all the roles from the Role table
  // Set only to work if the database in use is the 'test' database
  deleteAll(req, res) {
    if (process.env.NODE_ENV === 'test') {
      Role.truncate({ cascade: true, restartIdentity: true }).then(() => res.status(204).send({}));
    } else {
      res.status(403).send({ message: 'That action is not allowed!' });
    }
  },

  // Delete one role
  deleteOne(req, res) {
    if (process.env.NODE_ENV === 'production') {
      res.status(403).send({ message: 'That action is not allowed!' });
    } else {
      Role.findById(req.params.title)
        .then((role) => {
          if (!role) {
            res.send({ message: 'Role doesn\'t exist' });
          } else {
            Role.destroy({
              where: { title: req.params.title },
              cascade: true,
              restartIdentity: true,
            });
            res.send({ message: 'Role deleted!' });
          }
        });
    }
  },
};

