const { Document, User } = require('../models');

module.exports = {
  // Find existing authenticated user
  // Create a document by receiving 'title' and 'content' fields
  // populate 'userId' and 'userRole' with User table and token information
  // return created document
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
        const userRole = decoded.title;
        const userId = user.id;
        const owner = decoded.username;

        Document.create({
          title: req.body.title,
          content: req.body.content,
          access: req.body.access || 'private',
          owner,
          userId,
          userRole,
        })
        .then((document) => {
          res.send(document);
        });
      }
    });
  },

  // List all documents in the document table without any constraints
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

  // List all public documents
  // Fetch by access, and only return documents whose access is set to PUBLIC
  // If list is empty return message
  listPublic(req, res) {
    Document.findAndCountAll({
      where: {
        access: 'public',
      },
      limit: req.query.limit,
      offset: req.query.offset,
      order: [['id', 'ASC']],
    })
    .then((document) => {
      if (document.length === 0) {
        res.status(200).send({ message: 'No Public documents. Sign up to create one.' });
      } else {
        res.status(200).send(document);
      }
    });
  },

  // Fetch all a user's documents by ID
  // Return message if list is empty, and apaginated list if documents are found
  listUserDocs(req, res) {
    const user = req.decoded;

    Document.findAndCountAll({
      where: {
        userId: user.id,
      },
      limit: req.query.limit,
      offset: req.query.offset,
      order: [['id', 'ASC']],
    })
    .then((document) => {
      if (document.length === 0) {
        res.status(200).send({ message: 'You haven\'t created any documents yet.' });
      } else {
        res.status(200).send(document);
      }
    });
  },

  // Get one document using a specified ID
  // return the document only if it is public or belongs to logged in user
  listOneDoc(req, res) {
    const user = req.decoded;

    Document.findOne({ where: { id: req.params.id } })
    .then((document) => {
      if (!document) {
        res.status(404).send({ message: 'Document not found!' });
      } else if (document.access === 'public' || document.userId === user.id) {
        res.status(200).send(document);
      } else {
        res.send({ message: 'You do not have the permissions to view that document' });
      }
    });
  },

  // List documents by role
  // Use the 'access' and 'userRole' values of a logged in user
  // to view paginated documents allowed only to users with similar roles
  listDocsByRole(req, res) {
    const roleUser = req.decoded;

    Document.findAndCountAll({
      where: {
        access: 'role',
        userRole: roleUser.title,
      },
      limit: req.query.limit,
      offset: req.query.offset,
      order: [['id', 'ASC']],
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
      if (document.rows.length === 0) {
        res.send({ message: 'There are no documents from other users in this role yet.' });
      } else {
        res.send(document);
      }
    });
  },

  //  Fetch a Document by ID and update  title and description fields
  // Return message on successful update
  update(req, res) {
    if (!req.body.title || req.body.title === '' ||
        !req.body.content || req.body.content === '') {
      res.send({ message: 'Both fields are required' });
    } else {
      Document.findOne({ where: { id: req.params.id } })
      .then((document) => {
        if (!document) {
          res.send({ messsage: 'Document could not be found!' });
        } else if (document.userId !== req.decoded.id) {
          res.status(401).send({ message: 'You can only update documents you own!' });
        } else {
          document.updateAttributes({
            title: req.body.title || document.title,
            content: req.body.content || document.content,
          }).then(() => {
            res.status(200).send({ message: 'Your document was succefully updated!' });
          });
        }
      });
    }
  },

  // Find and Delete document by Id
  // as the admin or document owner
  deleteOne(req, res) {
    const user = req.decoded;

    Document.findById(req.params.id)
      .then((document) => {
        if (!document || document.length < 1) {
          res.status(404).send({ message: 'Document not found!' });
        } else if (user.title === 'admin' || document.userId === user.id) {
          Document.destroy({
            where: { id: req.params.id },
            cascade: true,
            restartIdentity: true,
          });
          res.send({ message: 'Document deleted!' });
        } else {
          res.status(401).send({ message: 'Cannot delete this document without owner\'s permission!' });
        }
      });
  },

  // List all public documents with pagination
  // Fetch by access, and only return documents whose access is set to PUBLIC
  // If list is empty return message
  paginateDocs(req, res) {
    Document.findAndCountAll({
      where: {
        access: 'public',
      },
      limit: req.query.limit,
      offset: req.query.offset,
      order: [['id', 'ASC']],
    })
    .then((document) => {
      if (document.rows.length === 0) {
        res.send({ message: 'There are no documents here yet. Create one.' });
      } else {
        res.status(200).send(document);
      }
    });
  },

   // Search for a document by TITLE
  // return paginated document results
  documentSearch(req, res) {
    if (req.query.q) {
      Document.findAndCountAll({
        attributes: ['id', 'title', 'content', 'access', 'owner', 'userRole', 'createdAt', 'updatedAt'],
        where: {
          $or: [
            { title: { $iLike: `%${req.query.q}%` } },
          ],
          access: 'public',
        },
        limit: req.query.limit,
        offset: req.query.offset,
        order: [['title', 'ASC']],
      })
      .then((document) => {
        if (!document || document.rows.length === 0) {
          res.send({ message: 'Document not found!' });
        } else {
          res.status(200).send(document);
        }
      });
    }
  },
};
