const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "A Tour MUST have a name"],
			unique: true,
			trim: true,
		},
		slug: String,
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
		secretTour: { type: Boolean, default: false },
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

tourSchema.virtual("durationWeeks").get(function () {
	return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre("save", function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

// tourSchema.pre("save", function (next) {
// 	console.log("Will Save DOC ... ");
// 	next();
// });

// tourSchema.post("save", function (doc, next) {
// 	console.log(doc);
// 	next();
// });

// QUERT MIDDLEWARE
// tourSchema.pre("find", function (next) {
tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } });

	this.start = Date.now();
	next();
});

tourSchema.post(/^find/, function (docs, next) {
	console.log(`Query Took: ${Date.now() - this.start} milliSecends`);

	// console.log(docs);
	next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
	this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
	// console.log(this.pipeline());
	next();
});
const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
