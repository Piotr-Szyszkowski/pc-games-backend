const express = require("express");
const getReviews = require("../controllers/reviews-controller");
const reviewsRouter = express.Router();

reviewsRouter.get("/", getReviews);

module.exports = reviewsRouter;
