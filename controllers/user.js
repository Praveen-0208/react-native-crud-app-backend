const User = require("../models/User");
const { IncomingForm } = require("formidable");
const fs = require("fs");
const _ = require("lodash");
const { validationResult, check } = require("express-validator");
exports.getUserById = (req, res, next, id) => {
	User.findById({ _id: id }, (err, user) => {
		if (err) {
			return res.status(400).json({
				error: "CANNOT GET USER",
			});
		}

		req.user = user;
		next();
	});
};

exports.getUser = (req, res) => {
	res.json({
		name: req.user.name,
		email: req.user.email,
		number: req.user.number,
	});
};

exports.uploadPhoto = (req, res) => {
	const form = new IncomingForm({
		keepExtensions: true,
	});

	form.parse(req, (err, fields, files) => {
		if (files.profilepic) {
			if (files.profilepic.data > 6000000) {
				return res.status(400).json({
					error: "IMAGE SIZE TOO BIG",
				});
			}

			const user = req.user;

			user.profilepic.data = fs.readFileSync(files.profilepic.path);
			user.profilepic.contentType = files.profilepic.type;

			user.save((err, updatedUser) => {
				if (err) {
					return res.status(400).json({
						error: "IMAGE UPLOAD FAILED",
					});
				}

				res.json({
					message: "PHOTO UPLOADED",
				});
			});
		}
	});
};

exports.updateUserInfo = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
		});
	}
	const user = req.user;

	_.extend(user, req.body);
	user.save((err, updatedUser) => {
		if (err) {
			return res.status(400).json({
				error: "CANNOT UPDATE USER INFO",
			});
		}

		res.json(updatedUser);
	});
};

exports.photo = (req, res) => {
	if (req.user.profilepic.data) {
		res.set("Content-Type", req.user.profilepic.contentType);
		return res.send(req.user.profilepic.data);
	} else {
		return res.status(400).json({
			error: "image not found",
		});
	}
};

exports.removePhoto = (req, res) => {
	if (req.user.profilepic.data) {
		req.user.profilepic.data = undefined;
		req.user.save((err, user) => {
			if (err) {
				return res.status(400).json({
					error: "IMAGE REMOVE FAILED",
				});
			}

			res.json({
				message: "IMAGE REMOVED",
			});
		});
	} else {
		return res.status(400).json({
			error: "Image not Found",
		});
	}
};

exports.deleteUserInfo = (req, res) => {
	const user = req.user;
	user.remove((err, removedUser) => {
		if (err) {
			return res.status(400).json({
				error: "CANNOT DELETE USER",
			});
		}

		res.json(removedUser);
	});
};
