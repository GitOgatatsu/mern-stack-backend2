const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect("mongodb+srv://ogatatsu:puku123puku@cluster0.mq7iilc.mongodb.net/appDataBase2?retryWrites=true&w=majority");
		console.log("Success: Connected to MongoDB");
	} catch (err) {
		console.log("Failure: Unconnected to MongoDB");
		throw new Error();
	}
};

module.exports = connectDB;
