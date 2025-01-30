const http = require('http');
const url = require('url');
const fs = require('fs');

const en = require('./lang/en/en');
const utils = require('./modules/utils');

class Lab3 {
  constructor(port) {
      this.port = port;
      this.fileHandler = new FileHandler();
      this.dateHandler = new DateHandler();
  }

  start(req, res, pathname) {
          const parsedUrl = url.parse(req.url, true);
          const method = req.method;

          if (pathname === '/getDate/' && method === 'GET') {
              this.handleGetDate(req, res, parsedUrl);
          } else if (pathname === '/writeFile/' && method === 'GET') {
              this.fileHandler.appendToFile(req, res);
          } else if (pathname.startsWith('/readFile/') && method === 'GET') {
              this.fileHandler.readFile(req, res, pathname);
          } else {
              res.writeHead(404, { 'Content-Type': 'text/html' });
              res.end(en.notFound);
          }
  }

  handleGetDate(req, res, parsedUrl) {
      const name = parsedUrl.query.name || 'Guest';
      const date = this.dateHandler.getDate();
      const message = en.greeting.replace('%1', name) + date;
      const styledMessage = `<p style="color:blue;">${message}</p>`;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(styledMessage);
  }
}

class FileHandler {
  appendToFile(req, res) {
      const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
      const text = parsedUrl.searchParams.get('text');

      if (!text) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end(en.missing);
          return;
      }

      fs.appendFile('./lab3/partBC/file.txt', text + '\n', (err) => {
          if (err) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end(en.errorWrite);
              return;
          }
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(en.successWrite);
      });
  }

  readFile(req, res, pathname) {
      const filename = pathname.replace('/readFile/', '');

      fs.readFile(`./lab3/partBC/${filename}`, 'utf8', (err, data) => {
          if (err) {
              res.writeHead(404, { 'Content-Type': 'text/html' });
              res.end(`${filename} ${en.notFound}`);
              return;
          }
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(data);
      });
  }
}

class DateHandler {
  getDate() {
    return utils.getDate();
  }
}

module.exports = { Lab3 };