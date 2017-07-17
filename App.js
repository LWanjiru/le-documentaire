const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Require routes into the application
require('./server/routes/Route')(app);

// A catch-all route for anything the webservice does not define.
app.get('*', (req, res) => res.status(404).send({
  message: 'Oops! Nothing to see here.',
}));

module.exports = app;
