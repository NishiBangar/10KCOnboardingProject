const app = require('./backend/app');
const debug = require('debug')('node-angular');
const http = require('http');


let port = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
