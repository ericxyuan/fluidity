import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('.validation/preview');
http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const filename = path.resolve(root, '.' + (url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname)));
  if (filename !== root && !filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  try {
    const data = await readFile(filename);
    const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.map': 'application/json' }[path.extname(filename)];
    res.writeHead(200, { 'content-type': mime ?? 'application/octet-stream' }).end(data);
  } catch { res.writeHead(404).end(); }
}).listen(4317, '127.0.0.1', () => console.log('Fluidity validation preview: http://127.0.0.1:4317'));
