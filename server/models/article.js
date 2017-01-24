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

module.exports = {Article};
