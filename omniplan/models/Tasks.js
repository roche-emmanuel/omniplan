var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  user: String,
  title: String,
  state: {type: String, default: "opened"},
  description: String,
});

TaskSchema.methods.setState = function(state,cb) {
  this.state = state;
  this.save(cb);
};

mongoose.model('Task', TaskSchema);
