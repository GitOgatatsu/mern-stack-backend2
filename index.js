const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const jwt = require("jsonwebtoken");
const cors = require("cors");
app.use(cors());

const auth = require("./utils/auth");
const connectDB = require("./utils/database");
const { ItemModel, UserModel } = require("./utils/schemaModels");

const port = process.env.PORT || 5000;

// mongodb+srv://<username>:<password>@cluster0.mq7iilc.mongodb.net/?retryWrites=true&w=majority
// mongodb+srv://ogatatsu:puku123puku@cluster0.mq7iilc.mongodb.net/?retryWrites=true&w=majority



//app.get("/", (req, res) => {
//	return res.status(200).json("こんにちは");
//});



//// ITEM Functions
// Create Item
app.post("/item/create", auth, async (req, res) => {
	try {
		await connectDB();
//		console.log(req.body);
		await ItemModel.create(req.body);
//		return res.status(200).json("こんにちは");
		return res.status(200).json({ message: "アイテム作成成功" });
	} catch (error) {
		return res.status(400).json({ message: "アイテム作成失敗" });

	}
});



// Read All Items
app.get("/", async (req, res) => {
	try {
		await connectDB();
		const allItems = await ItemModel.find();
		return res.status(200).json({ message: "アイテム読み取り成功 (All)", allItems: allItems });
	} catch (err) {
		return res.status(400).json({ message: "アイテム読み取り失敗 (All)" });
	}
});



// Read Single Item
app.get("/item/:id", async (req, res) => {
	try {
		await connectDB();
//		console.log(req.params.id);
		const singleItem = await ItemModel.findById(req.params.id);
		return res.status(200).json({ message: "アイテム読み取り成功 (Single)", singleItem: singleItem });
	} catch (err) {
		return res.status(400).json({ message: "アイテム読み取り失敗 (Single)" });
	}
});



// Update Item
app.put("/item/update/:id", auth, async (req, res) => {
	try {
		await connectDB();
		const singleItem = await ItemModel.findById(req.params.id);
		if (singleItem.email === req.body.email) {
			await ItemModel.updateOne({ _id: req.params.id }, req.body);
			return res.status(200).json({ message: "アイテム編集成功" });
		} else {
			throw new Error();
		}
	} catch (err) {
		return res.status(400).json({ message: "アイテム編集失敗" });
	}
});



// Delete Item
app.delete("/item/delete/:id", auth, async (req, res) => {
	try {
		await connectDB();
		const singleItem = await ItemModel.findById(req.params.id);
		if (singleItem.email === req.body.email) {
			await ItemModel.deleteOne({ _id: req.params.id });
			return res.status(200).json({ message: "アイテム削除成功" });
		} else {
			throw new Error();
		}
	} catch (err) {
		return res.status(400).json({ message: "アイテム削除失敗" });
	}
});



//// USER Functions
// Register User
app.post("/user/register", async (req, res) => {
	try {
		await connectDB();
		await UserModel.create(req.body);
		return res.status(200).json({ message: "ユーザ登録成功" });
	} catch (err) {
		return res.status(400).json({ message: "ユーザ登録失敗" });
	}
});



// Login User
const secret_key = "mern-market";

app.post("/user/login", async (req, res) => {
	try {
		await connectDB();
		const UserData = await UserModel.findOne({ email: req.body.email });
		//		console.log(UserData);
		if (UserData) {
			if (req.body.password === UserData.password) {
				const payload = {
					email: req.body.email
				};
				const token = jwt.sign(payload, secret_key, { expiresIn: "24h" });
				console.log(token);
				await UserModel.updateOne({ _id: UserData.id }, { login: true });
				return res.status(200).json({ message: "ログイン成功" });
			} else {
				return res.status(400).json({ message: "ログイン失敗: パスワードが違います" });
			}
		} else {
			return res.status(400).json({ message: "ログイン失敗: ユーザが存在しません" });
		}
	} catch (err) {
		return res.status(400).json({ message: "ログイン失敗" });
	}
});



// Login User
app.post("/user/logout/:id", async (req, res) => {
	try {
		await connectDB();
		const UserData = await UserModel.findOne({ _id: req.params.id });
		if (UserData) {
				await UserModel.updateOne({ _id: UserData.id }, { login: false });
				return res.status(200).json({ message: "ログアウト成功" });
		} else {
			return res.status(400).json({ message: "ログアウト失敗: ユーザが存在しません" });
		}
	} catch (err) {
		return res.status(400).json({ message: "ログアウト失敗" });
	}
});




//// Listen
app.listen(5000, () => {
	console.log(`Listening on localhost port ${port}`);
});
