var mongoose = require('mongoose');

var Article = mongoose.model('Article', {
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  body: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  createdAt: {
    type: Number
  }
});

var newArticle = new Article({
  title: 'Enjoy Coffee',
  body: 'Weekend at The Coffee House?',
  createdAt: new Date().getTime()
});

module.exports = {Article};
