const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require("./userModel");
// const validator = require("validator");

const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "A Tour MUST have a name"],
			unique: true,
			trim: true,
			maxLength: [
				40,
				"A tour name must be shorter or equal to 40 characters",
			],
			minLength: [
				10,
				"A tour name must be longer or equal to 10 characters",
			],
			// Demenstration of useing 3rd party valdator
			// validate: [
			// 	validator.isAlpha,
			// 	"Tour name must only contain Characters",
			// ],
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
			enum: {
				values: ["easy", "medium", "difficult"],
				message: "Difficulty is either easy, medium or difficult",
			},
		},
		ratingsAverage: {
			type: Number,
			default: 4.5,
			min: [1, "Rating must be above 1.0"],
			max: [5, "Rating must be below 5.0"],
			set: (val) => Math.round(val * 10) / 10, // it's a trick (it rounds the value )
		},
		ratingsQuantity: { type: Number, default: 0 },
		price: { type: Number, required: [true, "A Tour MUST have a price"] },
		priceDiscout: {
			type: Number,
			validate: {
				validator: function (val) {
					//this only points to current doc on NEW doc creation
					return val < this.price;
				},
				message: "Discount Price({VALUE}) should be BELOW price",
			},
		},
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
		startLocation: {
			//GeoJson
			type: {
				type: String,
				default: "Point",
				enum: ["Point"],
			},
			coordinates: [Number],
			address: String,
			description: String,
		},
		locations: [
			{
				type: {
					type: String,
					default: "Point",
					enum: ["Point"],
				},
				coordinates: [Number],
				address: String,
				description: String,
				day: Number,
			},
		],
		guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// tours indexing ...
// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 }); // compound go solo as well, so it index for price alone as well
tourSchema.index({ slug: 1 });
// indexing for Geo location search
tourSchema.index({ startLocation: "2dsphere" });

tourSchema.virtual("durationWeeks").get(function () {
	return this.duration / 7;
});

// Virutal Populate
tourSchema.virtual("reviews", {
	ref: "Review",
	foreignField: "tour",
	localField: "_id",
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre("save", function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

// this way guides will be imbed with the tour document,
// tourSchema.pre("save", async function (next) {
// 	const guidesPromises = this.guides.map(
// 		async (id) => await User.findById(id),
// 	);
// 	this.guides = await Promise.all(guidesPromises);
// });

// tourSchema.pre("save", function (next) {
// 	console.log("Will Save DOC ... ");
// 	next();
// });

// tourSchema.post("save", function (doc, next) {
// 	console.log(doc);
// 	next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre("find", function (next) {
tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } });

	this.start = Date.now();
	next();
});

tourSchema.pre(/^find/, function (next) {
	this.populate({
		path: "guides",
		select: "-__v -passwordChangedAt",
	});
	next();
});

tourSchema.post(/^find/, function (docs, next) {
	console.log(`Query Took: ${Date.now() - this.start} milliSecends`);

	// console.log(docs);
	next();
});

// AGGREGATION MIDDLEWARE
// tourSchema.pre("aggregate", function (next) {
// 	this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
// 	console.log(this.pipeline());
// 	next();
// });
const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
