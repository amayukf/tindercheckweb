const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Handle API proxy requests
  if (req.url.startsWith('/api') || req.url.startsWith('/.netlify/functions/api')) {
    const query = new URL(req.url, `http://localhost:${PORT}`).searchParams;
    const username = query.get('username') || query.get('user');
    const targetUrl = `https://vvip.tinderfz.com/api.php?username=${encodeURIComponent(username)}`;

    try {
      const apiRes = await new Promise((resolve, reject) => {
        https.get(targetUrl, (resp) => {
          let responseData = '';
          resp.on('data', (chunk) => { responseData += chunk; });
          resp.on('end', () => {
            try {
              const apiData = JSON.parse(responseData);
              // Transform the API response
              const data = {
                alive: apiData.code === 200 && apiData.data ? true : false,
                accountOk: apiData.code === 200 && apiData.data ? true : false,
                name: apiData.data?.name || null,
                age: apiData.data?.age ? parseInt(apiData.data.age) : null,
                birthDate: apiData.data?.birthday || null,
                regtime: apiData.data?.create_time || null,
                photos: apiData.data?.photos || []
              };
              resolve(data);
            } catch (e) {
              resolve({ error: 'Invalid response format' });
            }
          });
        }).on('error', reject);
      });

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify(apiRes));
    } catch (err) {
      console.error('API Error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to fetch' }));
    }
    return;
  }

  // Serve static files
  let filePath = './public' + req.url;
  if (filePath === './public/') {
    filePath = './public/index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Open this URL in your browser: http://localhost:${PORT}/`);
});
