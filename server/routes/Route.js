const RoleController = require('../controllers/Roles');
const UserController = require('../controllers/Users');


require('./../../App');

module.exports = (app) => {
  app.post('/api/roles/add', RoleController.create);
  app.get('/api/roles', RoleController.listAll);
  app.get('/api/roles/:title', RoleController.listOne);
  app.put('/api/roles', RoleController.update);
  app.delete('/api/roles', RoleController.deleteAll);
  app.delete('/api/roles/:title', RoleController.deleteOne);

  app.post('/users', UserController.create);
  app.get('/users', UserController.list);
  app.delete('/users', UserController.deleteAll);
};
