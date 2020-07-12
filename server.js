/* eslint-disable no-console */
const express = require('express');
const path = require('path');
// const bodyParser = require('body-parser');

const app = express();

app.use((req, res, next) => {
  const schema = req.headers['x-forwarded-proto'];

  if (schema === 'https') {
    req.connection.encrypted = true;
    return next();
  }

  // Return redirect if not https from nginx proxy
  return res.redirect(`https://${req.hostname}${req.url}`);
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', (req, res) => res.send('ok'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.all('*', (req, res) => {
  res.redirect('/');
});

const PORT = process.env.PORT || 8081;
app.listen(PORT);

console.log(`Node listening on port ${PORT}`);
