const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..'); // Serve from repo root
const M = {
  'html': 'text/html;charset=utf-8',
  'css': 'text/css',
  'js': 'application/javascript',
  'json': 'application/json',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'ico': 'image/x-icon',
  'webmanifest': 'application/manifest+json'
};

http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  // If requesting /PayBack/ or /PayBack, serve index.html
  if (url === '/PayBack/' || url === '/PayBack') url = '/PayBack/index.html';
  else if (url === '/') url = '/index.html';
  
  const f = path.join(ROOT, url);
  try {
    const c = fs.readFileSync(f);
    const ext = path.extname(f).slice(1).toLowerCase();
    const type = M[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*' });
    res.end(c);
  } catch (e) {
    res.writeHead(404);
    res.end('Not Found: ' + url);
  }
}).listen(3000, () => {
  console.log('PayBack läuft auf:');
  console.log('  http://localhost:3000/PayBack/');
  console.log('  https://hydr0fx.github.io/flippy-bird/PayBack/ (nach Deploy)');
});
