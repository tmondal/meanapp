const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const Schema = mongoose.Schema;

// User Schema
const UserSchema = Schema({
  name: { type: String},
  email: { type: String,required: true},
  username: { type: String,required: true},
  password: { type: String,required: true},
  postcount: { type: Number}, 
  // posts : [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});

// // Post Schema
// const PostSchema = Schema({
//   creatorId : { type: String, ref: 'User' },
//   title    : { type: String, required: true},
//   eventDate: { type: String},
//   venue: { type: String, required: true},
//   rules: { type: String,required: true}
// });

const User = module.exports = mongoose.model('User', UserSchema);
// const Post = module.exports = mongoose.model('Post', PostSchema);


/* --- All access and entry logic goes here --- */


// Access User collection
module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username}
  User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

// compare candidate entered password and hashed password form db.
module.exports.comparePassword = function(candidatePassword,hash,callback){
	bcrypt.compare(candidatePassword,hash,function(err,isMatch){
		if (err) {throw err;}
		callback(null,isMatch);
	});
}


// Access Post collection

// module.exports.addPost = function(newPost, callback){

//   newPost.save(callback);
// }

// module.exports.getAllPosts = function(id,callback){

//   Post.find({ venue: 'Eden' }).exec(callback);
// }






