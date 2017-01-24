const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Article} = require('./../../models/article');
const {User} = require('./../../models/user');
const {Category} = require('./../../models/category');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const categoryOneId = new ObjectID();
const categoryTwoId = new ObjectID();

const articles = [{
  _id: new ObjectID(),
  title: 'Occaecat consectetur minim labore ullamco quis reprehenderit excepteur officia.',
  body: 'Sit aute velit exercitation magna voluptate incididunt aliqua aute nostrud id ad ut ex sint labore labore duis. Est labore fugiat magna labore veniam fugiat anim tempor ex eiusmod aliquip amet adipisicing esse enim dolor aute. Sunt dolor pariatur reprehenderit enim dolore aliqua id nostrud id velit sit consectetur.',
  createdAt: new Date().getTime(),
  _category: categoryOneId,
  _creator: userOneId
}, {
  _id: new ObjectID(),
  title: 'Enim eiusmod veniam amet dolore cupidatat id deserunt amet id in nostrud cupidatat cillum sunt deserunt.',
  body: 'Ut cupidatat dolore ea mollit reprehenderit commodo incididunt nostrud pariatur. Proident qui mollit ad pariatur et dolor veniam tempor est magna do ipsum. Esse est ad do consectetur do exercitation adipisicing excepteur laboris non voluptate commodo magna anim.',
  createdAt: new Date().getTime(),
  _category: categoryTwoId,
  _creator: userTwoId
}];

const users = [{
  _id: userOneId,
  email: 'contact@bkdev.me',
  password: 'sunghokage',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'usertwo@bkdev.me',
  password: '123abc',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const categories = [{
  _id: categoryOneId,
  name: "Freelance",
  _creator: userOneId
}, {
  _id: categoryTwoId,
  name: "Web Development",
  _creator: userTwoId
}];

const populateArticles = (done) => {
  Article.remove({}).then(() => {
    return Article.insertMany(articles);
  }).then(() => done());
};

const populateCategories = (done) => {
  Category.remove({}).then(() => {
    return Category.insertMany(categories);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {articles, populateArticles, users, populateUsers, categories, populateCategories};
