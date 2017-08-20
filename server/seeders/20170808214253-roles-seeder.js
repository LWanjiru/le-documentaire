

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Role', [
      {
        title: 'admin',
        description: 'They hold the power and can do everything',
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
      },
      {
        title: 'regular',
        description: 'This is the default user role. Can create, edit, view and delete own documents view others public and those authorized to this role',
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
      },


    ], {});
  },

  down(queryInterface) {
    return queryInterface.dropTable('Role');
  },
};
