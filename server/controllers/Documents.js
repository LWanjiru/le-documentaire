const { Document, User } = require('../models');

module.exports = {
  create(req, res) {
    const decoded = req.decoded;
    User.findOne({
      where: {
        username: decoded.username,
      },
    })
    .then((user) => {
      if (!req.body.title) {
        res.send({ message: 'Please enter a title for your document.' });
      } else if (!req.body.content || req.body.content === '') {
        res.send({ message: 'Document body cannot be empty.' });
      } else {
        const userId = user.id;
        Document.create({
          title: req.body.title,
          content: req.body.content,
          userId,
        })
        .then((document) => {
          res.send(document);
        });
      }
    });
  },

  // List all documents
  listAll(req, res) {
    Document.findAll()
    .then((document) => {
      if (document.length === 0) {
        res.status(200).send({ message: 'No documents created yet. Create one' });
      } else {
        res.status(200).send(document);
      }
    });
  },

  // docAuth(req, res) {
  //   Document.findAll()
  //   .then(document) {}
  // }
};
