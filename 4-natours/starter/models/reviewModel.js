// review / rating / ref to tour / ref to user
const mongoose = require("mongoose");

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
		user: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "User",
				required: [true, "Review must belong to a user"],
			},
		],
		tour: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "Tour",
				required: [true, "Review must belong to a tour"],
			},
		],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

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

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
