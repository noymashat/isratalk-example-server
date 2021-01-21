var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT || 5000;

var admin = require("firebase-admin");

var serviceAccount = require("./service_account.json");
app.use(cors());

console.log(cors());

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://isratalk-76021.firebaseio.com",
});

app.use(bodyParser.json());
// app.use(function(req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header(
// 		"Access-Control-Allow-Headers",
// 		"Origin, X-Requested-With, Content-Type, Accept"
// 	);
// 	next();
// });
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.status(200).send("Hello");
});

app.post("/create", (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	return admin
		.auth()
		.createUser({
			email: email,
			password: password,
		})
		.then((userRecord) => {
			res.send(userRecord);
			console.log("Successfully created new user:", userRecord.uid);
			res.status(200).json("Success");
		})
		.catch((error) => {
			console.log("Error creating new user:", error);
			res.status(400).json(error);
		});
});

app.post("/delete", (req, res) => {
	const uid = req.body.uid;
	admin
		.auth()
		.deleteUser(uid)
		.then(() => {
			console.log("Successfully deleted user");
			res.status(200).json("Success");
		})
		.catch((error) => {
			console.log("Error deleting user:", error);
			res.status(400).json("Fail");
		});
});

app.listen(port, () => console.log(`Server started on port ${port}`));
