var mongoose = require('mongoose');

var NoteSchema = new mongoose.Schema({
  content: String,
  author: String,
  time: Number,
  id: Number,
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
});

var counter = mongoose.model('Counter');

NoteSchema.methods.assignID = function(next) {
	var note = this;
  
  counter.findByIdAndUpdate({_id: 'noteId'}, {$inc: { seq: 1} },
  	{upsert: true, new: true}, function(error, counter)   {
      if(error) {
        return next(error);
      }

      note.id = counter.seq;
      next(null,note);
  });
};


mongoose.model('Note', NoteSchema);
