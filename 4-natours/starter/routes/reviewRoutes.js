const express = require("express");

const reviewsController = require("../controllers/reviewController");
const authController = require("../controllers/authController");
const router = express.Router({ mergeParams: true });

// POST /tour/234u234/reviews
// POST /reviews
router
	.route("/")
	.get(reviewsController.getAllReviews)
	.post(
		authController.protect,
		authController.restrictTo("user"),
		reviewsController.makeReviews,
	);

module.exports = router;
