const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { Model } = require("mongoose");

exports.deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);
		if (!doc) {
			return next(new AppError("No document Found with that ID", 404));
		}

		res.status(204).json({
			status: "succees",
			data: {
				data: null,
			},
		});
	});

exports.updateOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!doc) {
			return next(new AppError("No document Found with that ID", 404));
		}

		res.status(200).json({
			status: "success",
			data: {
				data: doc,
			},
		});
	});

exports.createOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body); // BIG ----bug---- // sanetize bosdy don't get all the user input, there might be bad code ...
		res.status(201).json({
			status: "success",
			data: { data: doc },
		});
	});
