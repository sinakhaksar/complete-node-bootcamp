const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

// Controllers
exports.aliasTopTours = async (req, res, next) => {
	req.query.limit = "5";
	req.query.sort = "-ratingAvrage,price";
	req.query.fields = "name,price,ratingAvrage,summary,difficulty";
	next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
	// Execute the QUERY
	const features = new APIFeatures(Tour.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();

	const tours = await features.query;

	// send response
	res.status(200).json({
		status: "success",
		results: tours.length,
		data: { tours },
	});
});

exports.getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findById(req.params.id).populate("reviews"); // === Tour.findOne({_id: req.prams.id})

	if (!tour) {
		return next(new AppError("No Tour Found with that ID", 404));
	}
	res.status(200).json({
		status: "success",
		data: {
			tour,
		},
	});
});

exports.createTour = catchAsync(async (req, res, next) => {
	const newTour = await Tour.create(req.body); // BIG ----bug---- // sanetize bosdy don't get all the user input, there might be bad code ...
	res.status(201).json({
		status: "success",
		data: { tour: newTour },
	});
});

exports.updateTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!tour) {
		return next(new AppError("No Tour Found with that ID", 404));
	}

	res.status(200).json({
		status: "success",
		data: {
			tour,
		},
	});
});
exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
// 	const tour = await Tour.findByIdAndDelete(req.params.id);
// 	if (!tour) {
// 		return next(new AppError("No Tour Found with that ID", 404));
// 	}

// 	res.status(204).json({
// 		status: "succees",
// 		data: {
// 			tour: null,
// 		},
// 	});
// });

exports.getTourStats = catchAsync(async (req, res, next) => {
	const stats = await Tour.aggregate([
		{
			$match: {
				ratingsAverage: { $gte: 4.5 },
			},
		},
		{
			$group: {
				_id: { $toUpper: "$difficulty" },
				// _id: "$ratingsAverage",
				numTours: { $sum: 1 },
				numRatings: { $sum: "$ratingsQuantity" },
				avgRating: { $avg: "$ratingsAverage" },
				avgPrice: { $avg: "$price" },
				minPrice: { $min: "$price" },
				maxPrice: { $max: "$price" },
			},
		},
		{ $sort: { avgPrice: 1 } },
		// { $match: { _id: { $ne: "EASY" } } },
	]);
	res.status(200).json({
		status: "succees",
		data: {
			stats,
		},
	});
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
	const year = +req.params.year;
	const plan = await Tour.aggregate([
		{
			$unwind: "$startDates",
		},
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				},
			},
		},
		{
			$group: {
				_id: { $month: "$startDates" },
				toursCount: { $sum: 1 },
				// toursId: { $push: "$_id" },
				toursName: { $push: "$name" },
			},
		},
		{ $addFields: { month: "$_id" } },
		{ $project: { _id: 0 } },
		{ $sort: { toursCount: -1 } },
		{ $limit: 12 }, // not necessarily heare
	]);
	res.status(200).json({
		status: "success",
		data: {
			plan,
		},
	});
});
