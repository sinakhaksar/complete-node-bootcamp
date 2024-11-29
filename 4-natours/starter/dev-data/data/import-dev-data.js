const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Tour = require("../../models/tourModel");
const User = require("../../models/userModel");
const Review = require("../../models/reviewModel");

dotenv.config({ path: "../../.env" });

mongoose
	.connect(process.env.DATABASE_LOCAL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("DB Connection successfull  ⏩import-dev-data");
	})
	.catch((err) => {
		console.error("💥DB Connection error ⏩import-dev-data\n", err);
		process.exit(1);
	});

// read json file
// let tours;
// try {
// 	// => javaScript object
// 	tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8")); //JSON
// } catch (err) {
// 	console.error("💥Error reading json file!");
// 	process.exit(1);
// }
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
	fs.readFileSync(`${__dirname}/reviews.json`, "utf-8"),
);
//import to db

const importData = async () => {
	try {
		await Tour.create(tours);
		await User.create(users, { validateBeforeSave: false });
		await Review.create(reviews);

		console.log("Data Successfully loaded! ");
		process.exit(0);
	} catch (err) {
		console.error(`💥${err}`);
		process.exit(1);
	}
};
// delete all data from collection

const deleteData = async () => {
	try {
		await Tour.deleteMany();
		await Review.deleteMany();
		await User.deleteMany();
		process.exit(0);
	} catch (err) {
		console.error(`💥${err}`);
		process.exit(1);
	}
};

if (process.argv[2] === "--import") {
	importData();
	console.log("all data imported");
} else if (process.argv[2] === "--delete") {
	deleteData();
	console.log("all data deleted");
} else {
	console.error("Invalid command!");
	process.exit(1);
}
