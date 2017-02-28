const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const User = require('./user');
const Schema = mongoose.Schema;


//Post Schema
const PostSchema = Schema({
  creatorId : { type: String, ref: 'User' },
  title    : { type: String, required: true},
  eventDate: { type: Date, default: Date.now }, // should be date of event . take from user
  date: { type: Date, default: Date.now },
  venue: { type: String, required: true},
  rules: { type: String,required: true}
});


const Post = module.exports = mongoose.model('Post', PostSchema);



// Access Post collection

module.exports.addPost = function(newPost, callback){
  newPost.save(callback);
}

module.exports.getAllPosts = function(id,callback){
  Post.find().exec(callback);
}

module.exports.getnearClub = function(location,callback){
  User.find({location: 'location'}).exec(callback);
}


