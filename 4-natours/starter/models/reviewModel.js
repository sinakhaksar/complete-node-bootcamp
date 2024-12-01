// review / rating / ref to tour / ref to user
const mongoose = require("mongoose");
const Tour = require("../models/tourModel");

const reviewSchema = new mongoose.Schema(
	{
		review: {
			type: String,
			required: [true, "Review can't be empty!"],
			minLength: [10, "review must be at least 10 characters"],
			maxLength: [500, "review must be under 500 characters"],
		},
		rating: {
			type: Number,
			min: [0, "rating must be above 0"],
			max: [5, "rating must be under 5"],
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: [true, "Review must belong to a user"],
		},

		tour: {
			type: mongoose.Schema.ObjectId,
			ref: "Tour",
			required: [true, "Review must belong to a tour"],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true }); // each comenation of user and tour has alwase be uniqe

reviewSchema.pre(/^find/, function (next) {
	// this.populate({
	// 	path: "tour",
	// 	select: "name ",
	// }).populate({
	// 	path: "user",
	// 	select: "name photo",
	// });

	this.populate({
		path: "user",
		select: "name",
	});

	next();
});

reviewSchema.statics.calcAvrageRating = async function (tourId) {
	const stats = await this.aggregate([
		{
			$match: { tour: tourId },
		},
		{
			$group: {
				_id: "$tour",
				nRating: { $sum: 1 },
				avgRating: { $avg: "$rating" },
			},
		},
	]);
	// console.log(stats);
	if (stats.length > 0) {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: stats[0].nRating,
			ratingsAverage: stats[0].avgRating,
		});
	} else {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: 0,
			ratingsAverage: 4.5,
		});
	}
};

reviewSchema.post("save", function () {
	// this points to current review
	this.constructor.calcAvrageRating(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
	this.r = await this.findOne();
	next();
});

reviewSchema.post(/^findOneAnd/, async function () {
	await this.r.constructor.calcAvrageRating(this.r.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
