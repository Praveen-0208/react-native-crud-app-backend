const express = require("express");
const { check } = require("express-validator");
const { signup, signin, signout } = require("../controllers/auth");
const router = express.Router();

router.post(
	"/signup",
	[
		check("name")
			.isLength({ min: 3 })
			.withMessage("Name must atleast be 3 characters long"),
		check("password")
			.isLength({ min: 6 })
			.withMessage("Password must atleast be 6 characters long"),
		check("email").isEmail().withMessage("Email is invalid"),
		check("number")
			.isMobilePhone("en-IN")
			.withMessage("Mobile number not valid"),
	],
	signup
);

router.post(
	"/signin",
	[
		check("email").isEmail().withMessage("Email is not valid"),
		check("password")
			.isLength({ min: 6 })
			.withMessage("Password must atleast be 6 characters long"),
	],
	signin
);

router.get("/signout", signout);

module.exports = router;
