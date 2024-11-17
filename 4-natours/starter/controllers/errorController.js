const AppError = require("../utils/appError");

const handleValidationErroDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.join(". ")}`;
	return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
	const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]; // to get the name betwin // in errmsg
	console.log(value);

	const message = `Duplicate field value: ${value}. Please use another name!`;
	return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppError(message, 400);
};

const handleJWTError = () =>
	new AppError("Invalid token. Please log in again!", 401);

const handleExpiredError = () =>
	new AppError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		err: err,
		stack: err.stack,
	});
};

const sendErrorProd = (err, res) => {
	// Operational, trusted error: sent message to client
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
		// Programming Error or other unknown error: don't leak error details
	} else {
		// 1) Log error
		console.error("ERROR 💥", err);
		// 2) send genric message
		res.status(500).json({
			status: "error",
			message: "something went very Wrong!",
		});
	}
};

module.exports = (err, req, res, next) => {
	// console.log(err.stack);
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === "production") {
		let error = { ...err };
		if (err.name === "CastError") error = handleCastErrorDB(err);
		if (err.code === 11000) error = handleDuplicateFieldsDB(err);
		if (err.name === "ValidationError") error = handleValidationErroDB(err);
		if (err.name === "JsonWebTokenError") error = handleJWTError();
		if (err.name === "TokenExpiredError") error = handleExpiredError();
		sendErrorProd(error, res);
	}
};
