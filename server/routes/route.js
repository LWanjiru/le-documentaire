const RoleController = require('../controllers/Roles');
require('../../app');

module.exports = (app) => {
  app.post('/api/roles', RoleController.create);
  app.get('/api/roles', RoleController.list);
};
