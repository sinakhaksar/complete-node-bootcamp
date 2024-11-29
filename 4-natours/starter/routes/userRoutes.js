const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetpassword/:token", authController.resetPassword);
router.patch(
	"/updatePassword",
	authController.protect,
	authController.uodatePassword,
);

router.get(
	"/me",
	authController.protect,
	userController.getMe,
	userController.getUser,
);
router.patch("/updateMe", authController.protect, userController.updateMe); // update data by user, when loged in
router.delete("/deleteMe", authController.protect, userController.deleteMe); // set ative to false

router
	.route("/")
	.get(userController.getAllUsers)
	.post(userController.createUser);

router
	.route("/:id")
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

module.exports = router;
