const express = require("express");
const {
  getReviews,
  getReviewById,
  patchReviewById,
} = require("../controllers/reviews-controller");
const { getComments } = require("../controllers/comments-controller");
const reviewsRouter = express.Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.route("/:review_id").get(getReviewById).patch(patchReviewById);
reviewsRouter.route("/:review_id/comments").get(getComments);
module.exports = reviewsRouter;
