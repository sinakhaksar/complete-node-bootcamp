const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
	console.log("UNCAUGHT EXPEXTION! 💥 Shutting down...");
	console.log(err.name, err.message, err.stack);
	process.exit(1);
});

dotenv.config({ path: "./.env" });
const app = require("./app");

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
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log("app running 🔥 on prot: ", port);
});

//to catch unhandledRejection...
process.on("unhandledRejection", (err) => {
	console.log("UNCAUGHT REJECTION! 💥 Shutting down...");
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
