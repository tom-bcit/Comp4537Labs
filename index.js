const http = require('http');
const url = require('url');
const lab3 = require('./lab3/partBC/server');

class Server {
  constructor(port) {
      this.port = port;
  }

  start() {
      const server = http.createServer((req, res) => {
          const parsedUrl = url.parse(req.url, true);
          const pathname = parsedUrl.pathname;
          const method = req.method;

          if (pathname.startsWith('/COMP4537/labs/3/')) {
            const newPathname = pathname.replace('/COMP4537/labs/3/', '/');
              new lab3.Lab3().start(req, res, newPathname);
          } else {
              res.writeHead(404, { 'Content-Type': 'text/html' });
              res.end('Not Found');
          }
      });

      server.listen(this.port, () => {
          console.log(`Server is running on port ${this.port}`);
      });
  }
}

const PORT = 8081;
const app = new Server(PORT);
app.start();