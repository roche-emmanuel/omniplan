var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
});

mongoose.model('Task', TaskSchema);
