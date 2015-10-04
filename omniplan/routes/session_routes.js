// This route is dedicated to handling the /tasks path.

var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');

var mongoose = require('mongoose');
var Session = mongoose.model('TaskSession');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


// Route to find all sessions in a given time range:
router.post('/get', auth, function(req, res, next) {
  
  var startTime = req.body.startTime;
  var stopTime = req.body.stopTime;
  console.log("Searching sessions with startTime="+startTime+", stopTime="+stopTime);

  // Search for all the sessions in the given time range:
  var uname = req.payload.username;
  Session.find({user: uname, startTime: { $gte: startTime, $lt: stopTime}}, function(err,list){
  	if(err) { return next(err); }
  	console.log("Found list of "+list.length+" sessions.");

    res.json(list);
  });
});

module.exports = router;
