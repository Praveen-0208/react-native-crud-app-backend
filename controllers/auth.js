const { validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
		});
	}

	const { email } = req.body;
	const user = new User(req.body);
	User.findOne({ email }, (err, oldUser) => {
		if (oldUser) {
			return res.status(400).json({
				error: "USER ALREADY EXISTS",
			});
		}
		if (err) {
			return res.status(400).json({
				error: "DATABASE FIND ERROR",
			});
		}

		user.save((err, user) => {
			if (err) {
				return res.status(400).json({
					error: "FAILED TO ADD USER",
				});
			}

			return res.json({ id: user._id });
		});
	});
};

exports.signin = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
		});
	}

	const { email, password } = req.body;

	User.findOne({ email }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "ACCOUNT DOESNOT EXIST",
			});
		}

		if (!user.authenticate(password)) {
			return res.status(400).json({
				error: "PASSWORD DOESNOT MATCH",
			});
		}

		const expireTime = Date.now() + 4 * 3600000;
		const token = jwt.sign({ id: user._id }, process.env.SECRET, {
			expiresIn: expireTime,
		});

		return res.json({
			token,
			user: {
				id: user._id,
			},
		});
	});
};

exports.signout = (req, res) => {
	res.clearCookie("token");
	res.json({
		message: "Signed out ",
	});
};

exports.signedIn = expressJwt({
	secret: process.env.SECRET,
	userProperty: "auth",
	algorithms: ["HS256"],
});

exports.isAuthenticated = (req, res, next) => {
	let flag;

	flag = req.auth && req.user && req.auth.id == req.user._id; // since both ids are of different types, check only the value and hence use "=="
	if (!flag) {
		return res.status(403).json({
			error: "RESTRICTED ACTION",
		});
	}
	next();
};
