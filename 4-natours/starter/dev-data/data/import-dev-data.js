const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Tour = require("../../models/tourModel");

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
let tours;
try {
	// => javaScript object
	tours = JSON.parse(
		fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"),
	); //JSON
} catch (err) {
	console.error("💥Error reading json file!");
	process.exit(1);
}
//import to db

const importData = async () => {
	try {
		await Tour.create(tours);
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
}
