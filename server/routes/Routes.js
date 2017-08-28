const RoleController = require('../controllers/Roles');
const UserController = require('../controllers/Users');
const DocumentController = require('../controllers/Documents');


require('../App');

module.exports = (app) => {
  // Enable Cross-Origin Resource Sharing (CORS)
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  /**
   * ROLE routes
   * All require ADMIN credentials to access
   */
  // Add a role
  app.post('/roles/add', UserController.authenticate, UserController.admin, RoleController.create);

  // List, Delete ALL roles
  app.route('/roles')
  .get(UserController.authenticate, RoleController.listAll)
  .delete(UserController.authenticate, UserController.admin, RoleController.deleteAll);

  // View, Update, Delete ONE role by title
  app.route('/roles/:title')
  .get(UserController.authenticate, UserController.admin, RoleController.listOne)
  .put(UserController.authenticate, UserController.admin, RoleController.update)
  .delete(UserController.authenticate, UserController.admin, RoleController.deleteOne);

  /**
   * USER routes
   */
  // Login a user
  app.post('/users/login', UserController.login);

  // Sign up a new user
  app.post('/users/', UserController.create);

  // Logout user
  app.post('/users/logout', UserController.authenticate, UserController.logout);

  // Paginate and List all users
  app.route('/users/')
  .get(UserController.authenticate, UserController.paginateUsers)

   // Delete ALL users(Admin)
  .delete(UserController.authenticate, UserController.admin, UserController.deleteAll);

    // List All users without pagination
  app.get('/users/all', UserController.authenticate, UserController.listAll);

  // List, Update one user by ID
  app.route('/users/:id')
  .get(UserController.authenticate, UserController.listOne)
  .put(UserController.authenticate, UserController.update)

  // Delete a user (Admin)
  .delete(UserController.authenticate, UserController.admin, UserController.deleteOne);


  // Search for a user
  app.get('/search/users/', UserController.authenticate, UserController.userSearch);

 /**
  * DOCUMENT routes
  */
  // Create a document
  app.post('/documents', UserController.authenticate, DocumentController.create);

  // View ALL user documents regardless of access(Admin)
  app.get('/documents/all', UserController.authenticate, UserController.admin, DocumentController.listAll);

  // View All Public documents
  app.get('/documents/public', DocumentController.listPublic);

  // View all of a user's documents
  app.get('/users/:id/documents', UserController.authenticate, DocumentController.listUserDocs);

  // Get or Delete a document by ID
  app.route('/documents/:id')
  .get(UserController.authenticate, DocumentController.listOneDoc)
  .put(UserController.authenticate, DocumentController.update);


  // View all documents whose access is allowed to only users
  //  with the logged in user's role
  app.get('/documents/users/:role', UserController.authenticate, DocumentController.listDocsByRole);

  // View all documents beloging to a user in the same role as the logged in user
  // fetching by ID
  app.get('/documents/:id/users', UserController.authenticate, DocumentController.listRoleDocsByUserId);

  //  Delete a document by ID
  app.delete('/documents/:id', UserController.authenticate, DocumentController.deleteOne);

  // Paginate and List all documents
  app.get('/documents/', UserController.authenticate, DocumentController.paginateDocs);

  // Search for a document by TITLE
  app.get('/search/documents/', DocumentController.documentSearch);
};
