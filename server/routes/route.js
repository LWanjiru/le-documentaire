const RoleController = require('../controllers/Roles');
require('../../app');

module.exports = (app) => {
  app.post('/api/roles/add', RoleController.create);
  app.get('/api/roles', RoleController.list);
  app.delete('/api/roles', RoleController.deleteAll);
};
