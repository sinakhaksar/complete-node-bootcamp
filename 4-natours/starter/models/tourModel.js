const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "A Tour MUST have a name"],
			unique: true,
			trim: true,
		},
		duration: {
			type: Number,
			required: [true, "A Tour MUST have a duration"],
		},
		maxGroupSize: {
			type: Number,
			required: [true, "A Tour MUST have a GROUP SIZE"],
		},
		difficulty: {
			type: String,
			required: [true, "A Tour MUST have a  difficulty level"],
		},
		ratingsAverage: { type: Number, default: 4.5 },
		ratingsQuantity: { type: Number, default: 0 },
		price: { type: Number, required: [true, "A Tour MUST have a price"] },
		priceDiscout: Number,
		summary: {
			type: String,
			trim: true,
			required: [true, "A Tour MUST have a summary"],
		},
		description: {
			type: String,
			trim: true,
		},
		imageCover: {
			type: String,
			requird: [true, "A Tour MUST have a cover image "],
		},
		images: [String],
		createdAt: {
			type: Date,
			default: Date.now(),
			select: false,
		},
		startDates: [Date],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

tourSchema.virtual("durationWeeks").get(function () {
	return this.duration / 7;
});

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
