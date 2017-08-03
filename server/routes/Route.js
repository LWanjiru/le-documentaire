const RoleController = require('../controllers/Roles');
const UserController = require('../controllers/Users');
const DocumentController = require('../controllers/Documents');


require('./../../App');

module.exports = (app) => {
  // Add roles
  app.post('/roles/add', UserController.authenticate, UserController.admin, RoleController.create);

  // List, Delete ALL roles
  app.route('/roles')
  .get(UserController.authenticate, UserController.admin, RoleController.listAll)
  .delete(UserController.authenticate, UserController.admin, RoleController.deleteAll);

  // View, Update, Delete ONE role
  app.route('/roles/:title')
  .get(UserController.authenticate, UserController.admin, RoleController.listOne)
  .put(UserController.authenticate, UserController.admin, RoleController.update)
  .delete(UserController.authenticate, UserController.admin, RoleController.deleteOne);

  // Login a user
  app.post('/', UserController.login);
  app.post('/users/login', UserController.login);

  // Sign up a new user
  app.post('/users/', UserController.create);

    // List, Delete ALL users
  app.route('/users')
  .get(UserController.authenticate, UserController.listAll)
  .delete(UserController.authenticate, UserController.admin, UserController.deleteAll);

  // List, Update, Delete one user
  app.route('/users/:id')
  .get(UserController.authenticate, UserController.listOne)
  .put(UserController.authenticate, UserController.update)
  .delete(UserController.authenticate, UserController.admin, UserController.deleteOne);

  app.post('/documents', DocumentController.create);
};
