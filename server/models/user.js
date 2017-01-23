var mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Number
  }
})

var newUser = new User({
  email: 'contact@bkdev.me',
  password: 'sunghokage',
  createdAt: new Date().getTime()
});

module.exports = {User};
