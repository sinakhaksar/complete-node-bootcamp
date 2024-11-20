const express = require("express");
const morgan = require("morgan");

// security pacages
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const GlobalErrorHandler = require("./controllers/errorController");

const app = express();

// 1) Global Middelwares
// Set Security HTTP headers
app.use(helmet());

// Developmet logging
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Limit request from same ip
const limiter = rateLimit({
	max: 100,
	windowMs: 3_6000_000, // 1 hour
	message: "to many requests from this ip, Please try again in an hour",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(
	express.json({
		limit: "10kb",
	}),
);

app.use(mongoSanitize()); // Data sanitization Nosql ingections
app.use(xss()); // prevent XSS
app.use(
	hpp({
		whitelist: [
			// this ones are allowed to pollution
			"duration",
			"ratingsQuantity",
			"ratingsAverage",
			"maxGroupSize",
			"difficulty",
			"price",
		],
	}),
); // prevent prameter pollution

//serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	// console.log(req.headers);
	next();
});

// 2) routing ...
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(GlobalErrorHandler);
// it's to run server... (in server.js)
module.exports = app;
