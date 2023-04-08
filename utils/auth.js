const jwt = require("jsonwebtoken");
const secret_key = "mern-market";

const connectDB = require("./database");
const { UserModel } = require("./schemaModels");




const auth = async (req, res, next) => {
	if (req.method === "GET") {
		return next();
	}

	const token = await req.headers.authorization.split(" ")[1];
//	const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9nYXdhQHRlc3QuY29tIiwiaWF0IjoxNjgwODQwMjQ0LCJleHAiOjE2ODA5MjY2NDR9.XyyzW2rpjPL5H9iKd4cwBTZIoQFi7g_AKsclpNJhFIY";
	console.log(req.headers.authorization);
	if (!token) {
		return res.status(400).json({ message: "トークンがありません" });
	}

	try {
		const decoded = jwt.verify(token, secret_key);
//		console.log(decoded);
		req.body.email = decoded.email;
		await connectDB();
		const UserData = await UserModel.findOne({ email: req.body.email });
//		console.log(UserData);
		if (UserData.login !== true) {
			return res.status(400).json({ message: "ユーザログイン情報不正" });
		}
		next();
	} catch (err) {
		return res.status(400).json({ message: "トークンが不正です" });
	}

};

module.exports = auth;
