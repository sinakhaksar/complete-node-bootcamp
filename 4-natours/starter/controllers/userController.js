const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

// needed in UpdateMe
const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) {
			console.log(el);

			newObj[el] = obj[el];
		}
	});
	return newObj;
};

exports.getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};

// by user
exports.updateMe = catchAsync(async (req, res, next) => {
	//1) create an error if user POSTs password data
	if (req.body.password || req.body.passwordConfirm)
		return next(
			new AppError(
				"this route is not for password updates. Please use /updatePassword",
				404,
			),
		);

	//filterd out unwanted fields that are not allowed to update
	const filterdBody = filterObj(req.body, "name", "email");
	// 2) update user document
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: "success",
		data: {
			user: updatedUser,
		},
	});
});

exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });
	res.status(204).json({
		status: "success",
		data: null,
	});
});

exports.createUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This route is not defind! Please /signup insted",
	});
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
// Do Not Update Passwords with this!!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
