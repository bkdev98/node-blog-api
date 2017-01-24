var mongoose = require('mongoose');

var Category = mongoose.model('Category', {
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 1
  },
  createdAt: {
    type: Number
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Category};
