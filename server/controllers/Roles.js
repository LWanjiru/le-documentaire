const { Role } = require('../models');

function isNullNumberOrWhitespace(input) {
  return !input || !input.trim() || typeof input !== 'string' || Number(parseFloat(input));
}

module.exports = {
  // Check whether a role already exists and return message if it does
  // else create a new role with 'title' and 'description' attributes
  // Return created role and message on success.
  create(req, res) {
    if (isNullNumberOrWhitespace(req.body.title)
    || isNullNumberOrWhitespace(req.body.description)) {
      res.status(400).send({ message: 'Fields can not be empty or begin with a number' });
    } else if (req.body.title) {
      Role.findOne({
        where: {
          title: req.body.title.toLowerCase(),
        },
      })
        .then((role) => {
          if (role) {
            res.status(409).send({ message: 'Role already exists!' });
          } else {
            Role.create({
              title: req.body.title.toLowerCase(),
              description: req.body.description,
            })
              .then(() => res.status(201).send({ message: 'Role created successfully!' }));
          }
        });
    }
  },

  // List all roles
  // Return message if empty or a list of existing roles
  listAll(req, res) {
    Role.findAll()
      .then((role) => {
        if (role.length === 0) {
          res.status(200).send({ message: 'Nothing to show.' });
        } else {
          res.status(200).send(role);
        }
      });
  },

  // Find a specified role by TITLE
  // Return message if not found or the 'role' if it exists
  listOne(req, res) {
    Role.findOne({ where: { title: req.params.title } })
      .then((role) => {
        if (!role) {
          res.status(404).send({ message: 'Role not found!' });
        } else {
          res.status(200).send(role);
        }
      });
  },

  // Find a role by TITLE and Update the description
  // Return success message if updated
  update(req, res) {
    Role.findOne({ where: { title: req.params.title } })
      .then((role) => {
        if (role) {
          role.updateAttributes({
            description: req.body.description,
          }).then(() => {
            if (req.body.description === '') {
              res.status(400).send({ message: 'Please enter a description for the role!' });
            } else {
              res.status(200).send({ message: 'Role updated!' });
            }
          });
        } else {
          res.status(404).send({ message: 'Role doesn\'t exist!' });
        }
      });
  },

  // Delete all the roles from the Role table
  // Set only to work if the database in use is the 'test' database
  deleteAll(req, res) {
    if (process.env.NODE_ENV === 'test') {
      Role.truncate({ cascade: true, restartIdentity: true })
        .then(() => res.sendStatus(204));
    } else {
      res.status(403).send({ message: 'That action is not allowed!' });
    }
  },

  // Fetch role by TITLE and delete
  // Return success message on delete
  deleteOne(req, res) {
    if (process.env.NODE_ENV === 'production') {
      res.status(403).send({ message: 'That action is not allowed!' });
    } else {
      Role.findById(req.params.title)
        .then((role) => {
          if (!role) {
            res.status(404).send({ message: 'Role not found!' });
          } else if (req.params.title === 'admin' || req.params.title === 'regular') {
            res.status(403).send({ message: 'That action is not allowed!' });
          } else {
            Role.destroy({
              where: { title: req.params.title },
              cascade: true,
              restartIdentity: true,
            });
            res.send({ message: 'Role deleted successfully!' });
          }
        });
    }
  },
};
