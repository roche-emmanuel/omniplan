var mongoose = require('mongoose');

var TaskSessionSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  startTime: Date,
  stopTime: Date,
  multiplier: {type: Number, default: 1.0},
});

mongoose.model('TaskSession', TaskSessionSchema);

var TaskSession = mongoose.model('TaskSession');

var TaskSchema = new mongoose.Schema({
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  user: String,
  title: String,
  state: {type: String, default: "opened"},
  description: String,
  running: {type: Boolean, default: false},
  startTime: Date,
  multipler: {type: Number, default: 1},
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaskSession' }],
});

TaskSchema.methods.setState = function(state,cb) {
  this.state = state;
  this.save(cb);
};

// Method used to start working on a task:
TaskSchema.methods.startTimer = function(mult,cb) {
	if(this.running) {
		return; // nothing to change.
	}

	// set the current start time:
	this.running = true;
	this.startTime = Date.now();
	this.multiplier = mult;
	this.save(cb);
};

// Method used to stop working on a task:
TaskSchema.methods.stopTimer = function(cb) {
	if(this.running == false) {
		return; // nothing to change.
	}

	if(this.startTime<=0) {
		console.error("Invalid startTime value.");
	}

	// set the current start time:
	this.running = false;

	var that = this;

	// Create a new session from the previous info:
	var session = new TaskSession({
		startTime: this.startTime,
		stopTime: Date.now(),
		multiplier: this.multiplier,
		task: this,
	});

	console.log("Trying to save session...")
  session.save(function(err, session){
    if(err){ return cb(err,null); }

    var dur = (session.stopTime - session.startTime)/1000.0;
    console.log("Session duration: "+dur+" seconds.");

    that.sessions.push(session);
    that.save(cb);
  });
};


mongoose.model('Task', TaskSchema);
