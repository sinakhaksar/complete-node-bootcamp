const Review = require("../models/reviewModel");
const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllReviews = catchAsync(async (req, res, next) => {
	const reviews = await Review.find();

	res.status(200).json({
		status: "sucsess",
		results: reviews.length,
		data: {
			reviews,
		},
	});
});

exports.makeReviews = catchAsync(async (req, res, next) => {
	const newReview = await Review.create({
		review: req.body.review,
		rating: req.body.rating,
		user: req.user.id,
		tour: req.body.tour,
	});
	res.status(201).json({
		status: "sucsess",
		data: newReview,
	});
});
