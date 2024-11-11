const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please provide your name!"],
	},
	email: {
		type: String,
		required: [true, "Please provide your eamil!"],
		unique: true,
		lowercase: true, // converts the input to lowercase
		validate: [validator.isEmail, "Please provide a valid email!"],
	},
	photo: String,
	password: {
		type: String,
		required: [true, "Please provide a password"],
		minlength: 8,
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, "Please confirm your password "],
		validate: {
			validator: function (el) {
				return el === this.password;
			},
			message: "Passwords are not the same!",
		},
	},
});

userSchema.pre("save", async function (next) {
	//if password is !modified next
	if (!this.isModified("password")) return next();
	//hash the password with cost of 12.
	// 13 to 14 in cost would double the time of response.
	this.password = await bcrypt.hash(this.password, 13);
	// Delete the passwordConfirm. we only needed it for
	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.correctPassword = async function (
	canadiatePassword,
	userPassword,
) {
	return await bcrypt.compare(canadiatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
