const express = require("express");
const { check } = require("express-validator");
const { sign } = require("jsonwebtoken");
const { signedIn, isAuthenticated } = require("../controllers/auth");
const router = express.Router();
const {
	getUserById,
	getUser,
	updateUserInfo,
	deleteUserInfo,
	uploadPhoto,
	photo,
	removePhoto,
} = require("../controllers/user");

router.param("userId", getUserById);

router.get("/:userId/profile", signedIn, isAuthenticated, getUser);

router.post(
	"/:userId/update",
	signedIn,
	isAuthenticated,
	[
		check("name")
			.optional()
			.isLength({ min: 3 })
			.withMessage("Name must atleast be 3 characters long"),
		check("password")
			.optional()
			.isLength({ min: 6 })
			.withMessage("Password must atleast be 6 characters long"),
		check("email").optional().isEmail().withMessage("Email is invalid"),
		check("number")
			.optional()
			.isMobilePhone("en-IN")
			.withMessage("Mobile number not valid"),
	],
	updateUserInfo
);

router.post("/:userId/photo/upload", signedIn, isAuthenticated, uploadPhoto);

router.delete("/:userId/photo/remove", signedIn, isAuthenticated, removePhoto);

router.get("/:userId/photo", photo);

router.delete("/:userId/delete", signedIn, isAuthenticated, deleteUserInfo);

module.exports = router;
