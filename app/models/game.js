var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');
var id = mongoose.Types.ObjectId()

// user schema 
var GameSchema   = new Schema({
   // _id: {type: mongoose.Schema.Types.ObjectId, required:true, auto: true, index: true, unique: true},
    //_id: { type: mongoose.Schema.Types.ObjectId, auto: true},
    name: String,
    players: { type : Array , "default" : [] },
    map: { type : Array , "default" : [] }
	// username: { type: String, required: true, index: { unique: true }},
	// password: { type: String, required: true, select: false }
});

module.exports = mongoose.model('Game', GameSchema);