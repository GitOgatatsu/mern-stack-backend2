const jwt = require("jsonwebtoken");
const secret_key = "mern-market";



const auth = async (req, res, next) => {
	if (req.method === "GET") {
		return next();
	}

//	const token = await req.header.authorization.split(" ")[1];
	const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9nYXdhQHRlc3QuY29tIiwiaWF0IjoxNjgwNzgyMTc4LCJleHAiOjE2ODA3ODI0Nzh9.nywYQT5jZna7qa64W1C_ewhU8juN8tFt9OkVtW2pGOM";
	console.log(req.header.authorization);
	if (!token) {
		return res.status(400).json({ message: "トークンがありません" });
	}

	try {
		const decoded = jwt.verify(token, secret_key);
//		console.log(decoded);
		req.body.email = decoded.email;
		next();
	} catch (err) {
		return res.status(400).json({ message: "トークンが不正です" });
	}

};

module.exports = auth;
