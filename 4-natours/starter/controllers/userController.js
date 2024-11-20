const User = require("../models/userModel");
const AppError = require("../utils/appError");
// const APIFeatures = require("../utils/apiFeatures");
// const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

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

exports.getAllUsers = catchAsync(async (req, res, next) => {
	const users = await User.find();

	// send response
	res.status(200).json({
		status: "success",
		results: users.length,
		data: { users },
	});
});

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

exports.createUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This route is not yet defind!",
	});
};

exports.getUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This route is not yet defind!",
	});
};

exports.updateUser = (req, res) => {
	// by ADMIN
	res.status(500).json({
		status: "error",
		message: "This route is not yet defind!",
	});
};

exports.deleteUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This route is not yet defind!",
	});
};
