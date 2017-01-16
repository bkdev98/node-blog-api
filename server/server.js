var express = require('express');
var app = express();
var port = process.env.port || 3000;

app.get('/', (req, res) => {
  res.send('Node Blog API')
});

app.get('/articles', (req, res) => {
  res.send('Articles')
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
