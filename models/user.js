const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

// User Schema
const UserSchema = Schema({
  name: { type: String,required: true},
  email: { type: String,required: true},
  username: { type: String,required: true},
  password: { type: String,required: true},
  yourlocation: {type: String},
  postcount: { type: Number}, 
  posts : [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});



const User = module.exports = mongoose.model('User', UserSchema);


/* --- All access and entry logic goes here --- */


// Access User collection
module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username}
  User.findOne(query, callback);
}

module.exports.addingUser = function(newUser, callback){

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

module.exports.getnearClub = function(location,callback){
  User.find({yourlocation: location}).exec(callback);
}

