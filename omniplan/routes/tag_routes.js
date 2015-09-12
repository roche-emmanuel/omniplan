// This route is dedicated to handling the /tags path.

var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');

var mongoose = require('mongoose');
var Tag = mongoose.model('Tag');
var User = mongoose.model('User');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

router.param('tag', function(req, res, next, id) {
  console.log("Retrieving tag with id="+id);
  var query = Tag.findById(id);

  query.exec(function (err, task){
    if (err) { return next(err); }
    if (!task) { return next(new Error('can\'t find tag')); }

    req.tag = tag;
    return next();
  });
});

// Route to retrieve the list of all opened tasks
router.get('/', auth, function(req, res, next) {
  var uname = req.payload.username;
  User.findOne({username: uname}, function(err,user){
    if(err) { return next(err); }

    Tag.find({user: user._id},function(err, tags){
      if(err){ return next(err); }

      res.json(tags);
    });
  });
});

// Route to create a new tag by posting data:
router.post('/', auth, function(req, res, next) {
  var tag = new Tag(req.body);

  // Retrieve the user object by name:
  var uname = req.payload.username;
  User.findOne({username: uname}, function(err,user){
  	if(err) { return next(err); }
  	// console.log("Found user with name="+uname+", id="+user._id);

	  tag.user = user;

	  tag.save(function(err, tag){
	    if(err){ return next(err); }

	    res.json(tag);
	  });  	
  })
});


router.delete('/:tag', auth, function(req, res, next) {
  // console.log("Received request to delete tag="+req.tag._id);
  req.tag.remove(function(err,tag) {
    if (err) { return next(err); }

    // return the tag that was just removed:
    res.json(req.tag); 
  });
});

module.exports = router;
