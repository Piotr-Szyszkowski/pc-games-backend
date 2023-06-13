const express = require("express");
const {
  getReviews,
  getReviewById,
} = require("../controllers/reviews-controller");
const reviewsRouter = express.Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.route("/:review_id").get(getReviewById);

module.exports = reviewsRouter;
