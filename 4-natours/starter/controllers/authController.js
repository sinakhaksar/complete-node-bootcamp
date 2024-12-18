const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);

	const cookieOptios = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 86_400_000,
		), // in milllisecnds:
		httpOnly: true,
	};
	if (process.env.NODE_ENV === "production") cookieOptios.secure = true;
	res.cookie("jwt", token, cookieOptios);
	//remove password form output
	user.password = undefined;

	res.status(statusCode).json({
		status: "success",
		token,
		data: {
			user,
		},
	});
};

const signToken = (id) => {
	return jwt.sign({ id: id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		passwordChangedAt: req.body.passwordChangedAt,
		createdAt: req.body.createdAt,
		role: req.body.role,
	});

	createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	//1) check if email && passwords exists
	if (!email || !password) {
		return next(new AppError("Please provid email and password!", 400));
	}
	//2) check if user exsits and password is correct
	const user = await User.findOne({ email }).select("+password");

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError("Incorrect eamil or password!", 401));
	}
	//3) if everything is ok, send token to client
	createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
	//1) Getting token and check if it's there
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	if (!token)
		return next(
			new AppError(
				"You are not logged in! Please login to get access.",
				401,
			),
		);
	//2) varification of the token
	// If no one changed the id thats in the payload
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	//3) check if user still exists
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(
			new AppError(
				"The user belonging to this token does no longer exist.",
				401,
			),
		);
	}
	//4) check if user changed password after token was issued
	// console.log(currentUser);

	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError(
				"you recently changed youre password, Please log in agin for safty,",
				401,
			),
		);
		//5) Grant access to protected route
	}

	req.user = currentUser;
	next();
});

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		// roles is an arr -> ['admin', 'lead-guide']
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError(
					"You don't have permission to perform this action!",
					403,
				),
			);
		}

		next();
	};
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
	// 1) if there is an accout for the email,
	const user = await User.findOne({ email: req.body.email });

	if (!user) return next(new AppError("no account of this email", 404));

	// 2) Generate the random rest token
	const resetToken = user.createPasswordResetToken();

	await user.save({ validateBeforeSave: false });

	// 3) send it to user's eamil
	const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;

	const message = `Forgot your Password? Submit a Patch request with your new password to : \n${resetURL}\nif you did't, Please ignore this email!`;

	try {
		await sendEmail({
			email: user.email,
			subject: "Password reset Token(valid for 5 minutes)",
			message,
		});
		res.status(200).json({
			status: "success",
			message: "token sent to eamil",
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(
			new AppError(
				"there was an error sending email, try again later! ",
				500,
			),
		);
	}
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	// 1) get user based on token
	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	if (!user)
		return next(new AppError("Token is invalid or has expierd", 400));
	//2 ) set new pass if token not expierd and there is a user
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();
	// 3) Update changedPasswordAt property for user

	//4) Log the user in, send JWT
	createSendToken(user, 200, res);
});

exports.uodatePassword = catchAsync(async (req, res, next) => {
	// 1) get user from collection
	const user = await User.findById(req.user._id).select("+password");

	// 2) check if the POSTed password is correnct
	if (!(await user.correctPassword(req.body.password, user.password))) {
		return next(new AppError("password not correct!\ntry again!", 401));
	}

	// 3) update password
	user.password = req.body.newPassword;
	user.passwordConfirm = req.body.newPasswordConfirm;
	await user.save();
	// 4) log user in, send JWT
	createSendToken(user, 200, res);
});
