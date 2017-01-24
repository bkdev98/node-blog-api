require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Article} = require('./models/article');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Node Blog API')
});

app.get('/articles', authenticate, (req, res) => {
  Article.find({
    _creator: req.user._id
  }).then((articles) => {
    res.send({articles});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/articles', authenticate, (req, res) => {
  var article = new Article({
    title: req.body.title,
    body: req.body.body,
    _creator: req.user._id
  });

  article.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/articles/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  };

  Article.findOne({
    _id: id,
    _creator: req.user._id
  }).then((article) => {
    if (!article) {
      return res.status(404).send();
    };

    res.send({article});
  }).catch((e) => {
    return res.status(400).send();
  });
});

app.delete('/articles/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  };

  Article.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((article) => {
    if (!article) {
      return res.status(404).send();
    };

    res.send({article});
  }).catch((e) => res.status(400).send());
});

app.patch('/articles/:id', authenticate,(req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['title', 'body']);
  body.createdAt = new Date().getTime();

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Article.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((article) => {
    if (!article) {
      return res.status(404).send();
    }

    res.send({article});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.get('/users', (req, res) => {
  User.find().then((users) => {
    res.send({users});
  }).catch((e) => res.status(400).send(e));
});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  body.createdAt = new Date().getTime();
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started up on port ${port}.`);
});

module.exports = {app};
