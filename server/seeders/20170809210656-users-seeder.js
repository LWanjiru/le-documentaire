const passwordHash = require('password-hash');

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('User', [
      {
        username: 'admin',
        firstName: 'ray',
        lastName: 'ciru',
        email: 'admin@ledocumentaire.com',
        password: passwordHash.generate('administrator'),
        title: 'admin',
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
      },

      {
        username: 'musketeer',
        firstName: 'Bob',
        lastName: 'Dylan',
        email: 'bobby@example.com',
        password: passwordHash.generate('soledad123'),
        title: 'regular',
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
      },
    ], {});
  },

  down(queryInterface) {
    return queryInterface.dropTable('User');
  },
};
