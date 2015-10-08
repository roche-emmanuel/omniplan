// This route is dedicated to handling the /tasks path.

var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');

var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var Tag = mongoose.model('Tag');
var User = mongoose.model('User');
var Note = mongoose.model('Note');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

router.param('task', function(req, res, next, id) {
  console.log("Retrieving task with id="+id);
  var query = Task.findById(id);

  query.exec(function (err, task){
    if (err) { return next(err); }
    if (!task) { return next(new Error('can\'t find task')); }

    req.task = task;
    return next();
  });
});

router.param('tag', function(req, res, next, id) {
  console.log("Retrieving tag with id="+id);
  var query = Tag.findById(id);

  query.exec(function (err, tag){
    if (err) { return next(err); }
    if (!tag) { return next(new Error('can\'t find tag')); }

    req.tag = tag;
    return next();
  });
});

router.param('state', function(req, res, next, id) {
  console.log("Retrieving state="+id);
  req.state = id;
  return next();
});

// router.param('comment', function(req, res, next, id) {
//   var query = Comment.findById(id);

//   query.exec(function (err, comment){
//     if (err) { return next(err); }
//     if (!comment) { return next(new Error('can\'t find comment')); }

//     req.comment = comment;
//     return next();
//   });
// });


// Route to retrieve the list of all opened tasks
router.get('/state/:state', auth, function(req, res, next) {
  Task.find({state: req.state},function(err, tasks){
    if(err){ return next(err); }

    res.json(tasks);
  });
});

// Route to create a new task by posting data:
router.post('/', auth, function(req, res, next) {
  var task = new Task(req.body);

  // Retrieve the user object by name:
  var uname = req.payload.username;
  User.findOne({username: uname}, function(err,user){
  	if(err) { return next(err); }
  	// console.log("Found user with name="+uname+", id="+user._id);

	  task.user = user.username;

	  task.save(function(err, task){
	    if(err){ return next(err); }

	    res.json(task);
	  });  	
  })
});


router.get('/:task', auth, function(req, res, next) {
  res.json(req.task); 
});


router.delete('/:task', auth, function(req, res, next) {
  // console.log("Received request to delete task="+req.task._id);
  req.task.remove(function(err,task) {
    if (err) { return next(err); }

    // return the task that was just removed:
    res.json(req.task); 
  });
});

router.put('/:task/state/:state', auth, function(req, res, next) {
  // console.log("Should set state of task "+req.task._id+" to "+req.state)
  req.task.setState(req.state,function(err, task){
    if (err) { return next(err); }

    res.json(task);
  });
});

router.put('/:task/start', auth, function(req, res, next) {
  console.log("Should start timer for task "+req.task._id+" with mult: "+req.body.multiplier);
  req.task.startTimer(req.body.multiplier,function(err, task){
    if (err) { return next(err); }

    res.json(task);
  });
});

router.put('/:task/stop', auth, function(req, res, next) {
  console.log("Should stop timer for task "+req.task._id);
  req.task.stopTimer(function(err, task){
    if (err) { return next(err); }

    res.json(task);
  });
});

router.get('/:task/tags', auth, function(req, res, next) {
  console.log("Should populate the tags for the task "+ req.task.title);
  
  req.task.populate('tags', function(err, task) {
    if (err) { return next(err); }

    res.json(task.tags);
  });
});

router.get('/:task/notes', auth, function(req, res, next) {
  console.log("Should populate the notes for the task "+ req.task.title);
  
  req.task.populate('notes', function(err, task) {
    if (err) { return next(err); }

    res.json(task.notes);
  });
});

router.put('/:task/note', auth, function(req, res, next) {
  console.log("Should add a note to task "+ req.task.title);
  var note = new Note(req.body);
  note.author = req.payload.username;
  note.task = req.task;

  note.assignID(function(err,note) {

    note.save(function(err, note){

      console.log("Adding note with id="+ note.id);
      req.task.notes.push(note);

      req.task.save(function(err, task) {
        if(err){ return next(err); }

        res.json(note);
      });
    });
  });
});

router.put('/:task/tag/:tag', auth, function(req, res, next) {
  console.log("Should add the tag "+req.tag.name+" to the task "+ req.task.title);
  req.task.tags.push(req.tag);

  req.task.save(function(err, task) {
    if(err){ return next(err); }

    res.json(req.tag);
  });
});

router.delete('/:task/tag/:tag', auth, function(req, res, next) {
  console.log("Should remove the tag "+req.tag.name+" from the task "+ req.task.title);

  // Note: the tag list is NOT populated here!
  // so we just have the tags IDs.
  var array = req.task.tags;
  for(var i = 0; i < array.length; i++) {
    var obj = array[i];

    // TODO: clarify why we have to use stringify here.
    // console.log("Comparing obj="+JSON.stringify(obj)+" to id="+JSON.stringify(req.tag._id), ", type:"+typeof(obj));
    if(JSON.stringify(obj) == JSON.stringify(req.tag._id)) {
      array.splice(i, 1);
      console.log("Removing obj="+JSON.stringify(obj));
      break;
    }
  }

  req.task.save(function(err, task) {
    if(err){ return next(err); }

    res.json(req.tag);
  });
});

// router.get('/posts/:post', function(req, res, next) {
//   req.post.populate('comments', function(err, post) {
//     if (err) { return next(err); }

//     res.json(post);
//   });
// });

// router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {

//   req.comment.upvote(function(err, comment){
//     if (err) { return next(err); }

//     res.json(comment);
//   });
// });

// router.post('/posts/:post/comments', auth, function(req, res, next) {
//   var comment = new Comment(req.body);
//   comment.post = req.post;
//   comment.author = req.payload.username;

//   comment.save(function(err, comment){
//     if(err){ return next(err); }

//     req.post.comments.push(comment);
//     req.post.save(function(err, post) {
//       if(err){ return next(err); }

//       res.json(comment);
//     });
//   });
// });

// router.post('/register', function(req, res, next) {
//   if(!req.body.username || !req.body.password){
//     return res.status(400).json({message: 'Please fill out all fields'});
//   }

//   var user = new User();

//   user.username = req.body.username;

//   user.setPassword(req.body.password);

//   user.save(function (err){
//     if(err){ return next(err); }

//     return res.json({token: user.generateJWT()});
//   });
// });

// router.post('/login', function(req, res, next){
//   if(!req.body.username || !req.body.password){
//     return res.status(400).json({message: 'Please fill out all fields'});
//   }

//   passport.authenticate('local', function(err, user, info){
//     if(err){ return next(err); }

//     if(user){
//       return res.json({token: user.generateJWT()});
//     } else {
//       return res.status(401).json(info);
//     }
//   })(req, res, next);
// });

module.exports = router;
