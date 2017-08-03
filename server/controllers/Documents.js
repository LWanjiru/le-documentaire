const { Document, User } = require('../models');

module.exports = {
  create(req, res) {
    Document.create({
      title: req.body.title,
      content: req.body.content,
      userId: req.body.userId,
    })
    .then((document) => {
      res.send(document);
    });
  },
};
