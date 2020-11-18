const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ** middlewares
app.use(bodyparser.json());
app.use(cookieparser());
app.use(cors());

//** database connection
mongoose
	.connect(process.env.MONGO_URL, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(() => {
		console.log("DATABASE CONNECTED SUCCESSFULLY...");
	})
	.catch((err) => {
		console.log("DATABASE CONNECTION FAILED");
	});

//** routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
	res.send("it works...");
});

app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.listen(port, () => {
	console.log(`Server running at port ${port}`);
});
