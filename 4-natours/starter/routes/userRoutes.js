const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();
// Open to everyOne
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetpassword/:token", authController.resetPassword);

// need to be authenticated for thease
router.use(authController.protect);

router.patch("/updateMe", userController.updateMe); // update data by user, when loged in
router.delete("/deleteMe", userController.deleteMe); // set ative to false
router.get("/me", userController.getMe, userController.getUser);
router.patch("/updatePassword", authController.uodatePassword);

router.use(authController.restrictTo("admin"));
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
