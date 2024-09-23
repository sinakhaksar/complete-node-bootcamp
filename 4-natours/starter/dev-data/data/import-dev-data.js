const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Tour = require("../../models/tourModel");

dotenv.config({ path: "./.env" });

mongoose
	.connect(process.env.DATABASE_LOCAL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("DB Connection successfull");
	});

// read json file
const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"),
);

//import to db

const importData = async () => {
	try {
		await Tour.create(tours);
		console.log("Data Successfully loaded!");
	} catch (err) {
		console.log(err);
	}
	process.exit();
};
// delete all data from collection

const deleteData = async () => {
	try {
		await Tour.deleteMany();
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

if (process.argv[2] === "--import") {
	importData();
} else if (process.argv[2] === "--delete") {
	deleteData();
}
