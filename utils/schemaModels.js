const mongoose = require("mongoose");
const Schema = mongoose.Schema;



// item
const ItemSchema = new Schema({
	title: String,
	image: String,
	price: String,
	description: String,
	email: String
});

exports.ItemModel = mongoose.model("Item", ItemSchema);



// user
const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	login: {
		type: Boolean,
		default: false
	}
});

exports.UserModel = mongoose.model("User", UserSchema);
