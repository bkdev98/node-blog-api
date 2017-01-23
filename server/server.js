var express = require('express');
var bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Article} = require('./models/article');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

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

app.get('/articles/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  };

  Article.findById(id).then((article) => {
    if (!article) {
      return res.status(404).send();
    };

    res.send({article});
  }).catch((e) => {
    return res.status(400).send();
  });
});

app.delete('/articles/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  };

  Article.findByIdAndRemove(id).then((article) => {
    res.send(article);
  }).catch((e) => res.status(400).send());
});

app.listen(port, () => {
  console.log(`Started up on port ${port}.`);
});

module.exports = {app};
