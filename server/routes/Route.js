const RoleController = require('../controllers/Roles');
const UserController = require('../controllers/Users');


require('./../../App');

module.exports = (app) => {
  app.post('/api/roles/add', RoleController.create);
  app.get('/api/roles', RoleController.listAll);
  app.get('/api/roles/:title', RoleController.listOne);
  app.put('/api/roles/:title', RoleController.update);
  app.delete('/api/roles', RoleController.deleteAll);
  app.delete('/api/roles/:title', RoleController.deleteOne);

  app.post('/users/login', UserController.login);
  app.post('/users/', UserController.create);
  app.get('/users', UserController.listAll);
  app.get('/users/:id', UserController.listOne);
  app.put('/users/:id', UserController.update);
  app.delete('/users', UserController.deleteAll);
  app.delete('/users/:id', UserController.deleteOne);
};
