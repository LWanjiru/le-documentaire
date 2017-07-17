const RoleController = require('../controllers/Roles');
const UserController = require('../controllers/Users');


require('./../../app');

module.exports = (app) => {
  app.post('/api/roles', RoleController.create);
  app.get('/api/roles', RoleController.list);
  app.delete('/api/roles', RoleController.deleteAll);

  app.post('/users/', UserController.create);
  app.get('/users/', UserController.list);
  app.delete('/users/', UserController.deleteAll);
};
