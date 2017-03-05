const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');
const config = require('../config/database');

// Register
router.post('/register', (req, res, next) => {
  var newUser = new User({
    name: req.body.name,
    email: req.body.email,
    yourlocation: req.body.yourlocation,
    username: req.body.username,
    password: req.body.password,
  });
  User.addingUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});
// Authenticate or login
router.post('/authenticate', function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;



  User.getUserByUsername(username,function(err,user){
  	if(err){
  		throw err;
  	}
  	if(!user){
  		res.json({success: false, msg:'User not found'});
  	}

  	User.comparePassword(password,user.password,function(err,isMatch){

  		if (err) {throw err};
  		if (isMatch) {
  			var token = jwt.sign(user,config.secret);

  			res.json({
  				success: true,
  				token: 'JWT '+token, // User can store this token as cookie
  				user: {
  					id: user._id,
  					name: user.name,
  					username: user.username,
  					email: user.email
  				}
  			});
  		}else{
			res.json({success: false, msg:'Wrong password'});
  		}
  	});
  });
});

// Get current user Profile
router.get('/profile',passport.authenticate('jwt', {session: false}) ,function(req, res, next){
  res.json({user: req.user});
});

// Get profile by userId
router.get('/profile/:userid',passport.authenticate('jwt', {session: false}) ,function(req, res, next){
  var userid = req.params.userid;
  User.getUserById(userid,function(err,user){

    if(err){
      throw err;
    }
    if(!user){
      res.json({success: false, msg: 'User not found'});
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        postcount: user.postcount,
        posts: posts
      }
    });

  });
});

// Add a Post corresponding to a user
router.post('/feed',passport.authenticate('jwt', {session: false}) ,function(req, res, next){
  var newPost = new Post({

    creatorId: req.user._id,
    title: req.body.title,
    eventDate: req.body.eventDate,
    venue: req.body.venue,
    rules: req.body.rules
  });

  Post.addPost(newPost, function(err,post){
    if(err){
      res.json({success: false, msg:'Failed to add post'});
    } else {
      res.json({success: true, msg:'Post added to database'});
    }
  });
});

// Get the feed 
router.get('/feed',passport.authenticate('jwt', {session: false}) ,function(req, res, next){

  posts = [];

  Post.getFeed(req.user._id,function(err,posts){
    if(err){
      res.json({success: false, msg:'Failed to get post'});
    } else {
      res.json({
        posts: posts,
        username: req.user.name
      });
    }
  });
});

// Get near club by location 
router.get('/feed/nearclub',passport.authenticate('jwt', {session: false}) ,function(req, res, next){

  nearclub = [];

  User.getnearClub(req.user.yourlocation,function(err,nearclub){
      if(err){
        res.json({success: false, msg:'Failed to get nearclub'});
      } else{
        res.json(nearclub);
      }
    });
});

module.exports = router;
