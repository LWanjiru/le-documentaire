// This script runs an HTTP server for the application.
const http = require('http');
const app = require('../server/App');

const port = +process.env.PORT || 8000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () =>
  console.log(`The server is listening on port ${port}`));
