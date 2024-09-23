const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
// Controllers
exports.aliasTopTours = async (req, res, next) => {
	req.query.limit = "5";
	req.query.sort = "-ratingAvrage,price";
	req.query.fields = "name,price,ratingAvrage,summary,difficulty";
	next();
};

exports.getAllTours = async (req, res) => {
	try {
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
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};

exports.getTour = async (req, res) => {
	try {
		const tour = await Tour.findById(req.params.id); // === Tour.findOne({_id: req.prams.id})
		res.status(200).json({
			status: "success",
			data: {
				tour,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};

exports.createTour = async (req, res) => {
	try {
		// const newTour = new Tour({});
		// newTour.save();

		const newTour = await Tour.create(req.body);
		res.status(201).json({
			status: "success",
			data: { tour: newTour },
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: "invalid data set", // Not Production code
		});
	}
};

exports.updateTour = async (req, res) => {
	try {
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		res.status(200).json({
			status: "success",
			data: {
				tour,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};

exports.deleteTour = async (req, res) => {
	try {
		await Tour.findByIdAndDelete(req.params.id);
		res.status(204).json({
			status: "succees",
			data: {
				tour: null,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err,
		});
	}
};

exports.getTourStats = async (req, res) => {
	try {
		const stats = await Tour.aggregate([
			{
				$match: { ratingAvrage: { $gte: 4.5 } },
			},
			{
				$group: {
					_id: { $toUpper: "$difficulty" },
					numTours: { $sum: 1 },
					numRating: { $sum: "$ratingQuantity" },
					avgRating: { $avg: "$ratingAvrage" },
					avgPrice: { $avg: "$price" },
					minPrice: { $min: "$price" },
					maxPrice: { $max: "$price" },
				},
			},
			{
				$sort: {
					avgPrice: 1,
				},
			},
			// {
			// 	$match: { _id: { $ne: "EASY" } },
			// },
		]);

		res.status(200).json({
			status: "succees",
			data: {
				status: stats,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};
