const dotenv = require("dotenv");
const mongoose = require("mongoose");

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
app.listen(port, () => {
	console.log("app running on prot: ", port);
});
