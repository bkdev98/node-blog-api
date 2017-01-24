const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Article} = require('./../../models/article');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const articles = [{
  _id: new ObjectID(),
  title: 'Occaecat consectetur minim labore ullamco quis reprehenderit excepteur officia.',
  body: 'Sit aute velit exercitation magna voluptate incididunt aliqua aute nostrud id ad ut ex sint labore labore duis. Est labore fugiat magna labore veniam fugiat anim tempor ex eiusmod aliquip amet adipisicing esse enim dolor aute. Sunt dolor pariatur reprehenderit enim dolore aliqua id nostrud id velit sit consectetur.',
  createdAt: new Date().getTime(),
  _creator: userOneId
}, {
  _id: new ObjectID(),
  title: 'Enim eiusmod veniam amet dolore cupidatat id deserunt amet id in nostrud cupidatat cillum sunt deserunt.',
  body: 'Ut cupidatat dolore ea mollit reprehenderit commodo incididunt nostrud pariatur. Proident qui mollit ad pariatur et dolor veniam tempor est magna do ipsum. Esse est ad do consectetur do exercitation adipisicing excepteur laboris non voluptate commodo magna anim.',
  createdAt: new Date().getTime(),
  _creator: userTwoId
}];

const users = [{
  _id: userOneId,
  email: 'contact@bkdev.me',
  password: 'sunghokage',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'sunghokage').toString()
  }]
}, {
  _id: userTwoId,
  email: 'usertwo@bkdev.me',
  password: '123abc',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, 'sunghokage').toString()
  }]
}];

const populateArticles = (done) => {
  Article.remove({}).then(() => {
    return Article.insertMany(articles);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {articles, populateArticles, users, populateUsers};
