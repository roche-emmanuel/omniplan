var mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  color: { type: String, default: "#ff0000"},
});

mongoose.model('Tag', TagSchema);
