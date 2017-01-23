var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Article} = require('./models/article');
var {User} = require('./models/user');

var app = express();
var port = process.env.port || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Node Blog API')
});

app.get('/articles', (req, res) => {
  Article.find().then((articles) => {
    res.send({articles});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/articles', (req, res) => {
  var article = new Article({
    title: req.body.title,
    body: req.body.body
  });

  article.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});

module.exports = {app};
