const { Role } = require('../models');

module.exports = {
  // Check whether a role already exists and return message if it does
  // else create a new role with 'title' and 'description' attributes
  // Return created role and message on success.
  create(req, res) {
    if (!req.body.title || !req.body.description) {
      res.status(400).send({ message: 'All fields are required!' });
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
          .then((newRole => res.status(201).send({ newRole, message: 'Role created successfully!' })));
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
          if (!req.body.description) {
            res.send({ message: 'All fields required!' });
          } else {
            res.status(200).send({ message: 'Role updated!' });
          }
        });
      } else {
        res.send('Role doesn\'t exist!');
      }
    });
  },

  // Delete all the roles from the Role table
  // Set only to work if the database in use is the 'test' database
  deleteAll(req, res) {
    if (process.env.NODE_ENV === 'test') {
      Role.truncate({ cascade: true, restartIdentity: true }).then(() => res.status(204));
    } else {
      res.status(403).send({ message: 'That action is not allowed!' });
    }
  },

<<<<<<< HEAD
  // Fetch role by TITLE and delete
  // Return success message on delete
  deleteOne(req, res) {
    if (process.env.NODE_ENV === 'production') {
      res.status(403).send({ message: 'That action is not allowed!' });
    } else {
      Role.findById(req.params.title)
        .then((role) => {
          if (!role) {
            res.send({ message: 'Role doesn\'t exist' });
          } else if (req.params.title === 'admin' || req.params.title === 'regular') {
            res.status(403).send({ message: 'That action is not allowed!' });
          } else {
            Role.destroy({
              where: { title: req.params.title },
              cascade: true,
              restartIdentity: true,
            });
            res.send({ message: 'Role deleted successfully' });
          }
        });
    }
=======
  list(req, res) {
    Role.findAll()
    .then(role => res.status(200).send(role))
    .catch(error => res.status(400).send(error));
>>>>>>> [feature #148963113] remove cached coverage folder, add tests, controller methods and routes, fix travis for testing
  },
  deleteAll(req, res) {
    if (process.env.NODE_ENV === 'test') {
      Role.truncate({ cascade: true, restartIdentity: true }).then(() => res.status(204).send({}));
    } else {
      res.status(403).send({ message: 'That action is not allowed!' });
    }
  },
};

