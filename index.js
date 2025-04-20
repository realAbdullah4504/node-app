const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy FULL frontend page from backend
app.use('/proxied-page', createProxyMiddleware({
  target: 'http://localhost',
  changeOrigin: true,
  pathRewrite: { '^/proxied-page': '/' },
}));

app.use('/api/hello', createProxyMiddleware({
  target: 'http://localhost',
  changeOrigin: true,
  pathRewrite: { '^/api/hello': '/api/hello' },
}));


// Optionally also render your own EJS frontend
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log('🚀 Proxy Server running on http://localhost:3000');
});
